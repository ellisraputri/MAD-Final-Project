// testing/component/ui/live-recorder.test.js

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LiveRecorder from "@/components/ui/audio-recording";
import { Audio } from "expo-av";

const mockStopAndUnloadAsync = jest.fn();
const mockGetURI = jest.fn(() => "file://audio.mp3");
const mockGetStatusAsync = jest.fn(() =>
  Promise.resolve({
    metering: -20,
  }),
);

jest.mock("expo-av", () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    setAudioModeAsync: jest.fn(),
    Recording: {
      createAsync: jest.fn(),
    },
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
  },
}));

describe("LiveRecorder", () => {
  const mockSetResult = jest.fn();
  const mockOnPressButton = jest.fn();

  const mockRecording = {
    stopAndUnloadAsync: mockStopAndUnloadAsync,
    getURI: mockGetURI,
    getStatusAsync: mockGetStatusAsync,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    Audio.Recording.createAsync.mockResolvedValue({
      recording: mockRecording,
    });
  });

  const defaultProps = {
    title: "Breathing Test",
    buttonText: "Next",
    buttonWidth: 120,
    type: 1,
    isDisabledButton: false,
    setResult: mockSetResult,
    onPressButton: mockOnPressButton,
  };

  it("renders correctly", () => {
    const { getByText } = render(<LiveRecorder {...defaultProps} />);

    expect(getByText("Breathing Test")).toBeTruthy();
    expect(getByText("00:00")).toBeTruthy();
    expect(getByText("mic")).toBeTruthy();
    expect(getByText("Next")).toBeTruthy();
  });

  it("starts recording when mic button is pressed", async () => {
    const { getByText } = render(<LiveRecorder {...defaultProps} />);

    fireEvent.press(getByText("mic"));

    await waitFor(() => {
      expect(Audio.requestPermissionsAsync).toHaveBeenCalled();

      expect(Audio.setAudioModeAsync).toHaveBeenCalled();

      expect(Audio.Recording.createAsync).toHaveBeenCalled();

      expect(mockSetResult).toHaveBeenCalled();
    });
  });

  it("stops recording when stop button is pressed", async () => {
    const { getByText } = render(<LiveRecorder {...defaultProps} />);

    fireEvent.press(getByText("mic"));

    await waitFor(() => {
      expect(Audio.Recording.createAsync).toHaveBeenCalled();
    });

    fireEvent.press(getByText("stop"));

    await waitFor(() => {
      expect(mockStopAndUnloadAsync).toHaveBeenCalled();

      expect(mockGetURI).toHaveBeenCalled();
    });
  });

  it("calls onPressButton after recording finished", async () => {
    const { getByText } = render(<LiveRecorder {...defaultProps} />);

    fireEvent.press(getByText("mic"));

    await waitFor(() => {
      expect(Audio.Recording.createAsync).toHaveBeenCalled();
    });

    fireEvent.press(getByText("stop"));

    await waitFor(() => {
      expect(mockStopAndUnloadAsync).toHaveBeenCalled();
    });

    fireEvent.press(getByText("Next"));

    expect(mockOnPressButton).toHaveBeenCalled();
  });

  it("shows alert if button pressed before recording", () => {
    global.alert = jest.fn();

    const { getByText } = render(<LiveRecorder {...defaultProps} />);

    fireEvent.press(getByText("Next"));

    expect(global.alert).toHaveBeenCalledWith("Please record first.");
  });

  it("does not render action button when disabled", () => {
    const { queryByText } = render(
      <LiveRecorder {...defaultProps} isDisabledButton={true} />,
    );

    expect(queryByText("Next")).toBeNull();
  });

  it("handles recording error gracefully", async () => {
    console.error = jest.fn();

    Audio.Recording.createAsync.mockRejectedValue(
      new Error("Recording failed"),
    );

    const { getByText } = render(<LiveRecorder {...defaultProps} />);

    fireEvent.press(getByText("mic"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
