# haloui — basic Vite example

A minimal Vite + React app consuming `haloui` as a real npm dependency (via `"haloui": "file:../.."`, pointing at the package root), demonstrating:

- `<ThemeProvider>` / `useTheme()` — light/dark/system theme switching + the high-contrast a11y mode
- Importing `haloui/tokens.css` and `haloui/style.css`
- A handful of components together on one page: `Btn`, `Card`, `Tag`, `InfoTooltip`, `InfoCards`, `DayBadge`, `GhostButton`, `Link`, `Loader`, `Burger`, `Container`, `Title`/`SubTitle`/`Eyebrow`/`SectionHeading`

## Run it

From the package root, build `haloui` first (the example imports its compiled `dist/`, not `src/`):

```bash
cd ../..
npm run build
cd examples/basic-vite
npm install
npm run dev
```

Open the printed `localhost` URL and use the theme buttons in the header to switch between light, dark, system, and the high-contrast a11y mode.

If you change something in the package's `src/`, re-run `npm run build` at the package root and restart `npm run dev` here — this example depends on the built `dist/`, mirroring how a real consumer would install the package from npm.
