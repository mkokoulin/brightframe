import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SegmentedBar, SegmentedItem } from "./SegmentedBar";

describe("SegmentedBar", () => {
  it("renders its items", () => {
    render(
      <SegmentedBar>
        <SegmentedItem>Day</SegmentedItem>
        <SegmentedItem>Week</SegmentedItem>
      </SegmentedBar>,
    );
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
  });

  it("renders an item's icon", () => {
    render(
      <SegmentedBar>
        <SegmentedItem icon={<span data-testid="icon" />}>Day</SegmentedItem>
      </SegmentedBar>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
