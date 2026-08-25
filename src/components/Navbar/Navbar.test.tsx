import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Navbar, NavbarItem } from "./Navbar";

describe("Navbar", () => {
  it("renders as a header by default", () => {
    const { container } = render(<Navbar />);
    expect(container.firstElementChild?.tagName).toBe("HEADER");
  });

  it("renders as a different tag when as is given", () => {
    const { container } = render(<Navbar as="div" />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders the brand slot", () => {
    render(<Navbar brand={<span>Brand</span>} />);
    expect(screen.getByText("Brand")).toBeInTheDocument();
  });

  it("renders the actions slot", () => {
    render(<Navbar actions={<button>Toggle</button>} />);
    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });

  it("wraps children in a nav landmark", () => {
    render(
      <Navbar>
        <NavbarItem href="/">Home</NavbarItem>
      </Navbar>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("omits the nav landmark when there are no children", () => {
    render(<Navbar brand={<span>Brand</span>} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("merges a custom className", () => {
    const { container } = render(<Navbar className="custom" />);
    expect(container.firstElementChild?.className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Navbar>
        <NavbarItem href="/">Home</NavbarItem>
      </Navbar>,
    );
    await expectNoA11yViolations(container);
  });
});

describe("NavbarItem", () => {
  it("renders as an anchor by default", () => {
    render(<NavbarItem href="/coworking">Coworking</NavbarItem>);
    const link = screen.getByRole("link", { name: "Coworking" });
    expect(link).toHaveAttribute("href", "/coworking");
  });

  it("marks the active item with aria-current", () => {
    render(
      <NavbarItem href="/" active>
        Home
      </NavbarItem>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current when inactive", () => {
    render(<NavbarItem href="/">Home</NavbarItem>);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("renders an icon when given", () => {
    render(
      <NavbarItem href="/" icon={<svg data-testid="icon" />}>
        Home
      </NavbarItem>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders as a different tag when as is given", () => {
    render(<NavbarItem as="button">Home</NavbarItem>);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });
});
