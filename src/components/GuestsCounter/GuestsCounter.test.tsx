import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
});
