import React from "react";
import { render } from "@testing-library/react-native";
import InstructionScreen from "../app/(tabs)/activity/[id]/instructions";

jest.mock("../components/ui/video-player", () => {
  return ({ link }) => {
    const { Text } = require("react-native");
    return <Text testID="video-player">{link}</Text>;
  };
});

jest.mock("@/data/activity1_instructions.json", () => ({
  overview: "Test overview",
  equipments: [
    { image: "img1", caption: "Item 1" },
    { image: "img2", caption: "Item 2" },
  ],
  tutorial: ["Step 1", "Step 2"],
  video: "video-link-1",
}));

describe("InstructionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders overview, equipment, instructions, and tutorial", () => {
    const { useLocalSearchParams } = require("expo-router");

    useLocalSearchParams.mockReturnValue({ id: "1" });

    const { getByText } = render(<InstructionScreen />);

    expect(getByText("Overview")).toBeTruthy();
    expect(getByText("Equipment")).toBeTruthy();
    expect(getByText("Instructions")).toBeTruthy();
    expect(getByText("Tutorial")).toBeTruthy();
  });

  it("renders overview text", () => {
    const { useLocalSearchParams } = require("expo-router");

    useLocalSearchParams.mockReturnValue({ id: "1" });

    const { getByText } = render(<InstructionScreen />);

    expect(getByText("Test overview")).toBeTruthy();
  });

  it("renders equipment list", () => {
    const { useLocalSearchParams } = require("expo-router");

    useLocalSearchParams.mockReturnValue({ id: "1" });

    const { getByText } = render(<InstructionScreen />);

    expect(getByText("1. Item 1")).toBeTruthy();
    expect(getByText("2. Item 2")).toBeTruthy();
  });

  it("renders instruction steps", () => {
    const { useLocalSearchParams } = require("expo-router");

    useLocalSearchParams.mockReturnValue({ id: "1" });

    const { getByText } = render(<InstructionScreen />);

    expect(getByText("1.")).toBeTruthy();
    expect(getByText("Step 1")).toBeTruthy();
    expect(getByText("Step 2")).toBeTruthy();
  });

  it("passes video link to VideoPlayer", () => {
    const { useLocalSearchParams } = require("expo-router");

    useLocalSearchParams.mockReturnValue({ id: "1" });

    const { getByText } = render(<InstructionScreen />);

    expect(getByText("video-link-1")).toBeTruthy();
  });
});
