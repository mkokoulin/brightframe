import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../components/Card";
import { Tag } from "../components/Tag";
import { Btn } from "../components/Btn";

const GOOGLE_FONTS_HREF = "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap";

function FontDemo() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_HREF;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [loaded]);

  return (
    <Card variant="elevated" radius="lg" style={{ padding: 24, width: 440, display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Tag variant={loaded ? "accent" : "neutral"}>{loaded ? "brightframe/fonts.css imported" : "fonts.css not imported"}</Tag>
      </div>

      <p style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, margin: 0 }}>
        The quick brown fox jumps over the lazy dog.
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--c-text-2)", margin: 0 }}>
        This text always uses <code>var(--font-sans)</code>. Without loading PT Sans, the browser falls back to
        Helvetica Neue / Arial / your system sans-serif — close, but not PT Sans.
      </p>

      <Btn size="sm" variant={loaded ? "secondary" : "primary"} onClick={() => setLoaded((v) => !v)}>
        {loaded ? "Unload PT Sans" : "Load PT Sans (like brightframe/fonts.css)"}
      </Btn>
    </Card>
  );
}

const meta: Meta = {
  title: "Foundations/Fonts",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Every brightframe component reads its font from a single \`--font-sans\` custom property, defined in \`tokens.css\`:

\`\`\`css
--font-sans: "PT Sans", "Helvetica Neue", Arial, sans-serif;
\`\`\`

**Naming a font isn't the same as loading it.** \`tokens.css\` only tells the browser what to prefer — it renders PT Sans only if a PT Sans font is actually available on the page. That's what \`brightframe/fonts.css\` is for: an optional module that loads PT Sans from Google Fonts.

\`\`\`tsx
import "brightframe/tokens.css";
import "brightframe/fonts.css"; // optional — loads PT Sans
import "brightframe/style.css";
\`\`\`

**Don't want PT Sans, or want to self-host it?** Skip \`brightframe/fonts.css\` and override \`--font-sans\` in your own CSS instead:

\`\`\`css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
}
\`\`\`

Toggle the button below to see the visual difference \`fonts.css\` makes (loads the real Google Fonts stylesheet).
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <FontDemo />,
};
