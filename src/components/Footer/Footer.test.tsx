import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Footer, FooterColumn } from "./Footer";

describe("Footer", () => {
  it("renders as a footer by default", () => {
    const { container } = render(<Footer />);
    expect(container.firstElementChild?.tagName).toBe("FOOTER");
  });

  it("renders as a different tag when as is given", () => {
    const { container } = render(<Footer as="div" />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("renders its children", () => {
    render(
      <Footer>
        <FooterColumn title="About">
          <a href="/coworking">Coworking</a>
        </FooterColumn>
      </Footer>,
    );
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Coworking" })).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    const { container } = render(<Footer className="custom" />);
    expect(container.firstElementChild?.className).toContain("custom");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Footer>
        <FooterColumn title="About">
          <a href="/coworking">Coworking</a>
        </FooterColumn>
      </Footer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("FooterColumn", () => {
  it("renders without a title", () => {
    render(
      <FooterColumn>
        <span>Contacts</span>
      </FooterColumn>,
    );
    expect(screen.getByText("Contacts")).toBeInTheDocument();
  });

  it("renders a title when given", () => {
    render(<FooterColumn title="Collaboration">content</FooterColumn>);
    expect(screen.getByText("Collaboration")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    const { container } = render(<FooterColumn title="About" className="custom" />);
    expect(container.firstElementChild?.className).toContain("custom");
  });
});
