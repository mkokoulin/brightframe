import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { GuestsCounter } from "./GuestsCounter";

describe("GuestsCounter", () => {
  it("renders the default label and value", () => {
    render(<GuestsCounter value={3} onChange={() => {}} />);
    expect(screen.getByText("Guests")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<GuestsCounter value={1} onChange={() => {}} label="Attendees" />);
    expect(screen.getByText("Attendees")).toBeInTheDocument();
  });

  it("calls onChange with an incremented value, clamped to max", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GuestsCounter value={3} onChange={onChange} min={1} max={3} />);

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onChange with a decremented value, clamped to min", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GuestsCounter value={1} onChange={onChange} min={1} max={3} />);

    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("renders the default emoji icon", () => {
    render(<GuestsCounter value={1} onChange={() => {}} />);
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("renders a custom icon when provided", () => {
    render(<GuestsCounter value={1} onChange={() => {}} icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByText("👤")).not.toBeInTheDocument();
  });

  it("hides the icon when icon={null}", () => {
    render(<GuestsCounter value={1} onChange={() => {}} icon={null} />);
    expect(screen.queryByText("👤")).not.toBeInTheDocument();
  });

  it("forwards rest props to the root element", () => {
    render(<GuestsCounter value={1} onChange={() => {}} data-testid="counter" />);
    expect(screen.getByTestId("counter")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<GuestsCounter value={3} onChange={vi.fn()} min={1} max={3} />);
    await expectNoA11yViolations(container);
  });
});
