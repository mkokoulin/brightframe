import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import * as Kit from "../dist/haloui.js";

const expected = [
  "Btn", "Card", "Tag", "InfoTooltip", "GhostButton", "Eyebrow",
  "SectionHeading", "DayBadge", "Reveal", "InfoCards", "Loader",
  "Burger", "Link", "Title", "SubTitle", "Container", "PinIcon", "QuestionIcon",
  "ThemeProvider", "useTheme", "getThemeInitScript",
];

const missing = expected.filter((name) => !(name in Kit));
if (missing.length) {
  console.error("Missing exports:", missing);
  process.exit(1);
}

const html = renderToStaticMarkup(
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Kit.Btn, { variant: "primary" }, "Click me"),
    React.createElement(Kit.Card, { hover: true }, "Card body"),
    React.createElement(Kit.Tag, { variant: "accent" }, "New"),
    React.createElement(Kit.Title, null, "Hello"),
    React.createElement(Kit.DayBadge, { date: new Date("2026-08-12") }),
    React.createElement(Kit.ThemeProvider, null, React.createElement("span", null, "themed")),
  ),
);

if (typeof Kit.getThemeInitScript() !== "string") {
  console.error("getThemeInitScript() did not return a string");
  process.exit(1);
}

if (!html.includes("Click me") || !html.includes("Card body") || !html.includes("Hello")) {
  console.error("Rendered output missing expected content:", html);
  process.exit(1);
}

console.log("OK — all exports present and components render.");
console.log(html);
