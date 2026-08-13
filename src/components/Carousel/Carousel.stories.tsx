import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Molecules/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

function Slide({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 260,
        background: "var(--c-brand-soft)",
        color: "var(--c-brand)",
        fontFamily: "var(--font-sans)",
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

export const ArrowsOnly: Story = {
  name: "— arrows only (hero-style)",
  render: () => (
    <Carousel>
      <Slide label="Slide 1" />
      <Slide label="Slide 2" />
      <Slide label="Slide 3" />
    </Carousel>
  ),
};

export const DotsOnly: Story = {
  name: "— dots only (banner-style)",
  render: () => (
    <Carousel arrows={false} dots>
      <Slide label="Slide 1" />
      <Slide label="Slide 2" />
      <Slide label="Slide 3" />
      <Slide label="Slide 4" />
    </Carousel>
  ),
};

export const ArrowsAndDots: Story = {
  name: "— arrows and dots",
  render: () => (
    <Carousel dots>
      <Slide label="Slide 1" />
      <Slide label="Slide 2" />
      <Slide label="Slide 3" />
    </Carousel>
  ),
};

export const Autoplay: Story = {
  name: "— autoplay (pauses on hover/focus)",
  render: () => (
    <Carousel dots autoplayInterval={2500}>
      <Slide label="Slide 1" />
      <Slide label="Slide 2" />
      <Slide label="Slide 3" />
    </Carousel>
  ),
};

export const SingleSlide: Story = {
  name: "— a single slide (arrows/dots auto-hide)",
  render: () => (
    <Carousel dots>
      <Slide label="Only slide" />
    </Carousel>
  ),
};

export const Controlled: Story = {
  name: "— controlled from outside (external thumbnail nav)",
  render: () => {
    function Wrapper() {
      const [index, setIndex] = useState(0);
      return (
        <div>
          <Carousel index={index} onIndexChange={setIndex} dots={false}>
            <Slide label="Slide 1" />
            <Slide label="Slide 2" />
            <Slide label="Slide 3" />
          </Carousel>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--c-border)",
                  background: i === index ? "var(--c-brand)" : "var(--c-surface)",
                  color: i === index ? "#fff" : "var(--c-text-1)",
                  cursor: "pointer",
                }}
              >
                Slide {i + 1}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return <Wrapper />;
  },
};

function PhotoPlaceholder({ label, gradient }: { label: string; gradient: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: 260,
        background: gradient,
        display: "flex",
        alignItems: "flex-end",
        padding: 16,
        boxSizing: "border-box",
        color: "#fff",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}
    >
      {label}
    </div>
  );
}

export const InAConstrainedCard: Story = {
  name: "— sized to a constrained card (hero-style)",
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Carousel dots>
        <PhotoPlaceholder label="Coworking on Tumanyan" gradient="linear-gradient(135deg, #1d5086, #4d97e0)" />
        <PhotoPlaceholder label="Private garden" gradient="linear-gradient(135deg, #2f9e63, #7fd99a)" />
      </Carousel>
    </div>
  ),
};
