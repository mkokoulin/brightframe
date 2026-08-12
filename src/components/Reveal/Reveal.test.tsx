import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Reveal } from "./Reveal";
import styles from "./Reveal.module.css";

type ObserverCallback = (entries: Pick<IntersectionObserverEntry, "isIntersecting">[]) => void;

function mockIntersectionObserver() {
  let capturedCallback: ObserverCallback | null = null;
  const observe = vi.fn();
  const disconnect = vi.fn();

  class FakeIntersectionObserver {
    constructor(callback: ObserverCallback) {
      capturedCallback = callback;
    }
    observe = observe;
    disconnect = disconnect;
    unobserve = vi.fn();
    takeRecords = () => [];
  }

  window.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;

  return {
    observe,
    disconnect,
    trigger: (isIntersecting: boolean) => capturedCallback?.([{ isIntersecting }]),
  };
}

function mockReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const originalIntersectionObserver = window.IntersectionObserver;
const originalMatchMedia = window.matchMedia;

afterEach(() => {
  window.IntersectionObserver = originalIntersectionObserver;
  window.matchMedia = originalMatchMedia;
});

describe("Reveal", () => {
  it("renders its children immediately", () => {
    mockReducedMotion(false);
    mockIntersectionObserver();
    render(<Reveal>Content</Reveal>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("is not visible until the element intersects the viewport", () => {
    mockReducedMotion(false);
    const { observe, trigger } = mockIntersectionObserver();
    render(<Reveal>Content</Reveal>);

    const el = screen.getByText("Content");
    expect(observe).toHaveBeenCalledWith(el);
    expect(el.className).not.toContain(styles.visible);

    act(() => trigger(true));
    expect(el.className).toContain(styles.visible);
  });

  it("disconnects the observer once revealed", () => {
    mockReducedMotion(false);
    const { disconnect, trigger } = mockIntersectionObserver();
    render(<Reveal>Content</Reveal>);

    act(() => trigger(true));
    expect(disconnect).toHaveBeenCalled();
  });

  it("is visible immediately when prefers-reduced-motion is set", () => {
    mockReducedMotion(true);
    mockIntersectionObserver();
    render(<Reveal>Content</Reveal>);
    expect(screen.getByText("Content").className).toContain(styles.visible);
  });

  it("applies a transitionDelay style when delay is given", () => {
    mockReducedMotion(true);
    mockIntersectionObserver();
    render(<Reveal delay={200}>Content</Reveal>);
    expect(screen.getByText("Content")).toHaveStyle({ transitionDelay: "200ms" });
  });
});
