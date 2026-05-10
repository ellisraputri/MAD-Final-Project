import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../app/(tabs)/index.tsx";

jest.mock("@/components/ui/ranking-card", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ rank, teamName }) => <Text>{`Rank ${rank} ${teamName}`}</Text>;
});

describe("HomeScreen", () => {
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

  it("redirects to team confirmation if user has no team", async () => {
    const { getStudentDetail } = require("@/services/student/student");
    const { router } = require("expo-router");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: { teamId: null },
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(auth)/team_confirmation");
    });
  });

  it("renders team info when user has team", async () => {
    const { getStudentDetail } = require("@/services/student/student");
    const { getTeamDetail } = require("@/services/team/team");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: { teamId: "team1", firstName: "John" },
    });

    getTeamDetail.mockResolvedValue({
      success: true,
      team: {
        id: "team1",
        name: "My Team",
        grade: 10,
        logo: "logo.png",
        members: [
          { firstName: "John" },
          { firstName: "Jane" },
        ],
      },
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText("Team ID: team1")).toBeTruthy();
      expect(getByText("Team Class Grade: 10")).toBeTruthy();
      expect(getByText("My Team")).toBeTruthy();
    });
  });

  it("opens edit team name modal", async () => {
    const { getStudentDetail } = require("@/services/student/student");
    const { getTeamDetail } = require("@/services/team/team");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: { teamId: "team1" },
    });

    getTeamDetail.mockResolvedValue({
      success: true,
      team: {
        id: "team1",
        name: "My Team",
        grade: 10,
        logo: "logo.png",
        members: [
          { firstName: "John" },
          { firstName: "Jane" },
        ],
      },
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => getByText("My Team"));

    fireEvent.press(getByText("My Team")); // ⚠️ might need testID instead

    expect(getByText("Team Name")).toBeTruthy();
  });

  it("edits team name successfully", async () => {
    const { getStudentDetail } = require("@/services/student/student");
    const { getTeamDetail, editTeam } = require("@/services/team/team");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: { teamId: "team1" },
    });

    getTeamDetail.mockResolvedValue({
      success: true,
      team: {
        id: "team1",
        name: "My Team",
        grade: 10,
        logo: "logo.png",
        members: [
          { firstName: "John" },
          { firstName: "Jane" },
        ],
      },
    });

    editTeam.mockResolvedValue({
      success: true,
    });

    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    await waitFor(() => getByText("My Team"));

    // open modal (better with testID in real app)
    fireEvent.press(getByText("My Team"));

    fireEvent.changeText(
      getByPlaceholderText("Enter your team ID"),
      "New Name",
    );

    fireEvent.press(getByText("OK"));

    await waitFor(() => {
      expect(editTeam).toHaveBeenCalled();
    });
  });
});
