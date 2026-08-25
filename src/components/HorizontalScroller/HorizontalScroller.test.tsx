import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { HorizontalScroller } from "./HorizontalScroller";

function mockOverflow(row: HTMLElement, { scrollLeft = 0, clientWidth = 300, scrollWidth = 900 } = {}) {
  Object.defineProperty(row, "scrollLeft", { value: scrollLeft, configurable: true });
  Object.defineProperty(row, "clientWidth", { value: clientWidth, configurable: true });
  Object.defineProperty(row, "scrollWidth", { value: scrollWidth, configurable: true });
}

describe("HorizontalScroller", () => {
  it("renders its children", () => {
    render(
      <HorizontalScroller>
        <div>Card 1</div>
        <div>Card 2</div>
      </HorizontalScroller>,
    );
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
  });

  it("hides both arrows when content does not overflow", () => {
    render(
      <HorizontalScroller>
        <div>Card 1</div>
      </HorizontalScroller>,
    );
    expect(screen.queryByRole("button", { name: "Scroll right" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Scroll left" })).not.toBeInTheDocument();
  });

  it("does not render arrows when arrows=false, even if content overflows", () => {
    const { container } = render(
      <HorizontalScroller arrows={false}>
        <div>Card 1</div>
      </HorizontalScroller>,
    );
    const row = container.querySelector("div > div") as HTMLElement;
    mockOverflow(row);
    fireEvent.scroll(row);
    expect(screen.queryByRole("button", { name: "Scroll right" })).not.toBeInTheDocument();
  });

  it("shows the next arrow once scrolled content is detected, and scrolls on click", async () => {
    const { container } = render(
      <HorizontalScroller>
        <div>Card 1</div>
        <div>Card 2</div>
      </HorizontalScroller>,
    );
    const row = container.querySelector("[class*='row']") as HTMLElement;
    mockOverflow(row, { scrollLeft: 0, clientWidth: 300, scrollWidth: 900 });
    fireEvent.scroll(row);

    const nextBtn = await screen.findByRole("button", { name: "Scroll right" });
    row.scrollBy = vi.fn();
    await userEvent.click(nextBtn);
    expect(row.scrollBy).toHaveBeenCalledWith({ left: 240, behavior: "smooth" });
  });

  it("shows the prev arrow once scrolled away from the start", () => {
    const { container } = render(
      <HorizontalScroller>
        <div>Card 1</div>
        <div>Card 2</div>
      </HorizontalScroller>,
    );
    const row = container.querySelector("[class*='row']") as HTMLElement;
    mockOverflow(row, { scrollLeft: 150, clientWidth: 300, scrollWidth: 900 });
    fireEvent.scroll(row);

    expect(screen.getByRole("button", { name: "Scroll left" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <HorizontalScroller>
        <div>Card 1</div>
        <div>Card 2</div>
      </HorizontalScroller>,
    );
    await expectNoA11yViolations(container);
  });
});
