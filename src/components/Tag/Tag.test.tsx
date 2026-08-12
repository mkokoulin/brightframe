import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "./Tag";
import styles from "./Tag.module.css";

describe("Tag", () => {
  it("renders its children", () => {
    render(<Tag>Workshop</Tag>);
    expect(screen.getByText("Workshop")).toBeInTheDocument();
  });

  it("applies the brand/md classes by default", () => {
    render(<Tag>Workshop</Tag>);
    const el = screen.getByText("Workshop");
    expect(el.className).toContain(styles.brand);
    expect(el.className).toContain(styles.md);
  });

  it("applies the requested variant and size classes", () => {
    render(<Tag variant="error" size="lg">Sold out</Tag>);
    const el = screen.getByText("Sold out");
    expect(el.className).toContain(styles.error);
    expect(el.className).toContain(styles.lg);
  });

  it("forwards rest props such as onClick", () => {
    render(<Tag data-testid="tag">New</Tag>);
    expect(screen.getByTestId("tag").tagName).toBe("SPAN");
  });
});
