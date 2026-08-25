import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { ActionCard } from "./ActionCard";

describe("ActionCard", () => {
  it("renders a div by default", () => {
    render(<ActionCard title="Room rental" />);
    expect(screen.getByText("Room rental").closest("div, a")?.tagName).toBe("DIV");
  });

  it("renders as an anchor when href is given", () => {
    render(<ActionCard title="Room rental" href="/rooms" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/rooms");
  });

  it("renders the title", () => {
    render(<ActionCard title="Room rental" />);
    expect(screen.getByText("Room rental")).toBeInTheDocument();
  });

  it("renders a description when given", () => {
    render(<ActionCard title="Room rental" description="Fully equipped spaces" />);
    expect(screen.getByText("Fully equipped spaces")).toBeInTheDocument();
  });

  it("renders an icon when given", () => {
    render(<ActionCard title="Room rental" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("forwards rest props such as data attributes", () => {
    render(<ActionCard title="Room rental" data-testid="card" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<ActionCard title="Room rental" className="custom" data-testid="card" />);
    expect(screen.getByTestId("card").className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ActionCard title="Room rental" href="/rooms" />);
    await expectNoA11yViolations(container);
  });
});
