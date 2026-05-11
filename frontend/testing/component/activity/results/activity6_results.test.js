import React from "react";
import { render } from "@testing-library/react-native";

import ActivitySixResultsScreen from "@/components/activity/results/activity6-results"; // Adjust path if necessary
import { useAppContext } from "@/context/AppContext";

// ---------------- MOCKS ----------------

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    id: "123",
  })),
}));

jest.mock("@/hooks/use-app-theme", () => ({
  useAppTheme: jest.fn(() => ({})),
}));

jest.mock("@/context/AppContext", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("@/components/activity/results/activity-result-style", () => ({
  createResultStyles: jest.fn(() => ({
    card: {},
    titleRow: {},
    title: {},
    subtitleText: {},
    list: {},
    listItem: {},
    padContainer: {},
    image: {},
    overlay: {},
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

describe("ActivitySixResultsScreen", () => {
  beforeEach(() => {
    // Default context mock for most tests
    useAppContext.mockReturnValue({
      team: { members: [{ id: "m1" }, { id: "m2" }] }, // Simulate 2 members
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    mockUseActivityResult.mockReturnValue({
      loading: true,
    });

    const { getByText } = render(
      <ActivitySixResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders base screen when loading is false but data is undefined", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: undefined,
    });

    const { getByText } = render(
      <ActivitySixResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("ActivityResultBaseScreen")).toBeTruthy();
  });

  it("does not crash or render data if team is undefined", async () => {
    // Override context to have no team
    useAppContext.mockReturnValue({ team: undefined });

    mockUseActivityResult.mockImplementation((resId, actId, setupCb) => {
      const mockData = { predictions: [], outcomes: [], medias: [] };

      setTimeout(() => {
        if (setupCb) setupCb(mockData);
      }, 0);

      return {
        loading: false,
        showRating: true,
        setShowRating: jest.fn(),
        result: undefined,
        data: mockData,
      };
    });

    const { getByText, queryByText } = render(
      <ActivitySixResultsScreen resultId="1" onBack={jest.fn()} />
    );

    // Wait for base to render
    expect(await getByText("ActivityResultBaseScreen")).toBeTruthy();

    // Since team is undefined, setupCb returns early, and predictions remain undefined.
    // Therefore, cards shouldn't render.
    expect(queryByText("Reaction Challenge - Dominant Hand")).toBeNull();
  });

  it("renders all challenges properly grouped for a 2-member team", async () => {
    mockUseActivityResult.mockImplementation((resId, actId, setupCb) => {
      const mockData = {
        // 8 items total (2 members * 4 metrics: Dom Time, Non-Dom Time, Trace Time, Trace Acc)
        predictions: [
          { prediction: 100 }, { prediction: 110 }, // 1. Dominant Time
          { prediction: 200 }, { prediction: 210 }, // 2. Non-Dominant Time
          { prediction: 300 }, { prediction: 310 }, // 3. Tracing Time
          { prediction: 85 }, { prediction: 90 },   // 4. Tracing Accuracy
        ],
        outcomes: [
          { outcome: 105 }, { outcome: 115 }, // 1. Dominant Time
          { outcome: 205 }, { outcome: 215 }, // 2. Non-Dominant Time
          { outcome: 305 }, { outcome: 315 }, // 3. Tracing Time
          { outcome: 88 }, { outcome: 92 },   // 4. Tracing Accuracy
        ],
        medias: [
          { content: "trace1.jpg" }, 
          { content: "trace2.jpg" }
        ],
      };

      // Fire grouping logic
      setTimeout(() => {
        if (setupCb) setupCb(mockData);
      }, 0);

      return {
        loading: false,
        showRating: true,
        setShowRating: jest.fn(),
        result: undefined,
        data: mockData,
      };
    });

    const { getByText, findByText } = render(
      <ActivitySixResultsScreen resultId="1" onBack={jest.fn()} />
    );

    // Await first rendered title to ensure state has updated
    expect(await findByText("Reaction Challenge - Dominant Hand")).toBeTruthy();

    // Challenge 1 Checks (Dominant Hand)
    expect(getByText("• Prediction from Member 1: 100 ms")).toBeTruthy();
    expect(getByText("• Outcome from Member 2: 115 ms")).toBeTruthy();

    // Challenge 2 Checks (Non-Dominant Hand)
    expect(getByText("Reaction Challenge - Non-Dominant Hand")).toBeTruthy();
    expect(getByText("• Prediction from Member 2: 210 ms")).toBeTruthy();
    expect(getByText("• Outcome from Member 1: 205 ms")).toBeTruthy();

    // Challenge 3 Checks (Tracing Challenge)
    expect(getByText("Tracing Challenge")).toBeTruthy();
    
    // -> Tracing Time
    expect(getByText("• Prediction from Member 1: 300 ms")).toBeTruthy();
    expect(getByText("• Outcome from Member 2: 315 ms")).toBeTruthy();
    
    // -> Tracing Accuracy
    expect(getByText("• Prediction from Member 1: 85%")).toBeTruthy();
    expect(getByText("• Outcome from Member 2: 92%")).toBeTruthy();

    // -> Tracing Medias
    expect(getByText("Trace Result Member 1:")).toBeTruthy();
    expect(getByText("Trace Result Member 2:")).toBeTruthy();
  });
});