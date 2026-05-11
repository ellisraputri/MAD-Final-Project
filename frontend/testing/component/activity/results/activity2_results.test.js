import React from "react";
import { render } from "@testing-library/react-native";

import ActivityTwoResultsScreen from "@/components/activity/results/activity2-results";

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
    descText: {},
    subtitleText: {},
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

jest.mock("@/components/ui/audio-player", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockAudioPlayer({ uri }) {
    return <Text>{`AudioPlayer-${uri}`}</Text>;
  };
});

jest.mock("@/components/ui/table", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockTable() {
    return <Text>Table</Text>;
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

jest.mock("@/services/media/media", () => ({
  parseMediaContent: jest.fn((content) => ({
    url: `parsed-${content}`,
    levels: [1, 2, 3],
  })),
}));

const mockUseActivityResult = jest.fn();

jest.mock("@/components/activity/results/useActivityResults", () => ({
  __esModule: true,
  default: (...args) => mockUseActivityResult(...args),
}));

// ---------------- TESTS ----------------

describe("ActivityTwoResultsScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseActivityResult.mockReturnValue({
      loading: true,
    });

    const { getByText } = render(
      <ActivityTwoResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders base screen", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: undefined,
    });

    const { getByText } = render(
      <ActivityTwoResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText("ActivityResultBaseScreen")).toBeTruthy();
  });

  it("renders theory table", () => {
    mockUseActivityResult.mockReturnValue({
      loading: false,
      showRating: true,
      setShowRating: jest.fn(),
      result: undefined,
      data: undefined,
    });

    const { getByText } = render(
      <ActivityTwoResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(getByText("Table")).toBeTruthy();
  });

  it("renders audio player when audio exists", async () => {
    mockUseActivityResult.mockImplementation(
      (resultId, activityId, setupContents) => {
        const mockData = {
          medias: [{ content: "a1.mp3" }],
          predictions: [{ prediction: 1 }],
          outcomes: [{ outcome: 3, realOutcome: 60.123 }],
        };

        setTimeout(() => {
          if (setupContents) setupContents(mockData);
        }, 0);

        return {
          loading: false,
          showRating: true,
          setShowRating: jest.fn(),
          result: undefined,
          data: mockData,
        };
      },
    );

    const { getByText, findByText } = render(
      <ActivityTwoResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(await findByText("1. Submission 1")).toBeTruthy();
    expect(getByText("AudioPlayer-parsed-a1.mp3")).toBeTruthy();
    expect(getByText("• Predicted: 1")).toBeTruthy();
    expect(getByText("• Outcome: 3")).toBeTruthy();
    expect(
      getByText("The value of dB for this result is 60.123 dB"),
    ).toBeTruthy();
  });

  it("renders multiple submissions", async () => {
    mockUseActivityResult.mockImplementation(
      (resultId, activityId, setupContents) => {
        const mockData = {
          medias: [{ content: "a1.mp3" }, { content: "a2.mp3" }],
          predictions: [{ prediction: 1 }, { prediction: 2 }],
          outcomes: [
            { outcome: 3, realOutcome: 60 },
            { outcome: 4, realOutcome: 90 },
          ],
        };

        setTimeout(() => {
          if (setupContents) setupContents(mockData);
        }, 0);

        return {
          loading: false,
          showRating: true,
          setShowRating: jest.fn(),
          result: undefined,
          data: mockData,
        };
      },
    );

    const { getByText, findByText } = render(
      <ActivityTwoResultsScreen resultId="1" onBack={jest.fn()} />,
    );

    expect(await findByText("1. Submission 1")).toBeTruthy();
    expect(getByText("2. Submission 2")).toBeTruthy();
  });
});
