import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SettingsScreen from "../app/(tabs)/settings";

jest.mock("@/components/ui/dropdown", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return ({ onSelect }) => (
    <TouchableOpacity onPress={() => onSelect("dark")}>
      <Text>Mock Dropdown</Text>
    </TouchableOpacity>
  );
});

describe("SettingsScreen", () => {
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

  it("renders settings screen", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Logout")).toBeTruthy();
    expect(getByText("General Info")).toBeTruthy();
  });

  it("edits name successfully", async () => {
    const { editStudentDetail } = require("@/services/student/student");
    const { toast } = require("sonner-native");

    editStudentDetail.mockResolvedValue({
      success: true,
      message: "Updated",
    });

    const { getByDisplayValue, getByText } = render(<SettingsScreen />);

    // enter edit mode (press pencil)
    fireEvent.press(getByText("pencil"));

    const input = getByDisplayValue("John");

    fireEvent.changeText(input, "Mike");

    fireEvent.press(getByText("checkmark"));

    await waitFor(() => {
      expect(editStudentDetail).toHaveBeenCalledWith({
        firstName: "Mike",
        appearance: true,
      });

      expect(toast.success).toHaveBeenCalledWith("Updated");
    });
  });

  it("shows error if edit name fails", async () => {
    const { editStudentDetail } = require("@/services/student/student");
    const { toast } = require("sonner-native");

    editStudentDetail.mockResolvedValue({
      success: false,
      message: "Error",
    });

    const { getByText, getByDisplayValue } = render(<SettingsScreen />);

    fireEvent.press(getByText("pencil"));

    fireEvent.changeText(getByDisplayValue("John"), "Mike");

    fireEvent.press(getByText("checkmark"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error");
    });
  });

  it("cancels editing name", () => {
    const { getByText, getByDisplayValue } = render(<SettingsScreen />);

    fireEvent.press(getByText("pencil"));

    fireEvent.changeText(getByDisplayValue("John"), "Mike");

    fireEvent.press(getByText("close"));

    expect(getByDisplayValue("John")).toBeTruthy();
  });

  it("changes theme", async () => {
    const { editStudentDetail } = require("@/services/student/student");

    editStudentDetail.mockResolvedValue({
      success: true,
      message: "Theme updated",
    });

    const { getByText } = render(<SettingsScreen />);

    fireEvent.press(getByText("Mock Dropdown"));

    await waitFor(() => {
      expect(editStudentDetail).toHaveBeenCalledWith({
        firstName: "John",
        appearance: false, // dark mode
      });
    });
  });

  it("logs out successfully", async () => {
    const { logout } = require("@/services/auth/auth");
    const { router } = require("expo-router");
    const { Alert } = require("react-native");

    logout.mockResolvedValue({
      success: true,
      message: "Logged out",
    });

    jest.spyOn(Alert, "alert").mockImplementation((_, __, buttons) => {
      const okButton = buttons.find((b) => b.text === "OK");
      okButton.onPress();
    });

    const { getByText } = render(<SettingsScreen />);

    fireEvent.press(getByText("Logout"));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith("/(auth)/login");
    });
  });
});
