import React from "react";
import { render } from "@testing-library/react-native";

import ActivityFourResultsScreen from "@/components/activity/results/activity4-results"; // Adjust path if necessary

// ---------------- MOCKS ----------------

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    id: "123",
  })),
}));

jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: jest.fn(() => ({})),
}));

jest.mock("@/components/activity/results/activity-result-style", () => ({
  createResultStyles: jest.fn(() => ({
    card: {},
    titleRow: {},
    title: {},
    list: {},
    listItem: {},
  })),
}));

jest.mock("@/components/ui/loading", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockLoading() {
    return <Text>Loading...</Text>;
  };
});

jest.mock("@/components/activity/results/activity-result-base", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    ActivityResultBaseScreen: function MockBase({ children }) {
      return (
        <View>
          <Text>ActivityResultBaseScreen</Text>
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

describe("ActivityFourResultsScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    mockUseActivityResult.mockReturnValue({
      loading: true,
    });

    const { getByText } = render(
      <ActivityFourResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders base screen when loading is false", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: undefined,
    });

    const { getByText } = render(
      <ActivityFourResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("ActivityResultBaseScreen")).toBeTruthy();
  });

  it("renders result cards correctly when data exists", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [{ content: "1.234" }, { content: "5.678" }],
        predictions: [{ prediction: 10.5 }, { prediction: 20.1 }],
        outcomes: [{ outcome: 12.0 }, { outcome: 22.5 }],
      },
    });

    const { getByText } = render(
      <ActivityFourResultsScreen resultId="1" onBack={jest.fn()} />
    );

    // First Submission
    expect(getByText("Vibration 1: 1.234s")).toBeTruthy();
    expect(getByText("• Predicted: 10.500 cm")).toBeTruthy();
    expect(getByText("• Outcome: 12.000 cm")).toBeTruthy();

    // Second Submission
    expect(getByText("Vibration 2: 5.678s")).toBeTruthy();
    expect(getByText("• Predicted: 20.100 cm")).toBeTruthy();
    expect(getByText("• Outcome: 22.500 cm")).toBeTruthy();
  });

  it("handles null/missing values gracefully", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: {
        medias: [{ content: null }],
        predictions: [{ prediction: null }],
        outcomes: [{ outcome: null }],
      },
    });

    const { getByText } = render(
      <ActivityFourResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("Vibration 1: NaNs")).toBeTruthy();
    expect(getByText("• Predicted: - cm")).toBeTruthy();
    expect(getByText("• Outcome: - cm")).toBeTruthy();
  });
});