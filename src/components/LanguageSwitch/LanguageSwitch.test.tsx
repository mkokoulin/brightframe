import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { LanguageSwitch } from "./LanguageSwitch";

describe("LanguageSwitch", () => {
  it("renders the default RU/EN/HY options", () => {
    render(<LanguageSwitch value="en" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "RU" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "HY" })).toBeInTheDocument();
  });

  it("marks the active option as pressed", () => {
    render(<LanguageSwitch value="en" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "RU" })).toHaveAttribute("aria-pressed", "false");
  });

  it("fires onChange with the clicked option's code", () => {
    const onChange = vi.fn();
    render(<LanguageSwitch value="en" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "HY" }));
    expect(onChange).toHaveBeenCalledWith("hy");
  });

  it("supports custom options", () => {
    render(
      <LanguageSwitch
        value="fr"
        onChange={() => {}}
        options={[
          { code: "fr", label: "FR" },
          { code: "de", label: "DE" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "FR" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "RU" })).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<LanguageSwitch value="en" onChange={() => {}} />);
    await expectNoA11yViolations(container);
  });
});
