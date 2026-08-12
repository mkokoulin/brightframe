import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GhostButton } from "./GhostButton";

describe("GhostButton", () => {
  it("renders as a button and fires onClick when no href is given", () => {
    const onClick = vi.fn();
    render(<GhostButton label="Click me" onClick={onClick} />);

    const el = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(el);

    expect(onClick).toHaveBeenCalled();
  });

  it("renders as a link when href is given", () => {
    render(<GhostButton label="Go" href="/somewhere" />);

    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("href", "/somewhere");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens in a new tab when targetBlank is set", () => {
    render(<GhostButton label="Go" href="/somewhere" targetBlank />);

    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders a custom icon when provided", () => {
    render(<GhostButton label="Go" icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
