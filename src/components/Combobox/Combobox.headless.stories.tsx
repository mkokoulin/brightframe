import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCombobox, type UseComboboxOption } from "./useCombobox";

const meta: Meta = {
  title: "Form/Combobox (headless)",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Same behavior as \`Combobox\` — open/close, filtering, keyboard nav, revert-on-Escape — with none of its styling. \`useCombobox\` owns the logic; you own the markup, via its prop getters.

\`\`\`tsx
import { useState } from "react";
import { useCombobox } from "brightframe/Combobox";

const [value, setValue] = useState("");
const combobox = useCombobox({ options, value, onChange: setValue });

<div ref={combobox.containerRef}>
  <input {...combobox.getInputProps()} />
  {combobox.open && (
    <ul {...combobox.getListProps()}>
      {combobox.filteredOptions.map((option, index) => (
        <li key={option.value} {...combobox.getOptionProps(option, index)}>
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const CITIES: UseComboboxOption[] = [
  { value: "yer", label: "Yerevan" },
  { value: "tbi", label: "Tbilisi" },
  { value: "ist", label: "Istanbul" },
  { value: "dxb", label: "Dubai" },
  { value: "lon", label: "London" },
  { value: "nyc", label: "New York" },
];

function UnstyledCombobox() {
  const [value, setValue] = useState("");
  const combobox = useCombobox({ options: CITIES, value, onChange: setValue });

  return (
    <div ref={combobox.containerRef} style={{ position: "relative", width: 240, fontFamily: "sans-serif" }}>
      <input
        {...combobox.getInputProps()}
        placeholder="Search a city…"
        style={{ width: "100%", boxSizing: "border-box", padding: 6 }}
      />
      {combobox.open && (
        <ul
          {...combobox.getListProps()}
          aria-label="City"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 4,
            border: "1px solid #ccc",
            position: "absolute",
            insetInlineStart: 0,
            insetBlockStart: "100%",
            width: "100%",
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          {combobox.filteredOptions.length === 0 ? (
            <li style={{ padding: 4, color: "#888" }}>Nothing found</li>
          ) : (
            combobox.filteredOptions.map((option, index) => (
              <li
                key={option.value}
                {...combobox.getOptionProps(option, index)}
                style={{
                  padding: 4,
                  cursor: "pointer",
                  background: index === combobox.focusedIndex ? "#eee" : "transparent",
                  fontWeight: option.value === value ? 700 : 400,
                }}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export const Default: Story = {
  render: () => <UnstyledCombobox />,
};
