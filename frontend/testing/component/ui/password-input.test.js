import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PasswordInput from "@/components/ui/password-input";

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: ({ name }) => <Text>{name}</Text>,
  };
});

describe("PasswordInput", () => {
  it("renders placeholder correctly", () => {
    const { getByPlaceholderText } = render(
      <PasswordInput
        placeholder="Enter password"
        password=""
        setPassword={jest.fn()}
      />,
    );

    expect(getByPlaceholderText("Enter password")).toBeTruthy();
  });

  it("renders password value correctly", () => {
    const { getByDisplayValue } = render(
      <PasswordInput
        placeholder="Password"
        password="secret123"
        setPassword={jest.fn()}
      />,
    );

    expect(getByDisplayValue("secret123")).toBeTruthy();
  });

  it("calls setPassword on text change", () => {
    const setPassword = jest.fn();

    const { getByPlaceholderText } = render(
      <PasswordInput
        placeholder="Password"
        password=""
        setPassword={setPassword}
      />,
    );

    fireEvent.changeText(getByPlaceholderText("Password"), "newpassword");

    expect(setPassword).toHaveBeenCalledWith("newpassword");
  });

  it("toggles password visibility", () => {
    const { getByText } = render(
      <PasswordInput
        placeholder="Password"
        password=""
        setPassword={jest.fn()}
      />,
    );

    expect(getByText("eye-off")).toBeTruthy();

    fireEvent.press(getByText("eye-off"));

    expect(getByText("eye")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <PasswordInput
        placeholder="Password"
        password=""
        setPassword={jest.fn()}
      />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
