// testing/component/ui/button.test.js

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "@/components/ui/button";

describe("Button", () => {
  const defaultProps = {
    onPress: jest.fn(),
    width: 120,
    fontSize: 18,
    marginTop: 10,
    text: "Submit",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <Button {...defaultProps} />
    );

    expect(getByText("Submit")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <Button
        {...defaultProps}
        onPress={onPress}
      />
    );

    fireEvent.press(getByText("Submit"));

    expect(onPress).toHaveBeenCalled();
  });

  it("renders custom height", () => {
    const { getByText } = render(
      <Button
        {...defaultProps}
        height={60}
      />
    );

    expect(getByText("Submit")).toBeTruthy();
  });

  it("renders with marginBottom", () => {
    const { getByText } = render(
      <Button
        {...defaultProps}
        marginBottom={20}
      />
    );

    expect(getByText("Submit")).toBeTruthy();
  });

  it("renders different text", () => {
    const { getByText } = render(
      <Button
        {...defaultProps}
        text="Confirm"
      />
    );

    expect(getByText("Confirm")).toBeTruthy();
  });
});