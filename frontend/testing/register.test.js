import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../app/(auth)/register.tsx";

jest.mock("../components/ui/dropdown.tsx", () => {
  const React = require("react");
  const { Text, TouchableOpacity } = require("react-native");

  return ({ onSelect }) => (
    <TouchableOpacity onPress={() => onSelect("10")}>
      <Text>Select Grade</Text>
    </TouchableOpacity>
  );
});

describe("RegisterScreen", () => {
  it("renders all inputs and button", () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByPlaceholderText("Enter your first name")).toBeTruthy();
    expect(getByText("Register")).toBeTruthy();
  });

  it("shows alert if fields are empty", async () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Register"));

    expect(global.alert).toHaveBeenCalledWith("Fields cannot be empty");
  });

  it("shows alert if email is invalid", async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "testcom",
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "testcom",
    );
    fireEvent.changeText(
      getByPlaceholderText("Reenter your password"),
      "testcom",
    );
    fireEvent.changeText(getByPlaceholderText("Enter your first name"), "John");

    fireEvent.press(getByText("Select Grade"));
    fireEvent.press(getByText("Register"));

    expect(global.alert).toHaveBeenCalledWith("Invalid email format");
  });

  it("shows alert if password is invalid", async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@mail.com",
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "t",
    );
    fireEvent.changeText(
      getByPlaceholderText("Reenter your password"),
      "t",
    );
    fireEvent.changeText(getByPlaceholderText("Enter your first name"), "John");

    fireEvent.press(getByText("Select Grade"));
    fireEvent.press(getByText("Register"));

    expect(global.alert).toHaveBeenCalledWith("Password must be at least 6 characters");
  });

  it("updates input values", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);

    const emailInput = getByPlaceholderText("Enter your email");

    fireEvent.changeText(emailInput, "test@mail.com");

    expect(emailInput.props.value).toBe("test@mail.com");
  });

  it("calls API and navigates on success", async () => {
    const mockReplace = jest.fn();

    jest.spyOn(require("expo-router"), "useRouter").mockReturnValue({
      push: jest.fn(),
      replace: mockReplace,
    });

    const { registerAndGetData } = require("../services/auth/auth.ts");

    registerAndGetData.mockResolvedValue({
      success: true,
      message: "Success",
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "test@mail.com",
    );
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "123456");
    fireEvent.changeText(
      getByPlaceholderText("Reenter your password"),
      "123456",
    );
    fireEvent.changeText(getByPlaceholderText("Enter your first name"), "John");

    fireEvent.press(getByText("Select Grade"));

    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(registerAndGetData).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith("Success");
      expect(mockReplace).toHaveBeenCalledWith("/team_confirmation");
    });
  });
});
