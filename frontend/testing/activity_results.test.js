import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import ExplanationScreen from "../app/(tabs)/activity/[id]/results.tsx";

jest.mock("@/components/ui/result-card", () => {
  return ({ index, score, onPress }) => {
    const { Text, TouchableOpacity } = require("react-native");
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>{`Attempt ${index}`}</Text>
        <Text>{`Score ${score}`}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("@/components/activity1-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity1 Detail</Text>;
});

jest.mock("@/components/activity2-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity2 Detail</Text>;
});

jest.mock("@/components/activity3-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity3 Detail</Text>;
});

jest.mock("@/components/activity4-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity4 Detail</Text>;
});

jest.mock("@/components/activity5-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity5 Detail</Text>;
});

jest.mock("@/components/activity6-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity6 Detail</Text>;
});

jest.mock("@/components/activity7-results", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text>Activity7 Detail</Text>;
});

describe("ExplanationScreen", () => {
  const { useGlobalSearchParams } = require("expo-router");
  const { useAppContext } = require("@/context/AppContext");
  const { getResultList } = require("@/services/result/result");

  beforeEach(() => {
    jest.clearAllMocks();

    useGlobalSearchParams.mockReturnValue({ id: "3" });

    useAppContext.mockReturnValue({
      team: { id: "team13" },
    });
  });

  it("shows loading initially", () => {
    getResultList.mockResolvedValue({
      success: true,
      data: [],
    });

    const { getByText } = render(<ExplanationScreen />);

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("shows 'No attempt yet' when no results", async () => {
    getResultList.mockResolvedValue({
      success: true,
      data: [],
    });

    const { getByText } = render(<ExplanationScreen />);

    await waitFor(() => {
      expect(getByText("No attempt yet")).toBeTruthy();
    });
  });

  it("renders result cards", async () => {
    getResultList.mockResolvedValue({
      success: true,
      data: [
        { attempt: 1, score: 0.8, resultId: "r1" },
        { attempt: 2, score: 0.9, resultId: "r2" },
      ],
    });

    const { getByText } = render(<ExplanationScreen />);

    await waitFor(() => {
      expect(getByText("Attempt 1")).toBeTruthy();
      expect(getByText("Attempt 2")).toBeTruthy();
    });
  });

  it("calls API with correct params", async () => {
    getResultList.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<ExplanationScreen />);

    await waitFor(() => {
      expect(getResultList).toHaveBeenCalledWith({
        teamId: "team13",
        activityId: "3",
      });
    });
  });

  it("opens detail screen when card pressed", async () => {
    getResultList.mockResolvedValue({
      success: true,
      data: [{ attempt: 1, score: 0.8, resultId: "r1" }],
    });

    const { getByText } = render(<ExplanationScreen />);

    await waitFor(() => {
      expect(getByText("Attempt 1")).toBeTruthy();
    });

    fireEvent.press(getByText("Attempt 1"));

    await waitFor(() => {
      expect(getByText("Activity3 Detail")).toBeTruthy();
    });
  });
});
