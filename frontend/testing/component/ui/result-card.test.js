import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ResultCard from "@/components/ui/result-card";
import { Pressable, Text } from "react-native";

describe("ResultCard", () => {
  it("renders attempt and score correctly", () => {
    const { getByText } = render(
      <ResultCard index={2} score={95.1234} onPress={jest.fn()} />,
    );

    expect(getByText("Attempt 2")).toBeTruthy();
    expect(getByText("95.123%")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();

    const { UNSAFE_getByType } = render(
      <ResultCard index={1} score={50} onPress={onPress} />,
    );

    const pressable = UNSAFE_getByType(Pressable);

    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const tree = render(
      <ResultCard index={1} score={12.3456} onPress={jest.fn()} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
