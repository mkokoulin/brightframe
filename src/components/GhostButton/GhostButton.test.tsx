import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
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

  it("defaults to the md size", () => {
    render(<GhostButton label="Go" onClick={() => {}} />);
    expect(screen.getByRole("button").className).toContain("md");
  });

  it("applies the requested size", () => {
    render(<GhostButton label="Go" size="lg" onClick={() => {}} />);
    expect(screen.getByRole("button").className).toContain("lg");
  });

  it("forwards rest props to the button", () => {
    render(<GhostButton label="Go" onClick={() => {}} data-testid="ghost" />);
    expect(screen.getByTestId("ghost")).toBeInTheDocument();
  });

  it("forwards rest props to the anchor", () => {
    render(<GhostButton label="Go" href="/somewhere" data-testid="ghost-link" />);
    expect(screen.getByTestId("ghost-link")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<GhostButton label="Go" href="/somewhere" targetBlank />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
