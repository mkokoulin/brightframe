import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Title } from "./Title";

describe("Title", () => {
  it("renders its children as an <h1>", () => {
    render(<Title>Letters and Numbers</Title>);
    expect(screen.getByRole("heading", { level: 1, name: "Letters and Numbers" })).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<Title className="custom">Letters and Numbers</Title>);
    expect(screen.getByRole("heading").className).toContain("custom");
  });

  it("renders as a different tag when as is given", () => {
    render(<Title as="h2">Letters and Numbers</Title>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("forwards rest props", () => {
    render(<Title data-testid="title">Letters and Numbers</Title>);
    expect(screen.getByTestId("title")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Title>Letters and Numbers</Title>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
