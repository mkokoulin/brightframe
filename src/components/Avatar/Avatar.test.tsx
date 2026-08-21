import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders an image when src is given", () => {
    render(<Avatar src="https://example.com/a.jpg" name="Ana Torres" />);
    const img = screen.getByRole("img", { name: "Ana Torres" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "https://example.com/a.jpg");
  });

  it("falls back to initials derived from name when there's no src", () => {
    render(<Avatar name="Ana Torres" />);
    expect(screen.getByText("AT")).toBeInTheDocument();
  });

  it("uses the first two letters for a single-word name", () => {
    render(<Avatar name="Madonna" />);
    expect(screen.getByText("MA")).toBeInTheDocument();
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar src="https://example.com/broken.jpg" name="Jamie Fox" />);
    const img = screen.getByRole("img", { name: "Jamie Fox" });
    fireEvent.error(img);
    expect(screen.getByText("JF")).toBeInTheDocument();
  });

  it("falls back to a generic icon when there's no src and no name", () => {
    const { container } = render(<Avatar />);
    expect(screen.getByRole("img", { name: "Avatar" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Avatar src="https://example.com/a.jpg" name="Ana Torres" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
