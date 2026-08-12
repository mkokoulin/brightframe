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
});
