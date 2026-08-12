# Publishing a release

This document describes how to ship a new version of `brightframe` to the npm registry.

## One-time setup

1. Create an npm account at [npmjs.com](https://www.npmjs.com/signup) if you don't have one.
2. Log in from the CLI:

   ```bash
   npm login
   ```

   This opens a browser to authenticate and stores a token locally (`~/.npmrc`). Run `npm whoami` afterwards to confirm you're logged in as the right user.
3. If your npm account has two-factor authentication enabled (recommended), `npm publish` will prompt for a one-time code from your authenticator app.
4. The package name `brightframe` is unscoped and was unclaimed as of package creation — the first successful `npm publish` claims it permanently under your account. `publishConfig.access: "public"` is already set in `package.json`, though it's only strictly required for scoped (`@scope/name`) packages; it's harmless to leave for an unscoped one.

## Pre-publish checklist

Run these from the repo root (`D:/dev/lan/haloui`) before every release:

```bash
bun install          # or npm install — make sure the lockfile is in sync
bun run typecheck    # tsc --noEmit
bun run test          # vitest, jsdom
bun run build         # vite build + copy-tokens.mjs -> dist/
node scripts/sanity-check.mjs   # imports dist/brightframe.js and renders components
```

All of these must pass cleanly. `npm publish` only ships what's listed in `"files": ["dist"]` in `package.json` (plus `package.json`, `README.md`, `LICENSE`, which npm includes automatically) — nothing under `src/` or `.storybook/` is published.

Also worth doing before a release with visual changes:

```bash
bun run storybook    # eyeball the affected components at localhost:6006
```

## Bumping the version

`brightframe` follows [semver](https://semver.org/):

- **patch** (`0.1.0` → `0.1.1`) — bug fixes, no API changes.
- **minor** (`0.1.0` → `0.2.0`) — new components or props, backwards-compatible.
- **major** (`0.1.0` → `1.0.0`) — breaking changes (removed/renamed exports, changed prop shapes, removed CSS variables).

Use `npm version` to bump `package.json`, create a commit, and tag it in one step (requires a clean git working tree):

```bash
npm version patch   # or: minor / major / 1.2.3
```

This creates a commit ("0.1.1") and a git tag (`v0.1.1`). If you're not committing to git yet, you can instead hand-edit the `"version"` field in `package.json`.

## Publishing

```bash
npm run build          # prepublishOnly already runs this automatically, but it's
                        # good practice to verify a clean build right before publishing
npm publish --access public
```

`npm publish`:
1. Runs `prepublishOnly` (→ `npm run build`) automatically.
2. Packs only `dist/` + `package.json` + `README.md` + `LICENSE` into the tarball — run `npm pack --dry-run` first if you want to inspect exactly what would be uploaded.
3. Uploads to the registry and prompts for an OTP if 2FA is enabled.

## After publishing

1. Push the version commit and tag if you used `npm version`:

   ```bash
   git push && git push --tags
   ```

2. Verify the package page: `https://www.npmjs.com/package/brightframe`.
3. Smoke-test the published tarball in a scratch project:

   ```bash
   mkdir /tmp/brightframe-smoke && cd /tmp/brightframe-smoke
   npm init -y
   npm install brightframe react react-dom
   node -e "console.log(Object.keys(require('brightframe')))"
   ```

## Publishing a pre-release

For a version you want on npm without it being picked up by consumers on `^`/`~` ranges (e.g. an alpha for testing):

```bash
npm version 0.2.0-alpha.0
npm publish --tag next
```

`--tag next` keeps it off the `latest` dist-tag, so `npm install brightframe` still resolves to the last stable release. Consumers opt in explicitly with `npm install brightframe@next`.

## Fixing a bad publish

- **Within 72 hours of publishing**: `npm unpublish brightframe@<version>` removes that version entirely. npm blocks unpublishing versions older than 72 hours except in narrow cases (security, legal) — don't rely on this as a normal workflow.
- **Preferred fix, any time**: ship a new patch version with the fix. Optionally mark the bad one so people don't install it: `npm deprecate brightframe@<version> "reason, use >=<fixed-version> instead"`.

## CI (not yet set up)

There's currently no CI pipeline publishing automatically. Every release above is manual. If this repo grows a GitHub Actions workflow later, prefer [npm's trusted publishing / provenance](https://docs.npmjs.com/generating-provenance-statements) over storing a long-lived `NPM_TOKEN` secret.
