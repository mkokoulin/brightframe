import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Avatar } from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

const NAMES = ["Aram Petrosyan", "Irina Sokolova", "David Hovhannisyan", "Maria Klimenko", "Anna Sargsyan"];

describe("AvatarGroup", () => {
  it("renders all children when there's no max", () => {
    render(
      <AvatarGroup>
        {NAMES.slice(0, 2).map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByText("AP")).toBeInTheDocument();
    expect(screen.getByText("IS")).toBeInTheDocument();
  });

  it("caps visible avatars at max and shows a +N overflow avatar", () => {
    render(
      <AvatarGroup max={3}>
        {NAMES.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getByText("AP")).toBeInTheDocument();
    expect(screen.getByText("IS")).toBeInTheDocument();
    expect(screen.getByText("DH")).toBeInTheDocument();
    expect(screen.queryByText("MK")).not.toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders no overflow avatar when the member count is under max", () => {
    render(
      <AvatarGroup max={5}>
        {NAMES.slice(0, 2).map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AvatarGroup max={2}>
        {NAMES.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    await expectNoA11yViolations(container);
  });
});
