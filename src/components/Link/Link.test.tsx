import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
