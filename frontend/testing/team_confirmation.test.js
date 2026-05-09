import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TeamConfirmationScreen from "@/app/(auth)/team_confirmation";

// --- MOCKS ---
jest.mock("@/components/ui/dropdown", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return ({ onSelect }) => (
    <TouchableOpacity onPress={() => onSelect("10")}>
      <Text>Select Grade</Text>
    </TouchableOpacity>
  );
});

describe("TeamConfirmationScreen", () => {
  const { useAppContext } = require("@/context/AppContext");
  const { useLocalSearchParams } = require("expo-router");

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

    useLocalSearchParams.mockReturnValue({});

    const { getStudentDetail } = require("@/services/student/student");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: {
        teamId: null,
      },
    });
  });

  it("renders correctly", async () => {
    const { getByText, getAllByText } = render(<TeamConfirmationScreen />);

    await waitFor(() => {
      expect(
        getByText("Looks like you are not part of a team yet!"),
      ).toBeTruthy();
    });

    expect(getAllByText("Create New Team")[0]).toBeTruthy();
    expect(getByText("Join a Team")).toBeTruthy();
  });

  it("redirects user if already has a team", async () => {
    const { getStudentDetail } = require("@/services/student/student");
    const { router } = require("expo-router");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: {
        teamId: "TEAM123",
      },
    });

    render(<TeamConfirmationScreen />);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("opens create team modal", async () => {
    const { getByText, getAllByText } = render(<TeamConfirmationScreen />);

    fireEvent.press(getAllByText("Create New Team")[0]);

    await waitFor(() => {
      expect(getAllByText("Create New Team")[0]).toBeTruthy();
      expect(getByText("Team Name")).toBeTruthy();
    });
  });

  it("creates a team successfully", async () => {
    const { createTeam } = require("@/services/team/team");
    const { router } = require("expo-router");

    createTeam.mockResolvedValue({
      success: true,
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getAllByText("Create New Team")[0]);

    const input = getByPlaceholderText("Enter your team name");

    fireEvent.changeText(input, "Alpha Team");

    fireEvent.press(getByText("Select Grade"));

    fireEvent.press(getAllByText("OK")[0]);

    await waitFor(() => {
      expect(createTeam).toHaveBeenCalledWith({
        name: "Alpha Team",
        grade: 10,
      });

      expect(router.push).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("opens join team modal", async () => {
    const { getByText } = render(<TeamConfirmationScreen />);

    fireEvent.press(getByText("Join a Team"));

    await waitFor(() => {
      expect(getByText("Join Team By ID")).toBeTruthy();
    });
  });

  it("joins a team successfully", async () => {
    const { joinTeam } = require("@/services/team/team");
    const { router } = require("expo-router");
    joinTeam.mockResolvedValue({
      success: true,
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getByText("Join a Team"));

    const input = getByPlaceholderText("Enter your team ID");

    fireEvent.changeText(input, "TEAM001");

    fireEvent.press(getAllByText("OK")[1]);

    await waitFor(() => {
      expect(joinTeam).toHaveBeenCalledWith({
        teamId: "TEAM001",
      });

      expect(router.push).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("navigates to QR scan page", async () => {
    const { router } = require("expo-router");
    const { getByText } = render(<TeamConfirmationScreen />);

    fireEvent.press(getByText("Join a Team"));

    fireEvent.press(getByText("Scan QR Code"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/(auth)/scan_team");
    });
  });

  it("handles failed create team request", async () => {
    const { createTeam } = require("@/services/team/team");

    createTeam.mockResolvedValue({
      success: false,
      message: "Create failed",
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getAllByText("Create New Team")[0]);

    fireEvent.changeText(
      getByPlaceholderText("Enter your team name"),
      "Test Team",
    );

    fireEvent.press(getByText("Select Grade"));

    fireEvent.press(getAllByText("OK")[0]);

    await waitFor(() => {
      expect(createTeam).toHaveBeenCalled();
    });
  });

  it("handles failed join team request", async () => {
    const { joinTeam } = require("@/services/team/team");

    joinTeam.mockResolvedValue({
      success: false,
      message: "Join failed",
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getByText("Join a Team"));

    fireEvent.changeText(getByPlaceholderText("Enter your team ID"), "INVALID");

    fireEvent.press(getAllByText("OK")[1]);

    await waitFor(() => {
      expect(joinTeam).toHaveBeenCalledWith({
        teamId: "INVALID",
      });
    });
  });
});
