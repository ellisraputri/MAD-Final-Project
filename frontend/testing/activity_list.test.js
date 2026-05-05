import React from "react";
import { render } from "@testing-library/react-native";
import ActivityListScreen from "../app/(tabs)/activity/index.tsx";

jest.mock("@/components/ui/activity-list-card", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ name }) => <Text>{name}</Text>;
});

describe("ActivityListScreen", () => {
  it("renders activity screen", () => {
    const { getByText } = render(<ActivityListScreen />);

    expect(getByText("Activity")).toBeTruthy();
    expect(
      getByText(
        "Explore science firsthand with these interactive lab sessions",
      ),
    ).toBeTruthy();
  });

  it("renders all activity items", () => {
    const { getByText } = render(<ActivityListScreen />);

    expect(getByText("Parachute Drop Challenge")).toBeTruthy();
    expect(getByText("Sound Pollution Hunter")).toBeTruthy();
    expect(getByText("Hand Fan Challenge")).toBeTruthy();
    expect(getByText("Earthquake Resistant Structure")).toBeTruthy();
    expect(getByText("Human Performance Lab")).toBeTruthy();
    expect(getByText("Reaction Board Challenge")).toBeTruthy();
    expect(getByText("Breathing Pace Trainer")).toBeTruthy();
  });
});
