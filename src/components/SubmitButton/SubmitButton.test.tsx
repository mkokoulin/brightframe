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

  it("defaults to the accent variant and fullWidth", () => {
    render(<SubmitButton>Send</SubmitButton>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("accent");
    expect(btn.className).toContain("fullWidth");
  });

  it("applies the requested variant", () => {
    render(<SubmitButton variant="ghost">Send</SubmitButton>);
    expect(screen.getByRole("button").className).toContain("ghost");
  });

  it("omits the fullWidth class when fullWidth=false", () => {
    render(<SubmitButton fullWidth={false}>Send</SubmitButton>);
    expect(screen.getByRole("button").className).not.toContain("fullWidth");
  });
});
