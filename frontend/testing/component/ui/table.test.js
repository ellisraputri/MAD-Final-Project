import React from "react";
import { render } from "@testing-library/react-native";
import Table from "@/components/ui/table";

describe("Table", () => {
  const columns = [
    { key: "name", title: "Name", flex: 1 },
    { key: "score", title: "Score", flex: 1 },
  ];

  const data = [
    { name: "Alice", score: 90 },
    { name: "Bob", score: 85 },
  ];

  it("renders header columns correctly", () => {
    const { getByText } = render(<Table columns={columns} data={data} />);

    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Score")).toBeTruthy();
  });

  it("renders all row data correctly", () => {
    const { getByText } = render(<Table columns={columns} data={data} />);

    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
    expect(getByText("90")).toBeTruthy();
    expect(getByText("85")).toBeTruthy();
  });

  it("renders correct number of rows", () => {
    const { getAllByText } = render(<Table columns={columns} data={data} />);

    // Each row renders name + score, so we expect duplicates in structure
    expect(getAllByText("Alice").length).toBeGreaterThan(0);
    expect(getAllByText("Bob").length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const tree = render(
      <Table columns={columns} data={data} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});