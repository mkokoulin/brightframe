import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
  it("renders as a submit-type button with its children", () => {
    render(<SubmitButton>Send</SubmitButton>);
    const btn = screen.getByRole("button", { name: "Send" });
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("is enabled by default", () => {
    render(<SubmitButton>Send</SubmitButton>);
    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("is disabled when the disabled prop is true", () => {
    render(<SubmitButton disabled>Send</SubmitButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
