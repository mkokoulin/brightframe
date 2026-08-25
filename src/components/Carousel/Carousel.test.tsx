import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Carousel } from "./Carousel";

function Slides({ count = 3 }: { count?: number }) {
  return Array.from({ length: count }, (_, i) => <div key={i}>Slide {i + 1}</div>);
}

describe("Carousel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all slides in the DOM", () => {
    render(<Carousel>{Slides({ count: 3 })}</Carousel>);
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
  });

  it("marks only the active slide as not aria-hidden", () => {
    render(<Carousel>{Slides({ count: 3 })}</Carousel>);
    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[0]).toHaveAttribute("aria-hidden", "false");
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");
  });

  it("advances to the next slide when the next arrow is clicked", async () => {
    render(<Carousel>{Slides({ count: 3 })}</Carousel>);
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[1]).toHaveAttribute("aria-hidden", "false");
  });

  it("wraps from the last slide to the first", async () => {
    render(<Carousel>{Slides({ count: 3 })}</Carousel>);
    await userEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[2]).toHaveAttribute("aria-hidden", "false");
  });

  it("hides arrows when there is only one slide", () => {
    render(<Carousel>{Slides({ count: 1 })}</Carousel>);
    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
  });

  it("does not render arrows when arrows=false", () => {
    render(<Carousel arrows={false}>{Slides({ count: 3 })}</Carousel>);
    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
  });

  it("renders dots when dots=true and navigates on click", async () => {
    render(<Carousel dots>{Slides({ count: 3 })}</Carousel>);
    const dot3 = screen.getByRole("button", { name: "Go to slide 3" });
    await userEvent.click(dot3);
    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[2]).toHaveAttribute("aria-hidden", "false");
  });

  it("renders a current/total counter pill when counter=true", async () => {
    render(<Carousel counter>{Slides({ count: 3 })}</Carousel>);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("does not render the counter by default", () => {
    render(<Carousel>{Slides({ count: 3 })}</Carousel>);
    expect(screen.queryByText("1 / 3")).not.toBeInTheDocument();
  });

  it("calls onIndexChange with the new index", async () => {
    const onIndexChange = vi.fn();
    render(
      <Carousel onIndexChange={onIndexChange}>{Slides({ count: 3 })}</Carousel>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("respects a controlled index prop", () => {
    render(
      <Carousel index={2}>{Slides({ count: 3 })}</Carousel>,
    );
    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[2]).toHaveAttribute("aria-hidden", "false");
  });

  it("auto-advances on the given interval", () => {
    vi.useFakeTimers();
    render(<Carousel autoplayInterval={1000}>{Slides({ count: 3 })}</Carousel>);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const groups = screen.getAllByRole("group", { hidden: true });
    expect(groups[1]).toHaveAttribute("aria-hidden", "false");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Carousel dots>{Slides({ count: 3 })}</Carousel>);
    await expectNoA11yViolations(container);
  });
});
