import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from "@testing-library/react-native";
import { Alert, Vibration } from "react-native";
import ActivityFourScreen from "@/components/activity/main/activity4";
import { uploadMedia45 } from "@/services/media/media";
import { submitResult } from "@/services/result/result";

// --- Mocks ---
jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: () => ({ background: "#fff", blackText: "#000" }),
}));
jest.mock("@/context/AppContext", () => ({
  useAppContext: () => ({ team: { id: "team1" } }),
}));
jest.mock("@/services/util", () => ({ estimateDistance: jest.fn(() => 1.5) }));

jest.mock("expo-sensors", () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

jest.mock("@/components/activity/main/main-activity-style", () => ({
  createMainActivityStyles: () => ({
    mainView: { flex: 1 },
    buttonContainer: {},
    buttonPopup: {},
    buttonText: {},
    modalContainer: {},
    titleModalText: {},
    closeButton: {},
    scrollView: {},
    backBtn: {},
    btnText: {},
    disabledBtn: {},
    titleText45: {},
    timer: {},
    circle: {},
    stopCircle: {},
    circleText: {},
  }),
}));

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return function MockButton({ onPress, text, isDisabled, isLoading }) {
    return (
      <TouchableOpacity disabled={isDisabled || isLoading} onPress={onPress}>
        <Text>{isLoading ? "Loading..." : text}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("@/components/activity/submission/activity4-submission-card", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity, TextInput } = require("react-native");
  return function MockSubmissionCard(props) {
    return (
      <View>
        <Text>{`Submission ${props.item}`}</Text>
        <TextInput
          placeholder="Movement"
          value={props.movement}
          onChangeText={props.onChangeMovement}
        />
        <TouchableOpacity onPress={props.onDelete}>
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onRerecord}>
          <Text>Rerecord</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Mock Vibration
const mockVibrate = jest.fn();
const mockCancel = jest.fn();

jest.mock("react-native", () => {
  const actualRN = jest.requireActual("react-native");
  return {
    ...actualRN,
    Vibration: {
      vibrate: mockVibrate,
      cancel: mockCancel,
    },
  };
});

// --- Tests ---

describe("ActivityFourScreen", () => {
  let dateNowSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    let mockTime = 1000000;
    dateNowSpy = jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => mockTime);

    global.setMockTime = (time) => {
      mockTime = time;
    };

    jest.spyOn(Alert, "alert").mockImplementation((title, msg, buttons) => {
      if (buttons && buttons[1] && buttons[1].text === "OK") {
        buttons[1].onPress();
      }
    });
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const performRecordingFlow = async (queries) => {
    const startTime = 1000000;
    global.setMockTime(startTime);

    await act(async () => {
      fireEvent.press(queries.getByText(/Start/));
    });

    global.setMockTime(startTime + 2000);
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await act(async () => {
      fireEvent.press(queries.getByText(/Stop/));
    });

    await act(async () => {
      fireEvent.press(queries.getByText("Confirm Submission"));
    });
  };

  it("submits successfully with 3 vibrations", async () => {
    uploadMedia45.mockResolvedValue({ id: "media1" });
    submitResult.mockResolvedValue({ success: true });

    const utils = render(<ActivityFourScreen />);
    const { getByText, getAllByPlaceholderText } = utils;

    for (let i = 0; i < 3; i++) {
      await performRecordingFlow(utils);

      if (i < 2) {
        fireEvent.press(getByText("Add Another Submission"));
      }
    }

    const inputs = getAllByPlaceholderText("Movement");
    inputs.forEach((input) => fireEvent.changeText(input, "10"));

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(uploadMedia45).toHaveBeenCalledTimes(3);
      expect(submitResult).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        expect.any(String),
        expect.any(Array),
      );
    });
  });

  it("shows validation alert if less than 3 vibrations", async () => {
    const utils = render(<ActivityFourScreen />);
    const { getByText, getAllByPlaceholderText } = utils;

    await performRecordingFlow(utils);

    const inputs = getAllByPlaceholderText("Movement");
    fireEvent.changeText(inputs[0], "10");

    fireEvent.press(getByText("Submit"));

    expect(global.alert).toHaveBeenCalledWith(
      expect.stringContaining("3 inputs"),
    );
  });

  it("alerts when submitting incomplete fields", async () => {
    const utils = render(<ActivityFourScreen />);
    const { getByText } = utils;

    await performRecordingFlow(utils);

    fireEvent.press(getByText("Submit"));

    expect(global.alert).toHaveBeenCalledWith("Please fill all fields.");
  });
});
