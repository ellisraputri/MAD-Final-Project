import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TeamConfirmationScreen from "../app/(auth)/team_confirmation";

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main screen text", async () => {
    const { getStudentDetail } = require("@/services/student/student");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: { teamId: null },
    });

    const { getAllByText, getByText } = render(<TeamConfirmationScreen />);

    expect(
      getByText("Looks like you are not part of a team yet!"),
    ).toBeTruthy();

    expect(getAllByText("Create New Team")[0]).toBeTruthy();
    expect(getByText("Join a Team")).toBeTruthy();
  });

  it("redirects if user already has team", async () => {
    const mockPush = jest.fn();

    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue({
      push: mockPush,
    });

    const { getStudentDetail } = require("@/services/student/student");

    getStudentDetail.mockResolvedValue({
      success: true,
      data: { teamId: "123" },
    });

    render(<TeamConfirmationScreen />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("opens create team modal", () => {
    const { getAllByText } = render(<TeamConfirmationScreen />);

    fireEvent.press(getAllByText("Create New Team")[0]);

    expect(getAllByText("Create New Team")[1]).toBeTruthy(); // modal title
  });

  it("creates team successfully", async () => {
    const mockPush = jest.fn();

    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue({
      push: mockPush,
    });

    const { createTeam } = require("@/services/team/team");

    createTeam.mockResolvedValue({
      success: true,
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    // open modal
    fireEvent.press(getAllByText("Create New Team")[0]);

    // fill form
    fireEvent.changeText(
      getByPlaceholderText("Enter your team name"),
      "My Team",
    );

    fireEvent.press(getByText("Select Grade"));

    fireEvent.press(getAllByText("OK")[0]);

    await waitFor(() => {
      expect(createTeam).toHaveBeenCalledWith({
        name: "My Team",
        grade: 10,
      });

      expect(mockPush).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("shows error if create team fails", async () => {
    const { createTeam } = require("@/services/team/team");
    const { toast } = require("sonner-native");

    createTeam.mockResolvedValue({
      success: false,
      message: "Failed",
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getAllByText("Create New Team")[0]);

    fireEvent.changeText(
      getByPlaceholderText("Enter your team name"),
      "My Team",
    );

    fireEvent.press(getByText("Select Grade"));
    fireEvent.press(getAllByText("OK")[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed");
    });
  });

  it("joins team successfully", async () => {
    const mockPush = jest.fn();

    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue({
      push: mockPush,
    });

    const { joinTeam } = require("@/services/team/team");

    joinTeam.mockResolvedValue({
      success: true,
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getByText("Join a Team"));

    fireEvent.changeText(getByPlaceholderText("Enter your team ID"), "ABC123");

    fireEvent.press(getAllByText("OK")[1]);

    await waitFor(() => {
      expect(joinTeam).toHaveBeenCalledWith({
        teamId: "ABC123",
      });

      expect(mockPush).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("shows error if join team fails", async () => {
    const { joinTeam } = require("@/services/team/team");
    const { toast } = require("sonner-native");

    joinTeam.mockResolvedValue({
      success: false,
      message: "Invalid team",
    });

    const { getByText, getAllByText, getByPlaceholderText } = render(
      <TeamConfirmationScreen />,
    );

    fireEvent.press(getByText("Join a Team"));

    fireEvent.changeText(getByPlaceholderText("Enter your team ID"), "WRONG");

    fireEvent.press(getAllByText("OK")[1]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid team");
    });
  });
});
