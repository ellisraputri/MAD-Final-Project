import React from "react";
import { render } from "@testing-library/react-native";
import RankingCard from "@/components/ui/ranking-card";

describe("RankingCard", () => {
  const defaultProps = {
    imageUrl: "https://example.com/logo.png",
    teamName: "Alpha Team",
    rank: "1",
    score: "150",
  };

  it("renders team name correctly", () => {
    const { getByText } = render(
      <RankingCard {...defaultProps} />
    );

    expect(getByText("Alpha Team")).toBeTruthy();
  });

  it("renders rank correctly", () => {
    const { getByText } = render(
      <RankingCard {...defaultProps} />
    );

    expect(getByText("#1")).toBeTruthy();
  });

  it("renders score correctly", () => {
    const { getByText } = render(
      <RankingCard {...defaultProps} />
    );

    expect(getByText("150")).toBeTruthy();
  });

  it("renders attempt number when provided", () => {
    const { getByText } = render(
      <RankingCard
        {...defaultProps}
        attemptNo="2"
      />
    );

    expect(getByText("Attempt 2")).toBeTruthy();
  });

  it("does not render attempt number when not provided", () => {
    const { queryByText } = render(
      <RankingCard {...defaultProps} />
    );

    expect(queryByText(/Attempt/i)).toBeNull();
  });

  it("matches snapshot", () => {
    const tree = render(
      <RankingCard {...defaultProps} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});