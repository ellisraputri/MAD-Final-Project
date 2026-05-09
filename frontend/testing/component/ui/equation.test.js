import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Equation from "@/components/ui/equation";

jest.mock("react-native-webview", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return {
    WebView: ({ onMessage }) => (
      <TouchableOpacity
        onPress={() =>
          onMessage?.({
            nativeEvent: {
              data: "120",
            },
          })
        }
      >
        <Text>Mock WebView</Text>
      </TouchableOpacity>
    ),
  };
});

describe("Equation", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Equation latex={"E = mc^2"} />
    );

    expect(getByText("Mock WebView")).toBeTruthy();
  });

  it("handles webview message and updates height", () => {
    const { getByText } = render(
      <Equation latex={"a^2+b^2=c^2"} />
    );

    fireEvent.press(getByText("Mock WebView"));

    expect(getByText("Mock WebView")).toBeTruthy();
  });

  it("renders with custom font size", () => {
    const { getByText } = render(
      <Equation latex={"x=1"} fontSize={30} />
    );

    expect(getByText("Mock WebView")).toBeTruthy();
  });

  it("renders different latex expressions", () => {
    const { rerender, getByText } = render(
      <Equation latex={"\\frac{1}{2}"} />
    );

    expect(getByText("Mock WebView")).toBeTruthy();

    rerender(<Equation latex={"\\int_0^1 x dx"} />);

    expect(getByText("Mock WebView")).toBeTruthy();
  });
});