// testing/component/accordion.test.js

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Accordion from "@/components/ui/accordion";

describe("Accordion", () => {
  it("renders title correctly", () => {
    const { getByText } = render(
      <Accordion title="FAQ Section" marginBottom={10}>
        <></>
      </Accordion>,
    );

    expect(getByText("FAQ Section")).toBeTruthy();
  });

  it("does not show children initially", () => {
    const { queryByText } = render(
      <Accordion title="Accordion" marginBottom={10}>
        <>{/* children */}</>
      </Accordion>,
    );

    expect(queryByText("Accordion Content")).toBeNull();
  });

  it("shows children when pressed", () => {
    const { Text } = require("react-native");
    const { getByText } = render(
      <Accordion title="Accordion" marginBottom={10}>
        <Text>Accordion Content</Text>
      </Accordion>,
    );

    fireEvent.press(getByText("Accordion"));

    expect(getByText("Accordion Content")).toBeTruthy();
  });

  it("hides children when pressed twice", () => {
    const { Text } = require("react-native");
    const { getByText, queryByText } = render(
      <Accordion title="Accordion" marginBottom={10}>
        <Text>Accordion Content</Text>
      </Accordion>,
    );

    fireEvent.press(getByText("Accordion"));

    expect(getByText("Accordion Content")).toBeTruthy();

    fireEvent.press(getByText("Accordion"));

    expect(queryByText("Accordion Content")).toBeNull();
  });

  it("toggles chevron icon", () => {
    const { Text } = require("react-native");
    const { getByText, queryByText } = render(
      <Accordion title="Accordion" marginBottom={10}>
        <Text>Content</Text>
      </Accordion>,
    );

    // collapsed initially
    expect(queryByText("chevron-down")).toBeTruthy();

    fireEvent.press(getByText("Accordion"));

    // expanded
    expect(queryByText("chevron-up")).toBeTruthy();
  });
});
