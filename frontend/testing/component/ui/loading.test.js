import React from "react";
import { render } from "@testing-library/react-native";
import { ActivityIndicator } from "react-native";
import Loading from "@/components/ui/loading";

jest.mock(
  "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
  () => {
    const React = require("react");
    const { Text } = require("react-native");

    return () => <Text>Loading Spinner</Text>;
  },
);

describe("Loading", () => {
  it("renders loading text", () => {
    const { getByText } = render(<Loading />);

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(<Loading />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
