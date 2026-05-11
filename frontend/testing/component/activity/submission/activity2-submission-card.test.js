import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ActivityTwoSubmissionCard from "@/components/activity/submission/activity2-submission-card"; // Adjust path if necessary

// ---------------- MOCKS ----------------

jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: jest.fn(() => ({})),
}));

jest.mock("@/components/activity/submission/submission-card-style", () => ({
  createSubmissionCardStyles: jest.fn(() => ({
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

jest.mock("@/components/ui/audio-player", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  
  return function MockAudioPlayer({ uri, levels }) {
    const levelsStr = levels ? JSON.stringify(levels) : "none";
    return (
      <View>
        <Text>{`MockAudioPlayer-uri:${uri}-levels:${levelsStr}`}</Text>
      </View>
    );
  };
});

// ---------------- TESTS ----------------

describe("ActivityTwoSubmissionCard", () => {
  const mockOnChangeInput = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRerecord = jest.fn();

  const defaultProps = {
    item: 1,
    uri: "test-audio.mp3",
    levels: [1,2,3],
    input: "50",
    onChangeInput: mockOnChangeInput,
    onDelete: mockOnDelete,
    onRerecord: mockOnRerecord,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all props and an audio URI", () => {
    const { getByText, getByDisplayValue } = render(
      <ActivityTwoSubmissionCard {...defaultProps} />
    );

    // Verify Layout wrapper is configured correctly
    expect(getByText("Layout-Item-1")).toBeTruthy();

    // Verify Video modal renders with correct URI and initial hidden state
    expect(getByText("MockAudioPlayer-uri:test-audio.mp3-levels:[1,2,3]")).toBeTruthy();

    // Verify static text labels
    expect(getByText("Prediction")).toBeTruthy();
    expect(getByText("Order of Loudness (among all submissions)")).toBeTruthy();

    // Verify inputs render with correct initial values
    expect(getByDisplayValue("50")).toBeTruthy();
  });

  it("renders 'No audio' text when audioUri is null", () => {
    const { getByText, queryByText } = render(
      <ActivityTwoSubmissionCard {...defaultProps} uri={null} />
    );

    expect(getByText("No audio")).toBeTruthy();
    expect(queryByText(/MockAudioPlayer/)).toBeNull();
  });

  it("triggers onChangeInput when text inputs change", () => {
    const { getByDisplayValue } = render(
      <ActivityTwoSubmissionCard {...defaultProps} />
    );

    const newInput = getByDisplayValue("50");
    fireEvent.changeText(newInput, "100");
    expect(mockOnChangeInput).toHaveBeenCalledWith("100");
  });

  it("passes onDelete and onRerecord callbacks to the layout wrapper", () => {
    const { getByText } = render(
      <ActivityTwoSubmissionCard {...defaultProps} />
    );

    fireEvent.press(getByText("TriggerDelete"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText("TriggerRerecord"));
    expect(mockOnRerecord).toHaveBeenCalledTimes(1);
  });
});