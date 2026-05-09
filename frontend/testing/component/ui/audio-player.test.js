// testing/component/audio_player.test.js

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AudioPlayer from "@/components/ui/audio-player";
import { Audio } from "expo-av";

const mockPlayAsync = jest.fn();
const mockPauseAsync = jest.fn();
const mockUnloadAsync = jest.fn();
const mockSetPositionAsync = jest.fn();

jest.mock("expo-av", () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

describe("AudioPlayer", () => {
  const mockSound = {
    playAsync: mockPlayAsync,
    pauseAsync: mockPauseAsync,
    unloadAsync: mockUnloadAsync,
    setPositionAsync: mockSetPositionAsync,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    Audio.Sound.createAsync.mockResolvedValue({
      sound: mockSound,
    });
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <AudioPlayer uri="audio.mp3" levels={[10, 20, 30, 40]} />,
    );

    expect(getByText("play")).toBeTruthy();
  });

  it("loads and plays audio when pressed", async () => {
    const { getByText } = render(
      <AudioPlayer uri="audio.mp3" levels={[10, 20, 30]} />,
    );

    fireEvent.press(getByText("play"));

    await waitFor(() => {
      expect(Audio.setAudioModeAsync).toHaveBeenCalled();

      expect(Audio.Sound.createAsync).toHaveBeenCalled();

      expect(mockPlayAsync).toHaveBeenCalled();
    });
  });

  it("renders correctly with waveform levels", () => {
    const levels = [5, 10, 15, 20, 25];

    const { getByText } = render(
      <AudioPlayer uri="audio.mp3" levels={levels} />,
    );

    expect(getByText("play")).toBeTruthy();
    expect(levels.length).toBe(5);
  });

  it("handles playback error gracefully", async () => {
    Audio.Sound.createAsync.mockRejectedValue(new Error("Playback failed"));

    console.error = jest.fn();

    const { getByText } = render(<AudioPlayer uri="audio.mp3" levels={[10]} />);

    fireEvent.press(getByText("play"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
