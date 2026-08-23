import { addons } from "storybook/manager-api";

// The Overview/UI Kit page (opens by default — see preview.tsx's storySort) is
// meant to be viewed as a full page, not paired with the Controls/Actions/
// Accessibility addons panel, so keep the panel closed there. Every other story
// keeps Storybook's normal default.
addons.setConfig({
  layoutCustomisations: {
    showPanel: (state, defaultValue) => {
      if (state.storyId === "overview-ui-kit--default") return false;
      return defaultValue;
    },
  },
});
