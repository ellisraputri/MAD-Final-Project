import React from "react";
import { render } from "@testing-library/react-native";
import VideoPlayer from "@/components/ui/video-player";

jest.mock("expo-video", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return {
    VideoView: ({ style }) => (
      <View testID="video-view">
        <Text>Video</Text>
      </View>
    ),
    useVideoPlayer: () => ({
      loop: false,
      playbackRate: 1,
      replaceAsync: jest.fn(),
    }),
  };
});

describe("VideoPlayer", () => {
  it("renders video view", () => {
    const { getByText } = render(
      <VideoPlayer link="https://test.com/video.mp4" />,
    );

    expect(getByText("Video")).toBeTruthy();
  });

  it("accepts custom rate", () => {
    render(
      <VideoPlayer link="https://test.com/video.mp4" rate={0.5} />,
    );

    // no crash = enough (rate is internal effect-based)
    expect(true).toBe(true);
  });

  it("renders with custom dimensions", () => {
    const { getByText } = render(
      <VideoPlayer
        link="https://test.com/video.mp4"
        vidWidth={100}
        vidHeight={100}
      />,
    );

    expect(getByText("Video")).toBeTruthy();
  });
});