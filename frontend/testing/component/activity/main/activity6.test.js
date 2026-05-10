// testing/activity_six.test.js

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

import ActivitySixScreen from "@/components/activity/main/activity6.tsx";

jest.mock("react-native-keyboard-aware-scroll-view", () => {
  const React = require("react");

  const MockKeyboardAwareScrollView = ({ children }) =>
    React.createElement(React.Fragment, null, children);

  return {
    __esModule: true,
    KeyboardAwareScrollView: MockKeyboardAwareScrollView,
  };
});

jest.mock("react-native-signature-canvas", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const MockSignature = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      readSignature: () => {
        props.onOK("base64-signature");
      },
    }));

    return (
      <Text testID="signature-pad" onPress={() => props.onBegin()}>
        Signature Pad
      </Text>
    );
  });

  return {
    __esModule: true,
    default: MockSignature,
  };
});

jest.mock("@/components/ui/button.tsx", () => {
  const React = require("react");
  const { Text } = require("react-native");

  const MockButton = ({ onPress, text }) => (
    <Text onPress={onPress}>{text}</Text>
  );

  return {
    __esModule: true,
    default: MockButton,
  };
});

jest.mock("@/services/base64", () => ({
  base64ToRNFile: jest.fn(() =>
    Promise.resolve({
      uri: "file://test.png",
    }),
  ),
}));

describe("ActivitySixScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    global.alert = jest.fn();

    const { useAppContext } = require("@/context/AppContext");

    useAppContext.mockReturnValue({
      user: {
        id: "user1",
      },
      team: {
        id: "team1",
      },
    });

    const { uploadMedia } = require("@/services/media/media");

    uploadMedia.mockResolvedValue({
      id: "media123",
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders prediction cards", async () => {
    const { getByText } = render(<ActivitySixScreen />);

    expect(getByText("Phase 1 — Reaction Test (Dominant Hand)")).toBeTruthy();
    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    expect(
      getByText("Phase 2 — Reaction Test (Non-Dominant Hand)"),
    ).toBeTruthy();
    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    expect(getByText("Phase 3 — Tracing Challenge")).toBeTruthy();
  });

  it("resets on retry", async () => {
    jest.useFakeTimers();
    const { getByText } = render(<ActivitySixScreen />);

    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    fireEvent.press(getByText("Confirm"));
    fireEvent.press(getByText("Retry"));

    expect(getByText("Phase 1 — Reaction Test (Dominant Hand)")).toBeTruthy();
  });

  it("submits successfully", async () => {
    const { uploadMedia } = require("@/services/media/media");
    const { socket } = require("@/services/socket");

    jest.useFakeTimers();
    const { getByText } = render(<ActivitySixScreen />);

    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    fireEvent.press(getByText("Confirm"));
    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(uploadMedia).toHaveBeenCalled();
    });

    expect(socket.emit).toHaveBeenCalledWith(
      "submit_result_user",
      expect.objectContaining({
        activityId: "6",
      }),
    );

    expect(global.alert).toHaveBeenCalledWith(
      "Successfully submitted the results and predictions!",
    );
  });

  it("shows waiting screen after submit", async () => {
    jest.useFakeTimers();
    const { getByText } = render(<ActivitySixScreen />);

    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    fireEvent.press(getByText("Start"));
    act(() => {
      jest.advanceTimersByTime(3 * 60 * 1000); // skip 3 minutes instantly
    });
    await waitFor(() => {
      expect(getByText("Stop")).toBeTruthy();
    });
    fireEvent.press(getByText("Stop"));

    fireEvent.press(getByText("Confirm"));
    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(getByText("Waiting for teammates...")).toBeTruthy();
    });
  });

  it("navigates when socket submit done event fires", async () => {
    const { socket } = require("@/services/socket");
    const { router } = require("expo-router");

    render(<ActivitySixScreen />);

    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "submit_result_done",
    )[1];

    act(() => {
      handler({
        activityId: "6",
        isDone: true,
      });
    });

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/activity/6/results");
    });
  });
});
