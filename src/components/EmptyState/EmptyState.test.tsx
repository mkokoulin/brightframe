import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No reviews yet" />);
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("renders a description when given", () => {
    render(<EmptyState title="No reviews yet" description="Be the first to share your experience" />);
    expect(screen.getByText("Be the first to share your experience")).toBeInTheDocument();
  });

  it("omits the description when not given", () => {
    const { container } = render(<EmptyState title="No reviews yet" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("renders an icon when given, hidden from assistive tech", () => {
    render(<EmptyState title="No reviews yet" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders an action when given", () => {
    render(<EmptyState title="No reviews yet" action={<button>Leave a review</button>} />);
    expect(screen.getByRole("button", { name: "Leave a review" })).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<EmptyState title="No reviews yet" className="custom" />);
    expect(screen.getByText("No reviews yet").closest("div")?.className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EmptyState title="No reviews yet" action={<button>Leave a review</button>} />,
    );
    await expectNoA11yViolations(container);
  });
});
