import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormCard } from "./FormCard";
import styles from "./FormCard.module.css";

describe("FormCard", () => {
  it("renders its children", () => {
    render(<FormCard>Content</FormCard>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies the card class", () => {
    render(<FormCard>Content</FormCard>);
    expect(screen.getByText("Content").className).toContain(styles.card);
  });

  it("merges a custom className", () => {
    render(<FormCard className="extra">Content</FormCard>);
    expect(screen.getByText("Content").className).toContain("extra");
  });

  it("forwards rest props", () => {
    render(<FormCard data-testid="card">Content</FormCard>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});
