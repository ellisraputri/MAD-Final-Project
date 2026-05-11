import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ActivityThreeSubmissionCard from "@/components/activity/submission/activity3-submission-card"; // Adjust path if necessary

// ---------------- MOCKS ----------------

jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: jest.fn(() => ({})),
}));

jest.mock("@/components/activity/submission/submission-card-style", () => ({
  createSubmissionCardStyles: jest.fn(() => ({
    videoPlaceholder: {},
    descText: {},
    inputBox: {},
    prediction: {},
  })),
}));

// Mock the Layout wrapper so we can access its children and test passed callbacks
jest.mock("@/components/activity/submission/submission-card-layout", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return function MockSubmissionCardLayout({ children, item, onDelete, onRerecord }) {
    return (
      <View>
        <Text>{`Layout-Item-${item}`}</Text>
        <TouchableOpacity onPress={onDelete}><Text>TriggerDelete</Text></TouchableOpacity>
        <TouchableOpacity onPress={onRerecord}><Text>TriggerRerecord</Text></TouchableOpacity>
        {children}
      </View>
    );
  };
});

// Mock VideoModal to expose its internal state toggles
jest.mock("@/components/ui/video-modal", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return function MockVideoModal({ videoUri, showModal, openModal, closeModal }) {
    return (
      <View>
        <Text>{`MockVideoModal-${videoUri}-Visible:${showModal}`}</Text>
        <TouchableOpacity onPress={openModal}><Text>OpenModal</Text></TouchableOpacity>
        <TouchableOpacity onPress={closeModal}><Text>CloseModal</Text></TouchableOpacity>
      </View>
    );
  };
});

// ---------------- TESTS ----------------

describe("ActivityThreeSubmissionCard", () => {
  const mockOnChangeBend = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRerecord = jest.fn();

  const defaultProps = {
    item: 1,
    videoUri: "test-video.mp4",
    bend: "50",
    onChangeBend: mockOnChangeBend,
    onDelete: mockOnDelete,
    onRerecord: mockOnRerecord,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all props and a video URI", () => {
    const { getByText, getByDisplayValue } = render(
      <ActivityThreeSubmissionCard {...defaultProps} />
    );

    // Verify Layout wrapper is configured correctly
    expect(getByText("Layout-Item-1")).toBeTruthy();

    // Verify Video modal renders with correct URI and initial hidden state
    expect(getByText("MockVideoModal-test-video.mp4-Visible:false")).toBeTruthy();

    // Verify static text labels
    expect(getByText("Prediction")).toBeTruthy();
    expect(getByText("Bend (degrees)")).toBeTruthy();

    // Verify inputs render with correct initial values
    expect(getByDisplayValue("50")).toBeTruthy();
  });

  it("renders 'No video' text when videoUri is null", () => {
    const { getByText, queryByText } = render(
      <ActivityThreeSubmissionCard {...defaultProps} videoUri={null} />
    );

    expect(getByText("No video")).toBeTruthy();
    expect(queryByText(/MockVideoModal/)).toBeNull();
  });

  it("triggers onChangeBend when text inputs change", () => {
    const { getByDisplayValue } = render(
      <ActivityThreeSubmissionCard {...defaultProps} />
    );

    const bendInput = getByDisplayValue("50");
    fireEvent.changeText(bendInput, "100");
    expect(mockOnChangeBend).toHaveBeenCalledWith("100");
  });

  it("passes onDelete and onRerecord callbacks to the layout wrapper", () => {
    const { getByText } = render(
      <ActivityThreeSubmissionCard {...defaultProps} />
    );

    fireEvent.press(getByText("TriggerDelete"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText("TriggerRerecord"));
    expect(mockOnRerecord).toHaveBeenCalledTimes(1);
  });

  it("toggles the VideoModal visibility state when open and close callbacks are fired", () => {
    const { getByText } = render(
      <ActivityThreeSubmissionCard {...defaultProps} />
    );

    // Initial state should be false
    expect(getByText("MockVideoModal-test-video.mp4-Visible:false")).toBeTruthy();

    // Trigger openModal
    fireEvent.press(getByText("OpenModal"));
    expect(getByText("MockVideoModal-test-video.mp4-Visible:true")).toBeTruthy();

    // Trigger closeModal
    fireEvent.press(getByText("CloseModal"));
    expect(getByText("MockVideoModal-test-video.mp4-Visible:false")).toBeTruthy();
  });
});