import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import CustomDropdown from "@/components/ui/dropdown";

jest.mock("react-native-element-dropdown", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return {
    Dropdown: ({ placeholder, onChange, value }) => (
      <TouchableOpacity
        testID="dropdown"
        onPress={() => onChange({ label: "Grade 10", value: "10" })}
      >
        <Text>{value || placeholder}</Text>
      </TouchableOpacity>
    ),
  };
});

describe("CustomDropdown", () => {
  const mockData = [
    { label: "Grade 10", value: "10" },
    { label: "Grade 11", value: "11" },
  ];

  it("renders placeholder correctly", () => {
    const { getByText } = render(
      <CustomDropdown
        data={mockData}
        placeholder="Select Grade"
        value=""
      />
    );

    expect(getByText("Select Grade")).toBeTruthy();
  });

  it("renders selected value correctly", () => {
    const { getByText } = render(
      <CustomDropdown
        data={mockData}
        placeholder="Select Grade"
        value="10"
      />
    );

    expect(getByText("10")).toBeTruthy();
  });

  it("calls onSelect when item selected", () => {
    const onSelect = jest.fn();

    const { getByText } = render(
      <CustomDropdown
        data={mockData}
        placeholder="Select Grade"
        value=""
        onSelect={onSelect}
      />
    );

    fireEvent.press(getByText('Select Grade'));

    expect(onSelect).toHaveBeenCalledWith("10");
  });

  it("does not crash without onSelect", () => {
    const { getByText } = render(
      <CustomDropdown
        data={mockData}
        placeholder="Select Grade"
        value=""
      />
    );

    fireEvent.press(getByText('Select Grade'));

    expect(getByText('Select Grade')).toBeTruthy();
  });
});