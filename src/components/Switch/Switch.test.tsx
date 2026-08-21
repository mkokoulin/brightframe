import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders off by default and toggles on click", () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} label="Dark mode" />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("reflects the checked prop", () => {
    render(<Switch checked label="Dark mode" onChange={vi.fn()} />);
    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeChecked();
  });

  it("is disabled and does not fire onChange", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} disabled label="Dark mode" />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards native input props", () => {
    render(<Switch checked={false} onChange={vi.fn()} label="Dark mode" data-testid="dm-switch" />);
    expect(screen.getByTestId("dm-switch")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Switch checked label="Dark mode" onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
