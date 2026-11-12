// Single source of truth for every toggle in Calmer YT.
//
// Loaded by both the content script (on YouTube) and the popup.
// To add a feature:
//   1. Add an entry here.
//   2. Add CSS rules gated by `html.<cssClass>` in a file under css/.
//   3. Make sure that CSS file is listed in manifest.json.
// The popup renders itself from this list, so nothing else needs touching
// unless the feature needs JavaScript (see content.js).

const YTC_FEATURES = [
  // Navigation
  {
    key: "homeRedirect",
    group: "Navigation",
    label: "Home opens Subscriptions",
    cssClass: "ut-home-redirect",
    default: true,
  },

  // Feeds
  {
    key: "hideShorts",
    group: "Feeds",
    label: "Hide Shorts everywhere",
    cssClass: "ut-hide-shorts",
    default: true,
  },
  {
    key: "noHoverPreview",
    group: "Feeds",
    label: "No play on hover",
    cssClass: "ut-no-hover-preview",
    default: true,
  },
  {
    key: "calmThumbnails",
    group: "Feeds",
    label: "Calmer thumbnail colors",
    cssClass: "ut-calm-thumbnails",
    default: true,
  },

  // Watch page
  {
    key: "hideRelated",
    group: "Watch page",
    label: "Hide suggested videos sidebar",
    cssClass: "ut-hide-related",
    default: true,
  },

  // Layout
  {
    key: "trimGuide",
    group: "Layout",
    label: "Left menu: keep only top section",
    cssClass: "ut-trim-guide",
    default: true,
  },
  {
    key: "hideGuide",
    group: "Layout",
    label: "Left menu: hide completely",
    cssClass: "ut-hide-guide",
    default: false,
  },
  {
    key: "hideTopbarExtras",
    group: "Layout",
    label: "Hide Create and voice search",
    cssClass: "ut-hide-topbar-extras",
    default: true,
  },
];

const YTC_DEFAULTS = Object.fromEntries(YTC_FEATURES.map((f) => [f.key, f.default]));
