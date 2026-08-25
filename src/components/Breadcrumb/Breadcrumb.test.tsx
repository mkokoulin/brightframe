import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

const ITEMS: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Locations", href: "/locations" },
  { label: "Yerevan" },
];

describe("Breadcrumb", () => {
  it("renders a nav landmark labeled Breadcrumb", () => {
    render(<Breadcrumb items={ITEMS} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders non-last items as links with href", () => {
    render(<Breadcrumb items={ITEMS} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
  });

  it("renders the last item as the current page, not a link", () => {
    render(<Breadcrumb items={ITEMS} />);
    const current = screen.getByText("Yerevan");
    expect(current.tagName).not.toBe("A");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("renders an item without href as a button and fires onClick", () => {
    const onClick = vi.fn();
    render(<Breadcrumb items={[{ label: "Filters", onClick }, { label: "Price" }]} />);
    screen.getByRole("button", { name: "Filters" }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a custom separator", () => {
    render(<Breadcrumb items={ITEMS} separator="/" />);
    expect(screen.getAllByText("/").length).toBe(ITEMS.length - 1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    await expectNoA11yViolations(container);
  });
});
