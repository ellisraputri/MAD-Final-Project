// testing/component/activity_list_card.test.js

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ActivityListCard from "@/components/ui/activity-list-card";

// Mock Link from expo-router
jest.mock("expo-router", () => {
  const React = require("react");

  return {
    Link: ({ children }) => children,
  };
});

describe("ActivityListCard", () => {
  const props = {
    name: "Reaction Time",
    description: "Test your reaction speed with this activity.",
    image: { uri: "https://example.com/image.png" },
    type: "Engineering",
    index: 1,
  };

  it("renders correctly", () => {
    const { getByText } = render(<ActivityListCard {...props} />);

    expect(getByText("Activity 1: Reaction Time")).toBeTruthy();

    expect(
      getByText("Test your reaction speed with this activity."),
    ).toBeTruthy();

    expect(getByText("Engineering")).toBeTruthy();

    expect(getByText("Find out more...")).toBeTruthy();
  });

  it("renders Science badge", () => {
    const { getByText } = render(
      <ActivityListCard {...props} type="Science" />,
    );

    expect(getByText("Science")).toBeTruthy();
  });

  it("presses find out more button", () => {
    const { getByText } = render(<ActivityListCard {...props} />);

    const button = getByText("Find out more...");

    fireEvent.press(button);

    expect(button).toBeTruthy();
  });

  it("renders correct activity index", () => {
    const { getByText } = render(<ActivityListCard {...props} index={5} />);

    expect(getByText("Activity 5: Reaction Time")).toBeTruthy();
  });

  it("renders long description", () => {
    const longDescription =
      "This is a very long description for the activity card component test.";

    const { getByText } = render(
      <ActivityListCard {...props} description={longDescription} />,
    );

    expect(getByText(longDescription)).toBeTruthy();
  });
});
