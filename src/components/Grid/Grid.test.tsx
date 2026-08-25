import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test-utils/a11y";
import { Grid, GridItem } from "./Grid";

describe("Grid", () => {
  it("renders its children", () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders as a div by default", () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText("Content").tagName).toBe("DIV");
  });

  it("renders as a different tag when as is given", () => {
    render(<Grid as="section">Content</Grid>);
    expect(screen.getByText("Content").tagName).toBe("SECTION");
  });

  it("merges a custom className", () => {
    render(<Grid className="custom">Content</Grid>);
    expect(screen.getByText("Content").className).toContain("custom");
  });

  it("defaults to 12 columns when columns is not given", () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText("Content").style.getPropertyValue("--grid-cols-base")).toBe("12");
  });

  it("does not emit a gap custom property when gap is not given", () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText("Content").style.getPropertyValue("--grid-gap-base")).toBe("");
  });

  it("sets a single column count as a CSS custom property", () => {
    render(<Grid columns={4}>Content</Grid>);
    expect(screen.getByText("Content").style.getPropertyValue("--grid-cols-base")).toBe("4");
  });

  it("sets per-breakpoint column counts as CSS custom properties", () => {
    render(<Grid columns={{ base: 1, md: 2, lg: 4 }}>Content</Grid>);
    const el = screen.getByText("Content");
    expect(el.style.getPropertyValue("--grid-cols-base")).toBe("1");
    expect(el.style.getPropertyValue("--grid-cols-md")).toBe("2");
    expect(el.style.getPropertyValue("--grid-cols-lg")).toBe("4");
    expect(el.style.getPropertyValue("--grid-cols-sm")).toBe("");
  });

  it("formats a numeric gap as pixels", () => {
    render(<Grid gap={24}>Content</Grid>);
    expect(screen.getByText("Content").style.getPropertyValue("--grid-gap-base")).toBe("24px");
  });

  it("passes a string gap through unchanged", () => {
    render(<Grid gap="1.5rem">Content</Grid>);
    expect(screen.getByText("Content").style.getPropertyValue("--grid-gap-base")).toBe("1.5rem");
  });

  it("preserves a caller-supplied style alongside generated custom properties", () => {
    render(
      <Grid columns={3} style={{ background: "red" }}>
        Content
      </Grid>,
    );
    const el = screen.getByText("Content");
    expect(el.style.background).toBe("red");
    expect(el.style.getPropertyValue("--grid-cols-base")).toBe("3");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Grid columns={3} style={{ background: "red" }}>
        Content
      </Grid>,
    );
    await expectNoA11yViolations(container);
  });
});

describe("GridItem", () => {
  it("renders its children", () => {
    render(<GridItem>Cell</GridItem>);
    expect(screen.getByText("Cell")).toBeInTheDocument();
  });

  it("renders as a different tag when as is given", () => {
    render(<GridItem as="li">Cell</GridItem>);
    expect(screen.getByText("Cell").tagName).toBe("LI");
  });

  it("sets a single span as a CSS custom property", () => {
    render(<GridItem span={2}>Cell</GridItem>);
    expect(screen.getByText("Cell").style.getPropertyValue("--item-span-base")).toBe("2");
  });

  it("sets per-breakpoint spans as CSS custom properties", () => {
    render(<GridItem span={{ base: 4, lg: 2 }}>Cell</GridItem>);
    const el = screen.getByText("Cell");
    expect(el.style.getPropertyValue("--item-span-base")).toBe("4");
    expect(el.style.getPropertyValue("--item-span-lg")).toBe("2");
  });

  it("merges a custom className", () => {
    render(<GridItem className="custom">Cell</GridItem>);
    expect(screen.getByText("Cell").className).toContain("custom");
  });
});

describe("Grid composed with GridItem", () => {
  it("renders a Grid with multiple GridItem children in DOM order", () => {
    render(
      <Grid columns={{ base: 1, md: 3 }} gap={16} data-testid="grid">
        <GridItem span={{ base: 1, md: 2 }}>First</GridItem>
        <GridItem>Second</GridItem>
      </Grid>,
    );

    const grid = screen.getByTestId("grid");
    expect(grid.children).toHaveLength(2);
    expect(grid.children[0]).toHaveTextContent("First");
    expect(grid.children[1]).toHaveTextContent("Second");
    expect(grid.style.getPropertyValue("--grid-cols-md")).toBe("3");
    expect((grid.children[0] as HTMLElement).style.getPropertyValue("--item-span-md")).toBe("2");
  });
});
