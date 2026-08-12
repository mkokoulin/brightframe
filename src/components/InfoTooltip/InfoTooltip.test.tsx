import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InfoTooltip } from "./InfoTooltip";

describe("InfoTooltip", () => {
  it("uses the label as the trigger's accessible name", () => {
    render(<InfoTooltip label="Discount details" />);
    expect(screen.getByRole("button", { name: "Discount details" })).toBeInTheDocument();
  });

  it("does not show the tooltip bubble initially", () => {
    render(<InfoTooltip label="Discount details" />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the bubble on mouse enter and hides it on mouse leave", () => {
    render(<InfoTooltip label="Discount details" />);
    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Discount details");

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the bubble on focus and hides it on blur", () => {
    render(<InfoTooltip label="Discount details" />);
    const trigger = screen.getByRole("button");

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("toggles open state on click", () => {
    render(<InfoTooltip label="Discount details" />);
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", () => {
    render(<InfoTooltip label="Discount details" />);
    const trigger = screen.getByRole("button");

    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("defaults to the top position", () => {
    render(<InfoTooltip label="Discount details" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("tooltip").className).toContain("top");
  });

  it("respects a custom position", () => {
    render(<InfoTooltip label="Discount details" position="right" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("tooltip").className).toContain("right");
  });

  it("renders a custom trigger icon", () => {
    render(<InfoTooltip label="Discount details" icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("forwards rest props to the wrapper", () => {
    render(<InfoTooltip label="Discount details" data-testid="wrap" />);
    expect(screen.getByTestId("wrap")).toBeInTheDocument();
  });
});
