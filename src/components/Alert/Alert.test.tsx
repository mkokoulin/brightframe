import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders title and description", () => {
    render(
      <Alert variant="info" title="Heads up">
        Check-in opens at 3 PM.
      </Alert>,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Check-in opens at 3 PM.")).toBeInTheDocument();
  });

  it("uses role=status for info/success", () => {
    render(<Alert variant="success">Saved</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses role=alert for warning/error", () => {
    render(<Alert variant="error">Something broke</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders a close button and fires onDismiss", () => {
    const onDismiss = vi.fn();
    render(
      <Alert variant="info" onDismiss={onDismiss}>
        Dismissible
      </Alert>,
    );
    screen.getByRole("button", { name: "Dismiss" }).click();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not render a close button when onDismiss is omitted", () => {
    render(<Alert variant="info">Not dismissible</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the icon when icon={null}", () => {
    const { container } = render(
      <Alert variant="info" icon={null}>
        No icon
      </Alert>,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a custom icon", () => {
    render(
      <Alert variant="info" icon={<span data-testid="custom-icon" />}>
        Custom
      </Alert>,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Alert variant="info" title="Heads up">
        Check-in opens at 3 PM.
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
