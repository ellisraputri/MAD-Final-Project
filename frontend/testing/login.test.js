import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/(auth)/login.tsx";
import { loginAndGetData } from "../services/auth/auth.ts";

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows alert if fields are empty", async () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Login"));

    expect(global.alert).toHaveBeenCalledWith("Fields cannot be empty");
  });

  it("calls API and shows success message", async () => {
    loginAndGetData.mockResolvedValue({
      success: true,
      message: "Login success",
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@mail.com",
    );
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "123456");

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(loginAndGetData).toHaveBeenCalledWith({
        email: "test@mail.com",
        password: "123456",
      });
    });

    expect(global.alert).toHaveBeenCalledWith("Login success");
  });

  it("navigates on success", async () => {
    const mockReplace = jest.fn();

    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
    });

    loginAndGetData.mockResolvedValue({
      success: true,
      message: "OK",
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Enter your email"), "a");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "b");

    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/team_confirmation");
    });
  });
});
