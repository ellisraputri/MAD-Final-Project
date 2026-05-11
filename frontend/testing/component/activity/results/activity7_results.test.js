import React from "react";
import { render } from "@testing-library/react-native";

import ActivitySevenResultsScreen from "@/components/activity/results/activity7-results"; // Adjust path if necessary
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

jest.mock("@/services/media/media", () => ({
  parseMediaContent: jest.fn((content) => ({
    url: content ? `parsed-${content}` : null,
    levels: [1, 2, 3],
  })),
}));

jest.mock("@/components/activity/results/activity-result-style", () => ({
  createResultStyles: jest.fn(() => ({
    card: {},
    titleRow: {},
    title: {},
    subsContainer: {},
    viewAudio: {},
    subtitle2Text: {},
    subtitleText: {},
    descText: {},
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

describe("ActivitySevenResultsScreen", () => {
  beforeEach(() => {
    // Default context mock: simulate a team with 2 members
    useAppContext.mockReturnValue({
      team: { members: [{ id: "m1" }, { id: "m2" }] },
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
      <ActivitySevenResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders base screen but no cards if isReady is false (insufficient data length)", () => {
    // If we only provide 4 items for a 2-person team, grouping results in 2 arrays.
    // The component requires >= 3 arrays to render the cards.
    mockUseActivityResult.mockImplementation((resId, actId, setupCb) => {
      const mockData = {
        medias: [{ content: "a.mp3" }, { content: "b.mp3" }],
        predictions: [{ prediction: 10 }, { prediction: 20 }],
        outcomes: [{ bpm: 15 }, { bpm: 25 }],
      };

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
      <ActivitySevenResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(getByText("ActivityResultBaseScreen")).toBeTruthy();
    expect(queryByText("1. Submission 1")).toBeNull();
  });

  it("does not crash if team is undefined", async () => {
    useAppContext.mockReturnValue({ team: undefined });

    mockUseActivityResult.mockImplementation((resId, actId, setupCb) => {
      setTimeout(() => {
        if (setupCb) setupCb({ medias: [], predictions: [], outcomes: [] });
      }, 0);

      return {
        loading: false,
        showRating: true,
        setShowRating: jest.fn(),
        result: undefined,
        data: undefined,
      };
    });

    const { getByText, queryByText } = render(
      <ActivitySevenResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(await getByText("ActivityResultBaseScreen")).toBeTruthy();
    expect(queryByText("1. Submission 1")).toBeNull();
  });

  it("renders all cards and groups data correctly when isReady is true", async () => {
    mockUseActivityResult.mockImplementation((resId, actId, setupCb) => {
      // 6 total items / 2 members = 3 groups. This satisfies isReady.
      const mockData = {
        medias: [
          { content: "audio1.mp3" }, { content: "audio2.mp3" }, // Submission 1
          { content: "audio3.mp3" }, { content: "audio4.mp3" }, // Submission 2
          { content: "audio5.mp3" }, { content: "audio6.mp3" }, // Submission 3
        ],
        predictions: [
          { prediction: 10 }, { prediction: 20 },
          { prediction: 30 }, { prediction: 40 },
          { prediction: 50 }, { prediction: 60 },
        ],
        outcomes: [
          { bpm: 15 }, { bpm: 25 },
          { bpm: 35 }, { bpm: 45 },
          { bpm: 55 }, { bpm: 65 },
        ],
      };

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
      <ActivitySevenResultsScreen resultId="1" onBack={jest.fn()} />
    );

    // Wait for the first submission to render
    expect(await findByText("1. Submission 1")).toBeTruthy();

    // Verify Submission 1 Audio Elements
    expect(getByText("AudioPlayer-parsed-audio1.mp3")).toBeTruthy();
    expect(getByText("AudioPlayer-parsed-audio2.mp3")).toBeTruthy();
    
    // Verify Submission 1 Math Elements
    expect(getByText("• Prediction from Member 1: 10.000 bpm")).toBeTruthy();
    expect(getByText("• Outcome from Member 2: 25.000 bpm")).toBeTruthy();
  });

  it("handles falsy values (null audio, null predictions, null outcomes)", async () => {
    mockUseActivityResult.mockImplementation((resId, actId, setupCb) => {
      // Provide exactly 6 items to trigger rendering, but inject nulls into Submission 1
      const mockData = {
        medias: [
          { content: null }, { content: "audio2.mp3" },
          { content: "audio3.mp3" }, { content: "audio4.mp3" },
          { content: "audio5.mp3" }, { content: "audio6.mp3" },
        ],
        predictions: [
          { prediction: null }, { prediction: 20 },
          { prediction: 30 }, { prediction: 40 },
          { prediction: 50 }, { prediction: 60 },
        ],
        outcomes: [
          { bpm: null }, { bpm: 25 },
          { bpm: 35 }, { bpm: 45 },
          { bpm: 55 }, { bpm: 65 },
        ],
      };

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
      <ActivitySevenResultsScreen resultId="1" onBack={jest.fn()} />
    );

    expect(await findByText("1. Submission 1")).toBeTruthy();

    // Null audio turns into "No audio"
    expect(getByText("No audio")).toBeTruthy();

    // Null prediction/bpm turns into "-"
    expect(getByText("• Prediction from Member 1: - bpm")).toBeTruthy();
    expect(getByText("• Outcome from Member 1: - bpm")).toBeTruthy();
  });
});