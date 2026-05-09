import React from "react";
import { render } from "@testing-library/react-native";
import PodiumCard from "@/components/ui/podium-card";

describe("PodiumCard", () => {
  const defaultProps = {
    rank: 1,
    name: "John Doe",
    score: "95",
    imageUrl: "https://example.com/profile.png",
  };

  it("renders name correctly", () => {
    const { getByText } = render(
      <PodiumCard {...defaultProps} />
    );

    expect(getByText("John Doe")).toBeTruthy();
  });

  it("renders score correctly", () => {
    const { getByText } = render(
      <PodiumCard {...defaultProps} />
    );

    expect(getByText("95")).toBeTruthy();
  });

  it("renders attempt number when provided", () => {
    const { getByText } = render(
      <PodiumCard
        {...defaultProps}
        attemptNo="2"
      />
    );

    expect(getByText("Attempt 2")).toBeTruthy();
  });

  it("does not render attempt text when attemptNo is missing", () => {
    const { queryByText } = render(
      <PodiumCard {...defaultProps} />
    );

    expect(queryByText(/Attempt/i)).toBeNull();
  });
});