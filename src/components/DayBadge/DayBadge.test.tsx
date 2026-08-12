import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DayBadge } from "./DayBadge";
import styles from "./DayBadge.module.css";

// Constructed via the local-time Date constructor (not an ISO string) so the
// weekday doesn't shift depending on the test runner's timezone.
const MONDAY = new Date(2025, 4, 12); // 2025-05-12
const SUNDAY = new Date(2025, 4, 11); // 2025-05-11

describe("DayBadge", () => {
  it("renders the day number and does not mark a weekday as a weekend", () => {
    const { container } = render(<DayBadge date={MONDAY} />);
    expect(container.querySelector(`.${styles.day}`)).toHaveTextContent("12");
    expect(container.querySelector(`.${styles.weekend}`)).not.toBeInTheDocument();
  });

  it("marks Saturday/Sunday with the weekend class", () => {
    const { container } = render(<DayBadge date={SUNDAY} />);
    expect(container.querySelector(`.${styles.day}`)).toHaveTextContent("11");
    expect(container.querySelector(`.${styles.weekend}`)).toBeInTheDocument();
  });

  it("formats weekday/month using ru-RU by default", () => {
    const { container } = render(<DayBadge date={MONDAY} />);
    expect(container.querySelector(`.${styles.weekday}`)).toHaveTextContent("пн");
    expect(container.querySelector(`.${styles.month}`)).toHaveTextContent("МАЙ");
  });

  it("respects a custom locale", () => {
    const { container } = render(<DayBadge date={MONDAY} locale="en-US" />);
    expect(container.querySelector(`.${styles.weekday}`)).toHaveTextContent("Mon");
    expect(container.querySelector(`.${styles.month}`)).toHaveTextContent("MAY");
  });

  it("applies the compact size class when requested", () => {
    const { container } = render(<DayBadge date={MONDAY} size="compact" />);
    expect(container.querySelector(`.${styles.compact}`)).toBeInTheDocument();
  });

  it("does not apply the compact class by default", () => {
    const { container } = render(<DayBadge date={MONDAY} />);
    expect(container.querySelector(`.${styles.compact}`)).not.toBeInTheDocument();
  });

  it("forwards rest props to the root element", () => {
    const { getByTestId } = render(<DayBadge date={MONDAY} data-testid="badge" />);
    expect(getByTestId("badge")).toBeInTheDocument();
  });
});
