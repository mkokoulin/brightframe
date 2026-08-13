import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar, NavbarItem } from "./Navbar";
import { Burger } from "../Burger";

const meta: Meta<typeof Navbar> = {
  title: "Molecules/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CoworkingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="7" width="18" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 11v9M19 11v9M9 20v-5M15 20v-5" strokeLinecap="round" />
  </svg>
);
const EventsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
  </svg>
);

export const Playground: Story = {
  render: () => {
    function Wrapper() {
      const [active, setActive] = useState("home");
      return (
        <Navbar brand={<strong style={{ fontFamily: "var(--font-sans)" }}>LAN</strong>}>
          <NavbarItem href="#" icon={<HomeIcon />} active={active === "home"} onClick={() => setActive("home")}>
            Home
          </NavbarItem>
          <NavbarItem
            href="#"
            icon={<CoworkingIcon />}
            active={active === "coworking"}
            onClick={() => setActive("coworking")}
          >
            Coworking
          </NavbarItem>
          <NavbarItem href="#" icon={<EventsIcon />} active={active === "events"} onClick={() => setActive("events")}>
            Events
          </NavbarItem>
        </Navbar>
      );
    }
    return <Wrapper />;
  },
};

export const WithActionsAndBurger: Story = {
  name: "— with actions slot + mobile Burger",
  render: () => {
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <Navbar
          brand={<strong style={{ fontFamily: "var(--font-sans)" }}>LAN</strong>}
          actions={
            <>
              <span style={{ fontSize: 13, color: "var(--c-text-2)" }}>EN</span>
              <Burger open={open} setOpen={setOpen} />
            </>
          }
        >
          <NavbarItem href="#" icon={<HomeIcon />} active>
            Home
          </NavbarItem>
          <NavbarItem href="#" icon={<CoworkingIcon />}>
            Coworking
          </NavbarItem>
        </Navbar>
      );
    }
    return <Wrapper />;
  },
};

export const BrandOnly: Story = {
  name: "— brand only (no nav items, no actions)",
  render: () => <Navbar brand={<strong style={{ fontFamily: "var(--font-sans)" }}>LAN</strong>} />,
};

export const NoItemsWithoutIcons: Story = {
  name: "— text-only nav items (icon is optional)",
  render: () => (
    <Navbar brand={<strong style={{ fontFamily: "var(--font-sans)" }}>LAN</strong>}>
      <NavbarItem href="#" active>
        Home
      </NavbarItem>
      <NavbarItem href="#">Coworking</NavbarItem>
      <NavbarItem href="#">Events</NavbarItem>
      <NavbarItem href="#">Blog</NavbarItem>
    </Navbar>
  ),
};

export const FullExample: Story = {
  name: "— close to the real site header (logo + nav + a11y/theme/language)",
  render: () => {
    function Wrapper() {
      const [active, setActive] = useState("home");
      const [open, setOpen] = useState(false);
      return (
        <Navbar
          brand={
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)" }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--c-brand-soft)",
                  display: "inline-block",
                }}
              />
              <strong>Letters and Numbers</strong>
            </span>
          }
          actions={
            <>
              <button
                type="button"
                style={{
                  border: "1px solid var(--c-border)",
                  borderRadius: 8,
                  background: "transparent",
                  padding: "6px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                  color: "var(--c-text-2)",
                }}
              >
                A+A
              </button>
              <span style={{ fontSize: 13, color: "var(--c-text-2)" }}>EN</span>
              <Burger open={open} setOpen={setOpen} />
            </>
          }
        >
          {[
            { key: "home", icon: <HomeIcon />, label: "Home" },
            { key: "coworking", icon: <CoworkingIcon />, label: "Coworking" },
            { key: "events", icon: <EventsIcon />, label: "Events" },
          ].map((item) => (
            <NavbarItem
              key={item.key}
              href="#"
              icon={item.icon}
              active={active === item.key}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </NavbarItem>
          ))}
        </Navbar>
      );
    }
    return <Wrapper />;
  },
};
