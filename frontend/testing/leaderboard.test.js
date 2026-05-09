import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import LeaderboardScreen from "../app/(tabs)/leaderboard";

// --- MOCKS ---
jest.mock("react-native-element-dropdown", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return {
    Dropdown: ({ onChange }) => (
      <TouchableOpacity onPress={() => onChange({ value: "activity1" })}>
        <Text>Mock Dropdown</Text>
      </TouchableOpacity>
    ),
  };
});

const mockRankings = [
  { teamId: "team1", rank: 1, score: 0.9, attemptNo: 1, timestamp: "1" },
  { teamId: "team2", rank: 2, score: 0.8, attemptNo: 1, timestamp: "2" },
  { teamId: "team3", rank: 3, score: 0.7, attemptNo: 1, timestamp: "3" },
  { teamId: "team4", rank: 4, score: 0.6, attemptNo: 1, timestamp: "4" },
];

const mockTeams = [
  { id: "team1", name: "My Team", logo: "logo1" },
  { id: "team2", name: "Team 2", logo: "logo2" },
  { id: "team3", name: "Team 3", logo: "logo3" },
  { id: "team4", name: "Team 4", logo: "logo4" },
];

describe("LeaderboardScreen", () => {
  const { useAppContext } = require("@/context/AppContext");
  beforeEach(() => {
    jest.clearAllMocks();

    useAppContext.mockReturnValue({
      user: { id: "1", firstName: "John", appearance: true },
      setUser: jest.fn(),
      team: {
        id: "team1",
        name: "My Team",
        grade: 10,
        logo: "logo.png",
      },
      setTeam: jest.fn(),
    });
  });

  it("shows loading initially", async () => {
    const { getGlobalRank } = require("@/services/summary/summary");
    const { getTeamDetailBatch } = require("@/services/team/team");

    getGlobalRank.mockResolvedValue({
      success: true,
      rankings: [],
    });

    getTeamDetailBatch.mockResolvedValue({
      success: true,
      teams: [],
    });

    const { getByText } = render(<LeaderboardScreen />);

    // loading appears briefly
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("loads and displays global rankings", async () => {
    const { getGlobalRank } = require("@/services/summary/summary");
    const { getTeamDetailBatch } = require("@/services/team/team");

    getGlobalRank.mockResolvedValue({
      success: true,
      rankings: mockRankings,
    });

    getTeamDetailBatch.mockResolvedValue({
      success: true,
      teams: mockTeams,
    });

    const { getByText } = render(<LeaderboardScreen />);

    await waitFor(() => {
      expect(getByText("Podium 1 My Team")).toBeTruthy();
      expect(getByText("Podium 2 Team 2")).toBeTruthy();
    });
  });

  it("fetches activity ranking when dropdown changes", async () => {
    const {
      getGlobalRank,
      getActivityRank,
    } = require("@/services/summary/summary");
    const { getTeamDetailBatch } = require("@/services/team/team");

    getGlobalRank.mockResolvedValue({
      success: true,
      rankings: mockRankings,
    });

    getActivityRank.mockResolvedValue({
      success: true,
      rankings: mockRankings,
    });

    getTeamDetailBatch.mockResolvedValue({
      success: true,
      teams: mockTeams,
    });

    const { getByText } = render(<LeaderboardScreen />);

    await waitFor(() => getByText("Leaderboard"));

    fireEvent.press(getByText("Mock Dropdown"));

    await waitFor(() => {
      expect(getActivityRank).toHaveBeenCalled();
    });
  });

  it("switches to activity ranking", async () => {
    const {
      getGlobalRank,
      getActivityRank,
    } = require("@/services/summary/summary");
    const { getTeamDetailBatch } = require("@/services/team/team");

    getGlobalRank.mockResolvedValue({
      success: true,
      rankings: mockRankings,
    });

    getActivityRank.mockResolvedValue({
      success: true,
      rankings: mockRankings,
    });

    getTeamDetailBatch.mockResolvedValue({
      success: true,
      teams: mockTeams,
    });

    const { getByText } = render(<LeaderboardScreen />);

    await waitFor(() => getByText("Podium 1 My Team"));

    fireEvent.press(getByText("Mock Dropdown"));

    await waitFor(() => {
      expect(getActivityRank).toHaveBeenCalled();
    });
  });

  it("shows my team best ranking", async () => {
    const { getGlobalRank } = require("@/services/summary/summary");
    const { getTeamDetailBatch } = require("@/services/team/team");

    getGlobalRank.mockResolvedValue({
      success: true,
      rankings: mockRankings,
    });

    getTeamDetailBatch.mockResolvedValue({
      success: true,
      teams: mockTeams,
    });

    const { getByText } = render(<LeaderboardScreen />);

    await waitFor(() => {
      expect(getByText("My Team Best:")).toBeTruthy();
      expect(getByText("Rank 1 My Team")).toBeTruthy();
    });
  });
});
