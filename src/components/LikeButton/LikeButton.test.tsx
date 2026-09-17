import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { LikeButton } from "./LikeButton";

describe("LikeButton", () => {
  it("renders the count", () => {
    render(<LikeButton liked={false} count={5} onToggle={vi.fn()} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("reflects the liked prop via aria-pressed and label", () => {
    render(<LikeButton liked count={5} onToggle={vi.fn()} likeLabel="Like" unlikeLabel="Unlike" />);
    const btn = screen.getByRole("button", { name: "Unlike" });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onToggle on click", () => {
    const onToggle = vi.fn();
    render(<LikeButton liked={false} count={5} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("stops the click from bubbling to a parent handler", () => {
    const onToggle = vi.fn();
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <LikeButton liked={false} count={0} onToggle={onToggle} />
      </div>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("does not call onToggle when disabled", () => {
    const onToggle = vi.fn();
    render(<LikeButton liked={false} count={0} onToggle={onToggle} disabled />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<LikeButton liked count={5} onToggle={vi.fn()} />);
    await expectNoA11yViolations(container);
  });
});
