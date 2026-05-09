// testing/component/activity7.test.js

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

import ActivitySevenScreen from "@/components/activity7";

// ---- SCREEN SPECIFIC MOCKS ----

jest.mock("@/components/ui/audio-player", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    __esModule: true,
    default: ({ uri }) => <Text>{uri}</Text>,
  };
});

jest.mock("@/components/ui/audio-recording", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    __esModule: true,
    default: ({ onPressButton, setResult, type, buttonText, title }) => (
      <>
        <Text>{title}</Text>

        <Text
          onPress={() => {
            setResult((prev) => ({
              ...prev,
              [type]: {
                uri: `audio-${type}.mp3`,
                levels: [1, 2, 3],
              },
            }));

            onPressButton();
          }}
        >
          {buttonText}
        </Text>
      </>
    ),
  };
});

describe("ActivitySevenScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  it("renders first recorder phase", () => {
    const { getByText } = render(<ActivitySevenScreen />);

    expect(getByText("Breathing at Rest")).toBeTruthy();

    expect(getByText("Next")).toBeTruthy();
  });

  it("moves through recording phases", () => {
    const { getByText, getAllByText } = render(<ActivitySevenScreen />);

    fireEvent.press(getByText("Next"));

    expect(getByText("Breathing after Exercise 1")).toBeTruthy();

    fireEvent.press(getByText("Next"));

    expect(getByText("Breathing after Exercise 2")).toBeTruthy();

    fireEvent.press(getByText("Confirm"));

    expect(getAllByText("Breath per Minute")[0]).toBeTruthy();
  });

  it("submits successfully", async () => {
    const { uploadMedia } = require("@/services/media/media");
    const { socket } = require("@/services/socket");

    jest
      .spyOn(React, "useState")
      // submitLoading
      .mockImplementationOnce(() => [false, jest.fn()])

      // phase
      .mockImplementationOnce(() => [4, jest.fn()])

      // result
      .mockImplementationOnce(() => [
        {
          1: {
            uri: "audio1.mp3",
            levels: [1],
          },
          2: {
            uri: "audio2.mp3",
            levels: [1],
          },
          3: {
            uri: "audio3.mp3",
            levels: [1],
          },
        },
        jest.fn(),
      ])

      // userInput
      .mockImplementationOnce(() => [
        {
          1: "10",
          2: "20",
          3: "30",
        },
        jest.fn(),
      ])

      // isEditing
      .mockImplementationOnce(() => [
        {
          title: "",
          type: 0,
        },
        jest.fn(),
      ])

      // isWaitingResult
      .mockImplementationOnce(() => [false, jest.fn()]);

    const { getByText } = render(<ActivitySevenScreen />);

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(uploadMedia).toHaveBeenCalledTimes(3);
    });

    expect(socket.emit).toHaveBeenCalledWith(
      "submit_result_user",
      expect.objectContaining({
        activityId: "7",
      }),
    );

    expect(global.alert).toHaveBeenCalledWith(
      "Successfully submitted the audios and predictions!",
    );
  });

  it("shows waiting screen after submit", async () => {
    jest
      .spyOn(React, "useState")
      // submitLoading
      .mockImplementationOnce(() => [false, jest.fn()])

      // phase
      .mockImplementationOnce(() => [4, jest.fn()])

      // result
      .mockImplementationOnce(() => [
        {
          1: {
            uri: "audio1.mp3",
            levels: [1],
          },
          2: {
            uri: "audio2.mp3",
            levels: [1],
          },
          3: {
            uri: "audio3.mp3",
            levels: [1],
          },
        },
        jest.fn(),
      ])

      // userInput
      .mockImplementationOnce(() => [
        {
          1: "10",
          2: "20",
          3: "30",
        },
        jest.fn(),
      ])

      // isEditing
      .mockImplementationOnce(() => [
        {
          title: "",
          type: 0,
        },
        jest.fn(),
      ])

      // isWaitingResult
      .mockImplementationOnce(() => [true, jest.fn()]);

    const { getByText } = render(<ActivitySevenScreen />);

    expect(getByText("Waiting for teammates...")).toBeTruthy();
  });

  it("navigates when socket event completes", async () => {
    const { socket } = require("@/services/socket");
    const { router } = require("expo-router");

    render(<ActivitySevenScreen />);

    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "submit_result_done",
    )[1];

    act(() => {
      handler({
        activityId: "7",
        isDone: true,
      });
    });

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)/activity/7/results");
    });
  });
});
