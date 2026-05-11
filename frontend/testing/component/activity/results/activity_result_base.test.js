import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { ActivityResultBaseScreen } from "@/components/activity/results/activity-result-base";

// --- Mocks ---
jest.mock("@/components/activity/results/activity-result-style", () => ({
  createResultStyles: jest.fn(() => ({
    container: {},
    paragraph: {},
  })),
}));

jest.mock("@/context/AppContext", () => ({
  useAppContext: jest.fn(() => ({
    team: {
      name: "Test Team",
      logo: "https://example.com/logo.png",
    },
  })),
}));

jest.mock("@/data/activity_theory.json", () => ({
  activity1: "This is activity theory text",
}));

// --- UI component mocks ---

jest.mock("@/components/activity/results/activity-result-section", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return function MockResultSection({ title, children }) {
    return (
      <View>
        <Text>{title}</Text>
        {children}
      </View>
    );
  };
});

jest.mock("@/components/ui/ranking-card", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return function MockRankingCard({ rank, score, teamName, attemptNo }) {
    return (
      <View>
        <Text>{`Rank: ${rank}`}</Text>
        <Text>{`Score: ${score}`}</Text>
        <Text>{`Team: ${teamName}`}</Text>
        <Text>{`Attempt: ${attemptNo}`}</Text>
      </View>
    );
  };
});

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return function MockButton({ onPress, text, isDisabled, isLoading }) {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        onPress={onPress}
        accessibilityState={{
          disabled: isDisabled,
        }}
      >
        <Text>{isLoading ? "Loading..." : text}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("@/components/ui/rating-popup", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockRatingPopup({ activityId, resultId, showModal }) {
    return <Text>{`RatingPopup-${activityId}-${resultId}-${showModal}`}</Text>;
  };
});

describe("ActivityResultBaseScreen", () => {
  const baseProps = {
    activityId: "activity-1",
    resultId: "result-1",
    theoryKey: "activity1",
    showRating: true,
    onCloseRating: jest.fn(),
    onBack: jest.fn(),
    children: <></>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders theory section", () => {
    const { getByText } = render(
      <ActivityResultBaseScreen {...baseProps} result={undefined} />,
    );

    expect(getByText("Theory")).toBeTruthy();
    expect(getByText("This is activity theory text")).toBeTruthy();
  });

  it("renders children inside results section", () => {
    const React = require("react");
    const { Text } = require("react-native");

    const { getByText } = render(
      <ActivityResultBaseScreen {...baseProps} result={undefined}>
        <Text>Custom Result Content</Text>
      </ActivityResultBaseScreen>,
    );

    expect(getByText("Results")).toBeTruthy();
    expect(getByText("Custom Result Content")).toBeTruthy();
  });

  it("shows waiting text when result is undefined", () => {
    const { getByText } = render(
      <ActivityResultBaseScreen {...baseProps} result={undefined} />,
    );

    expect(
      getByText(
        "Still compiling leaderboard data. Please wait until tomorrow.",
      ),
    ).toBeTruthy();
  });

  it("renders ranking card when result exists", () => {
    const mockResult = {
      rank: 3,
      score: 0.87,
      attemptNo: 2,
    };

    const { getByText } = render(
      <ActivityResultBaseScreen {...baseProps} result={mockResult} />,
    );

    expect(getByText("Rank: 3")).toBeTruthy();
    expect(getByText("Score: 87%")).toBeTruthy();
    expect(getByText("Team: Test Team")).toBeTruthy();
    expect(getByText("Attempt: 2")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();

    const { getByText } = render(
      <ActivityResultBaseScreen
        {...baseProps}
        onBack={onBack}
        result={undefined}
      />,
    );

    fireEvent.press(getByText("Back"));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders rating popup when resultId exists", () => {
    const { getByText } = render(
      <ActivityResultBaseScreen {...baseProps} result={undefined} />,
    );

    expect(getByText("RatingPopup-activity-1-result-1-true")).toBeTruthy();
  });

  it("does not render rating popup when resultId is undefined", () => {
    const { queryByText } = render(
      <ActivityResultBaseScreen
        {...baseProps}
        resultId={undefined}
        result={undefined}
      />,
    );

    expect(queryByText(/RatingPopup/i)).toBeNull();
  });

  it("renders theoryChildren when provided", () => {
    const React = require("react");
    const { Text } = require("react-native");

    const { getByText } = render(
      <ActivityResultBaseScreen
        {...baseProps}
        result={undefined}
        theoryChildren={<Text>Extra Theory Content</Text>}
      />,
    );

    expect(getByText("Extra Theory Content")).toBeTruthy();
  });
});
