import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ActivityFiveSubmissionCard from "@/components/activity/submission/activity5-submission-card"; // Adjust path if necessary

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

// ---------------- TESTS ----------------

describe("ActivityFiveSubmissionCard", () => {
  const mockOnChangeMovement = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRerecord = jest.fn();

  const defaultProps = {
    item: 1,
    duration: "10",
    movement: "50",
    onChangeMovement: mockOnChangeMovement,
    onDelete: mockOnDelete,
    onRerecord: mockOnRerecord,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all props and the vibration description", () => {
    const { getByText, getByDisplayValue } = render(
      <ActivityFiveSubmissionCard {...defaultProps} />
    );

    // Verify Layout wrapper is configured correctly
    expect(getByText("Layout-Item-1")).toBeTruthy();

    // Verify Video modal renders with correct URI and initial hidden state
    expect(getByText("Vibration time: 10 seconds")).toBeTruthy();

    // Verify static text labels
    expect(getByText("Prediction")).toBeTruthy();
    expect(getByText("Phone vibration sensor (cm)")).toBeTruthy();

    // Verify inputs render with correct initial values
    expect(getByDisplayValue("50")).toBeTruthy();
  });

  it("triggers onChangeMovement when text inputs change", () => {
    const { getByDisplayValue } = render(
      <ActivityFiveSubmissionCard {...defaultProps} />
    );

    const newInput = getByDisplayValue("50");
    fireEvent.changeText(newInput, "100");
    expect(mockOnChangeMovement).toHaveBeenCalledWith("100");
  });

  it("passes onDelete and onRerecord callbacks to the layout wrapper", () => {
    const { getByText } = render(
      <ActivityFiveSubmissionCard {...defaultProps} />
    );

    fireEvent.press(getByText("TriggerDelete"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText("TriggerRerecord"));
    expect(mockOnRerecord).toHaveBeenCalledTimes(1);
  });
});