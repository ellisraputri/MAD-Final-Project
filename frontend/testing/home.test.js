import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../app/(tabs)/index.tsx";

// --- MOCKS ---
jest.mock("@/services/student/student", () => ({
  getStudentDetail: jest.fn(),
}));

jest.mock("@/services/team/team", () => ({
  getTeamDetail: jest.fn(),
  editTeam: jest.fn(),
}));

jest.mock("@/services/summary/summary", () => ({
  getActivityRank: jest.fn(),
  getGlobalRank: jest.fn(),
}));

describe("HomeScreen", () => {
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
