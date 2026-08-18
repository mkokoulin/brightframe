import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("marks the current page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Go to page 3" })).toHaveAttribute("aria-current", "page");
  });

  it("calls onChange with the clicked page", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);
    screen.getByRole("button", { name: "Go to page 3" }).click();
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("disables Previous on the first page and Next on the last page", () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("Next/Previous step the page by one", () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onChange={onChange} />);
    screen.getByRole("button", { name: "Next" }).click();
    expect(onChange).toHaveBeenCalledWith(4);

    screen.getByRole("button", { name: "Previous" }).click();
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("renders every page when the total is small enough", () => {
    render(<Pagination page={1} totalPages={4} onChange={vi.fn()} />);
    for (const n of [1, 2, 3, 4]) {
      expect(screen.getByRole("button", { name: `Go to page ${n}` })).toBeInTheDocument();
    }
  });

  it("collapses distant pages behind an ellipsis for large totals", () => {
    render(<Pagination page={1} totalPages={50} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 50" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Go to page 25" })).not.toBeInTheDocument();
  });

  it("does not call onChange when clicking the already-active page", () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onChange={onChange} />);
    screen.getByRole("button", { name: "Go to page 2" }).click();
    expect(onChange).not.toHaveBeenCalled();
  });
});
