import React from "react";
import { render } from "@testing-library/react-native";

import ActivityThreeResultsScreen from "@/components/activity/results/activity3-results";

// ---------------- MOCKS ----------------

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    id: "123",
  })),
}));

jest.mock("@/components/activity/results/activity-result-style", () => ({
  createResultStyles: jest.fn(() => ({
    card: {},
    titleRow: {},
    title: {},
    subsContainer: {},
    videoPlaceholder: {},
    descText: {},
    subtitleText: {},
    list: {},
    listItem: {},
    paragraph: {},
    subtitle: {},
  })),
}));

jest.mock("@/components/ui/loading", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockLoading() {
    return <Text>Loading...</Text>;
  };
});

jest.mock("@/components/ui/equation", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockEquation({ latex }) {
    return <Text>{latex}</Text>;
  };
});

jest.mock("@/components/ui/table", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockTable() {
    return <Text>Table Component</Text>;
  };
});

jest.mock("@/components/ui/accordion", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return function MockAccordion({ title, children }) {
    return (
      <View>
        <Text>{title}</Text>
        {children}
      </View>
    );
  };
});

jest.mock("@/components/ui/video-modal", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockVideoModal({ videoUri }) {
    return <Text>{`VideoModal-${videoUri}`}</Text>;
  };
});

jest.mock("@/components/activity/results/activity-result-base", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    ActivityResultBaseScreen: function MockBase({ children, theoryChildren }) {
      return (
        <View>
          <Text>ActivityResultBaseScreen</Text>
          {theoryChildren}
          {children}
        </View>
      );
    },
  };
});

const mockUseActivityResult = jest.fn();
jest.mock("@/components/activity/results/useActivityResults", () => {
  return {
    __esModule: true,
    default: (...args) => mockUseActivityResult(...args),
  };
});

// ---------------- TESTS ----------------

describe("ActivityThreeResultsScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    mockUseActivityResult.mockReturnValue({
      loading: true,
    });

    const { getByText } = render(
      <ActivityThreeResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders base screen and theory section when loading is false", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: undefined,
    });

    const { getByText } = render(
      <ActivityThreeResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("ActivityResultBaseScreen")).toBeTruthy();
    
    expect(getByText("Forces to Bend Paper")).toBeTruthy();
    expect(getByText("Table Component")).toBeTruthy();
    expect(getByText("F \\\\approx k \\\\cdot \\\\theta")).toBeTruthy();
  });

  it("renders video modal and mathematical calculations when video and data exist", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [{ content: "video1.mp4" }],
        predictions: [{ prediction: 45.123 }],
        outcomes: [{ max_bend: 50, score: 95.5 }],
      },
    });

    const { getByText } = render(
      <ActivityThreeResultsScreen resultId="1" onBack={jest.fn()} />
    );

    // Card Details
    expect(getByText("1. Submission 1")).toBeTruthy();
    expect(getByText("VideoModal-video1.mp4")).toBeTruthy();
    expect(getByText("• Predicted: 45.123")).toBeTruthy();
    expect(getByText("• Outcome: 50.000")).toBeTruthy();
    expect(getByText("Score (accuracy): 95.500")).toBeTruthy();

    expect(getByText("Calculation")).toBeTruthy();
    expect(getByText("F \\\\approx 0.05 \\\\cdot 0.873 \\\\approx 0.044 N")).toBeTruthy();
  });

  it("renders 'No video' text when videoUri is null", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [{ content: null }],
        predictions: [{ prediction: 30 }],
        outcomes: [{ max_bend: 30, score: 100 }],
      },
    });

    const { getByText, queryByText } = render(
      <ActivityThreeResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("No video")).toBeTruthy();
    expect(queryByText(/VideoModal/)).toBeNull();
  });

  it("renders multiple submission cards when data has multiple outcomes", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [{ content: "video1.mp4" }, { content: "video2.mp4" }],
        predictions: [{ prediction: 10 }, { prediction: 20 }],
        outcomes: [
          { max_bend: 15, score: 80 },
          { max_bend: 25, score: 90 },
        ],
      },
    });

    const { getByText } = render(
      <ActivityThreeResultsScreen resultId="1" onBack={jest.fn()} />
    );

    // Check first submission
    expect(getByText("1. Submission 1")).toBeTruthy();
    expect(getByText("VideoModal-video1.mp4")).toBeTruthy();

    // Check second submission
    expect(getByText("2. Submission 2")).toBeTruthy();
    expect(getByText("VideoModal-video2.mp4")).toBeTruthy();
  });
});