import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Card } from "./Card";
import styles from "./Card.module.css";

describe("Card", () => {
  it("renders a div by default", () => {
    render(<Card>Content</Card>);
    const el = screen.getByText("Content");
    expect(el.tagName).toBe("DIV");
  });

  it("renders as an anchor when href is given", () => {
    render(<Card href="/events">Content</Card>);
    const link = screen.getByRole("link", { name: "Content" });
    expect(link).toHaveAttribute("href", "/events");
  });

  it("applies the surface/md classes by default", () => {
    render(<Card>Content</Card>);
    const el = screen.getByText("Content");
    expect(el.className).toContain(styles.surface);
    expect(el.className).toContain(styles.rmd);
  });

  it("applies the requested variant and radius classes", () => {
    render(<Card variant="elevated" radius="xl">Content</Card>);
    const el = screen.getByText("Content");
    expect(el.className).toContain(styles.elevated);
    expect(el.className).toContain(styles.rxl);
  });

  it("applies the hover modifier only when hover is true", () => {
    const { rerender } = render(<Card>Content</Card>);
    expect(screen.getByText("Content").className).not.toContain(styles.hover);

    rerender(<Card hover>Content</Card>);
    expect(screen.getByText("Content").className).toContain(styles.hover);
  });

  it("forwards rest props such as data attributes", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Card variant="elevated" radius="xl">
        Content
      </Card>,
    );
    await expectNoA11yViolations(container);
  });
});
