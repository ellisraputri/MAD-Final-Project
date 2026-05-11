import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import SubmissionCardLayout from "@/components/activity/submission/submission-card-layout"; // Adjust the import path if necessary

// ---------------- MOCKS ----------------

jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: jest.fn(() => ({
    text: "#000000",
  })),
}));

jest.mock("@/components/activity/submission/submission-card-style", () => ({
  createSubmissionCardStyles: jest.fn(() => ({
    card: {},
    titleRow: {},
    title: {},
    subsContainer: {},
    editBtn: {},
    editBtnText: {},
  })),
}));

// Mock Ionicons to render as plain text so we can easily interact with it
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => {
    const { Text } = require("react-native");
    return <Text>TrashIcon</Text>;
  },
}));

// ---------------- TESTS ----------------

describe("SubmissionCardLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with the correct item number and children", () => {
    const { getByText } = render(
      <SubmissionCardLayout 
        item={1} 
        onDelete={jest.fn()} 
        onRerecord={jest.fn()}
      >
        <Text>Inner Child Content</Text>
      </SubmissionCardLayout>
    );

    // Verify title formatting
    expect(getByText("1. Submission 1")).toBeTruthy();
    
    // Verify children render inside the layout
    expect(getByText("Inner Child Content")).toBeTruthy();
    
    // Verify buttons are present
    expect(getByText("TrashIcon")).toBeTruthy();
    expect(getByText("Edit")).toBeTruthy();
  });

  it("calls onDelete when the trash icon is pressed", () => {
    const mockOnDelete = jest.fn();
    const mockOnRerecord = jest.fn();

    const { getByText } = render(
      <SubmissionCardLayout 
        item={2} 
        onDelete={mockOnDelete} 
        onRerecord={mockOnRerecord}
      >
        <Text>Child Content</Text>
      </SubmissionCardLayout>
    );

    // Simulate clicking the trash icon
    fireEvent.press(getByText("TrashIcon"));

    // Verify only the delete callback was triggered
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnRerecord).not.toHaveBeenCalled();
  });

  it("calls onRerecord when the Edit button is pressed", () => {
    const mockOnDelete = jest.fn();
    const mockOnRerecord = jest.fn();

    const { getByText } = render(
      <SubmissionCardLayout 
        item={3} 
        onDelete={mockOnDelete} 
        onRerecord={mockOnRerecord}
      >
        <Text>Child Content</Text>
      </SubmissionCardLayout>
    );

    // Simulate clicking the Edit button
    fireEvent.press(getByText("Edit"));

    // Verify only the rerecord callback was triggered
    expect(mockOnRerecord).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});