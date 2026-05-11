import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ActivityOneResultsScreen from "@/components/activity/results/activity1-results";

// ---------------- MOCKS ----------------

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    id: "123",
  })),
}));

jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: jest.fn(() => ({
    placeholderText: "gray",
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
    calculationText: {},
    descContainer: {},
    inputContainer: {},
    input: {},
    warningContainer: {},
    warning: {},
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

jest.mock("@/components/ui/table", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockTable() {
    return <Text>Table</Text>;
  };
});

jest.mock("@/components/ui/video-modal", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockVideoModal() {
    return <Text>VideoModal</Text>;
  };
});

jest.mock("@/components/ui/dropdown", () => {
  const React = require("react");
  const { TouchableOpacity, Text, View } = require("react-native");

  return function MockDropdown({ onSelect }) {
    return (
      <View>
        <TouchableOpacity onPress={() => onSelect("no-bounce")}>
          <Text>Select No Bounce</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSelect("bounce")}>
          <Text>Select Bounce</Text>
        </TouchableOpacity>
      </View>
    );
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

jest.mock("@/components/activity/results/useActivityResults", () => ({
  __esModule: true,
  default: (...args) => mockUseActivityResult(...args),
}));

// ---------------- TESTS ----------------

describe("ActivityOneResultsScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseActivityResult.mockReturnValue({
      loading: true,
    });

    const { getByText } = render(
      <ActivityOneResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders result screen content", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [
          {
            content: "video.mp4",
          },
        ],
        predictions: [
          {
            mass: 50,
            prediction: 1.25,
          },
        ],
        outcomes: [
          {
            stop_time: 1.2,
            score: 0.85,
          },
        ],
      },
    });

    const { getByText } = render(
      <ActivityOneResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText("ActivityResultBaseScreen")).toBeTruthy();

    expect(getByText("1. Submission 1")).toBeTruthy();

    expect(getByText("Mass of toy (gram): 50 ")).toBeTruthy();

    expect(getByText("Score (accuracy): 0.850 ")).toBeTruthy();
  });

  it("renders no video text when videoUri is null", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [
          {
            content: null,
          },
        ],
        predictions: [
          {
            mass: 40,
            prediction: 1,
          },
        ],
        outcomes: [
          {
            stop_time: 2,
            score: 0.9,
          },
        ],
      },
    });

    const { getByText } = render(
      <ActivityOneResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText("No video")).toBeTruthy();
  });

  it("shows g-force instructions before selecting bounce option", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [
          {
            content: null,
          },
        ],
        predictions: [
          {
            mass: 40,
            prediction: 1,
          },
        ],
        outcomes: [
          {
            stop_time: 2,
            score: 0.9,
          },
        ],
      },
    });

    const { getByText } = render(
      <ActivityOneResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText(/Please select a bounce case/i)).toBeTruthy();
  });

  it("renders no-bounce calculation when selected", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [
          {
            content: null,
          },
        ],
        predictions: [
          {
            mass: 40,
            prediction: 1,
          },
        ],
        outcomes: [
          {
            stop_time: 2,
            score: 0.9,
          },
        ],
      },
    });

    const { getByText } = render(
      <ActivityOneResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    fireEvent.press(getByText("Select No Bounce"));

    expect(getByText(/Object goes from impact speed downward/i)).toBeTruthy();
  });
});
