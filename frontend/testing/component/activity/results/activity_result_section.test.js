import React from "react";
import { render } from "@testing-library/react-native";
import ResultSection from "@/components/activity/results/activity-result-section";

// --- Mocks ---
jest.mock(
  "@/components/activity/results/activity-result-style",
  () => ({
    createResultStyles: jest.fn(() => ({
      sectionTitle: {},
      divider: {},
    })),
  })
);

describe("ResultSection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders title correctly", () => {
    const { getByText } = render(
      <ResultSection title="Theory">
        <></>
      </ResultSection>
    );

    expect(getByText("Theory")).toBeTruthy();
  });

  it("renders children correctly", () => {
    const React = require("react");
    const { Text } = require("react-native");

    const { getByText } = render(
      <ResultSection title="Results">
        <Text>Custom Child Content</Text>
      </ResultSection>
    );

    expect(
      getByText("Custom Child Content")
    ).toBeTruthy();
  });

  it("renders both title and children", () => {
    const React = require("react");
    const { Text } = require("react-native");

    const { getByText } = render(
      <ResultSection title="Leaderboard">
        <Text>Ranking Content</Text>
      </ResultSection>
    );

    expect(getByText("Leaderboard")).toBeTruthy();

    expect(
      getByText("Ranking Content")
    ).toBeTruthy();
  });

  it("renders without crashing when children are empty", () => {
    const { getByText } = render(
      <ResultSection title="Empty Section">
        <></>
      </ResultSection>
    );

    expect(
      getByText("Empty Section")
    ).toBeTruthy();
  });
});