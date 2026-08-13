import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer, FooterColumn } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Molecules/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Playground: Story = {
  render: () => (
    <Footer>
      <FooterColumn title="About">
        <a href="#">Coworking</a>
        <a href="#">Events</a>
        <a href="#">Education</a>
        <a href="#">Street kitchen</a>
      </FooterColumn>
      <FooterColumn title="Collaboration">
        <a href="#">Partners</a>
        <a href="#">Initiatives</a>
        <a href="#">Blog</a>
      </FooterColumn>
      <FooterColumn title="Contacts">
        <span>Yerevan, 35G Tumanyan St</span>
        <a href="mailto:info@creativecommunity.space">info@creativecommunity.space</a>
        <a href="tel:+37494601303">+374 94 601 303</a>
      </FooterColumn>
    </Footer>
  ),
};

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7.5H16l.5-3H13.5V8.5c0-.9.2-1.5 1.6-1.5H16.5V4.3C16.2 4.3 15.2 4 14 4c-2.4 0-4 1.5-4 4.2V10.5H7.5v3H10V21h3.5Z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const WithSocialIcons: Story = {
  name: "— with a social icons row",
  render: () => (
    <Footer>
      <FooterColumn title="About">
        <a href="#">Coworking</a>
        <a href="#">Events</a>
      </FooterColumn>
      <FooterColumn title="Contacts">
        <span>Yerevan, 35G Tumanyan St</span>
        <a href="mailto:info@creativecommunity.space">info@creativecommunity.space</a>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <a href="#" aria-label="Facebook" style={{ color: "var(--c-text-2)" }}>
            <FacebookIcon />
          </a>
          <a href="#" aria-label="Instagram" style={{ color: "var(--c-text-2)" }}>
            <InstagramIcon />
          </a>
        </div>
      </FooterColumn>
    </Footer>
  ),
};

export const TwoColumnsMinimal: Story = {
  name: "— two columns, minimal",
  render: () => (
    <Footer>
      <FooterColumn title="Company">
        <a href="#">About</a>
        <a href="#">Careers</a>
      </FooterColumn>
      <FooterColumn title="Legal">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </FooterColumn>
    </Footer>
  ),
};

export const SingleColumnNoTitle: Story = {
  name: "— a single, untitled column",
  render: () => (
    <Footer>
      <FooterColumn>
        <span style={{ color: "var(--c-text-2)" }}>© 2026 LAN Coworking. All rights reserved.</span>
      </FooterColumn>
    </Footer>
  ),
};
