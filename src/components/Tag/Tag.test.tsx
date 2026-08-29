import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
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

  it("has no accessibility violations", async () => {
    const { container } = render(<Tag variant="error" size="lg">Sold out</Tag>);
    await expectNoA11yViolations(container);
  });

  it("renders no dismiss button by default", () => {
    render(<Tag>Workshop</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a dismiss button when onDismiss is given and fires it on click", () => {
    const onDismiss = vi.fn();
    render(<Tag onDismiss={onDismiss}>Meeting room</Tag>);
    const btn = screen.getByRole("button", { name: "Remove Meeting room" });
    fireEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses a custom dismissLabel when given", () => {
    render(<Tag onDismiss={() => {}} dismissLabel="Clear filter">Meeting room</Tag>);
    expect(screen.getByRole("button", { name: "Clear filter" })).toBeInTheDocument();
  });

  it("has no accessibility violations when dismissible", async () => {
    const { container } = render(<Tag onDismiss={() => {}}>Meeting room</Tag>);
    await expectNoA11yViolations(container);
  });
});
