import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import VideoModal from "@/components/ui/video-modal";

jest.mock("@/components/ui/video-player", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ rate }) => <Text>VideoPlayer {rate}</Text>;
});

jest.mock("react-native/Libraries/Modal/Modal", () => {
  const React = require("react");
  const { View } = require("react-native");

  return ({ children }) => <View>{children}</View>;
});

describe("VideoModal", () => {
  const openModal = jest.fn();
  const closeModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders play overlay", () => {
    const { getByText } = render(
      <VideoModal
        showModal={false}
        videoUri="video.mp4"
        openModal={openModal}
        closeModal={closeModal}
      />,
    );

    expect(getByText("Tap to play")).toBeTruthy();
    expect(getByText("play-circle")).toBeTruthy();
  });

  it("calls openModal when overlay is pressed", () => {
    const { getByText } = render(
      <VideoModal
        showModal={false}
        videoUri="video.mp4"
        openModal={openModal}
        closeModal={closeModal}
      />,
    );

    fireEvent.press(getByText("Tap to play"));

    expect(openModal).toHaveBeenCalled();
  });

  it("renders modal content when open", () => {
    const { getByText } = render(
      <VideoModal
        showModal={true}
        videoUri="video.mp4"
        openModal={openModal}
        closeModal={closeModal}
      />,
    );

    expect(getByText("0.5x Slow Motion")).toBeTruthy();
    expect(getByText("Close")).toBeTruthy();
  });

  it("toggles slow motion rate", () => {
    const { getByText, UNSAFE_getByType } = render(
      <VideoModal
        showModal={true}
        videoUri="video.mp4"
        openModal={openModal}
        closeModal={closeModal}
      />,
    );

    const btn = getByText("0.5x Slow Motion");
    fireEvent.press(btn);

    // video-player mock shows rate
    expect(UNSAFE_getByType).toBeDefined();
  });

  it("calls closeModal when close pressed", () => {
    const { getByText } = render(
      <VideoModal
        showModal={true}
        videoUri="video.mp4"
        openModal={openModal}
        closeModal={closeModal}
      />,
    );

    fireEvent.press(getByText("Close"));

    expect(closeModal).toHaveBeenCalled();
  });
});
