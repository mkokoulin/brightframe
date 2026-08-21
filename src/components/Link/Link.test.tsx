import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Link } from "./Link";

describe("Link", () => {
  it("renders its children as an anchor", () => {
    render(<Link href="/about">Learn more</Link>);
    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute("href", "/about");
  });

  it("defaults href to '#' when not given", () => {
    render(<Link>Learn more</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("exposes alt as the title attribute", () => {
    render(<Link alt="External profile">Instagram</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("title", "External profile");
  });

  it("sets target when given and always sets rel=noreferrer", () => {
    render(<Link href="https://example.com" target="_blank">Instagram</Link>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("defaults to the default variant with underline", () => {
    render(<Link href="#">Learn more</Link>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("default");
    expect(link.className).not.toContain("noUnderline");
  });

  it("applies the requested variant", () => {
    render(<Link href="#" variant="brand">Learn more</Link>);
    expect(screen.getByRole("link").className).toContain("brand");
  });

  it("applies the noUnderline class when underline=false", () => {
    render(<Link href="#" underline={false}>Learn more</Link>);
    expect(screen.getByRole("link").className).toContain("noUnderline");
  });

  it("forwards rest props to the anchor", () => {
    render(<Link href="#" data-testid="link">Learn more</Link>);
    expect(screen.getByTestId("link")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Link href="https://example.com" target="_blank">Instagram</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
