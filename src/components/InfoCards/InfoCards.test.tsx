import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoCards, type InfoCardItem } from "./InfoCards";

const items: InfoCardItem[] = [
  {
    id: "1",
    icon: "building",
    title: "Meeting Rooms",
    description: "Cozy rooms for meetings.",
    href: "/coworking",
    linkText: "Learn more →",
  },
  {
    id: "2",
    icon: "map",
    title: "In the City Center",
    description: "Near the metro.",
  },
];

describe("InfoCards", () => {
  it("renders a card per item", () => {
    render(<InfoCards items={items} />);
    expect(screen.getByRole("heading", { name: "Meeting Rooms" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "In the City Center" })).toBeInTheDocument();
  });

  it("renders items with href as links, others as plain containers", () => {
    render(<InfoCards items={items} />);

    const link = screen.getByRole("link", { name: /Meeting Rooms/ });
    expect(link).toHaveAttribute("href", "/coworking");

    expect(screen.queryByRole("link", { name: /In the City Center/ })).not.toBeInTheDocument();
  });

  it("shows the mobile linkText only when provided", () => {
    render(<InfoCards items={items} />);
    expect(screen.getByText("Learn more →")).toBeInTheDocument();
  });

  it("falls back iconLabel to the title when not provided", () => {
    render(<InfoCards items={items} />);
    expect(screen.getAllByText("In the City Center")).toHaveLength(2); // heading + icon label
  });

  it("uses a custom iconLabel when provided", () => {
    render(
      <InfoCards
        items={[{ id: "3", icon: "wallet", title: "Flexible Plans", description: "...", iconLabel: "Plans" }]}
      />,
    );
    expect(screen.getByText("Plans")).toBeInTheDocument();
  });
});
