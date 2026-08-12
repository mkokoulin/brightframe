import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Loader } from "./Loader";
import styles from "./Loader.module.css";

describe("Loader", () => {
  it("renders an svg circle with the default accent color", () => {
    const { container } = render(<Loader />);
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("stroke", "var(--c-accent)");
  });

  it("respects a custom color", () => {
    const { container } = render(<Loader color="#1a1a1a" />);
    expect(container.querySelector("circle")).toHaveAttribute("stroke", "#1a1a1a");
  });

  it("applies the dim overlay background by default", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector(`.${styles.rootBg}`)).toBeInTheDocument();
  });

  it("omits the overlay background when overlay is false", () => {
    const { container } = render(<Loader overlay={false} />);
    expect(container.querySelector(`.${styles.rootBg}`)).not.toBeInTheDocument();
  });

  it("defaults to a 60px (md) svg", () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "60");
    expect(svg).toHaveAttribute("height", "60");
  });

  it("resizes the svg for sm/lg", () => {
    const { container: sm } = render(<Loader size="sm" />);
    expect(sm.querySelector("svg")).toHaveAttribute("width", "32");

    const { container: lg } = render(<Loader size="lg" />);
    expect(lg.querySelector("svg")).toHaveAttribute("width", "96");
  });

  it("forwards rest props to the root element", () => {
    const { getByTestId } = render(<Loader data-testid="loader" />);
    expect(getByTestId("loader")).toBeInTheDocument();
  });
});
