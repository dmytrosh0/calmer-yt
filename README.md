# Calmer YT

A small personal extension for Chrome and other Chromium-based browsers (Edge, Brave, Arc, Vivaldi…) that makes YouTube calmer. No build step, no dependencies: Chrome loads the folder as it is.

## Features

Every feature has a switch in the toolbar popup. Changes apply instantly to open YouTube tabs.

| Feature | Default | Where it lives |
|---|---|---|
| Home opens Subscriptions | on | `content.js`, `css/home-redirect.css` |
| Hide Shorts everywhere (and open `/shorts/` links in the normal player) | on | `css/shorts.css`, `content.js` |
| No play on hover | on | `css/hover-preview.css`, `content.js` |
| Calmer thumbnail colors (full color on hover) | on | `css/thumbnails.css` |
| Hide suggested videos sidebar on the watch page | on | `css/related.css` |
| Left menu: keep only top section | on | `css/layout.css` |
| Left menu: hide completely | off | `css/layout.css` |
| Hide Create and voice search buttons | on | `css/layout.css` |

## Install

### From a release (easiest)

1. Download `calmer-yt-vX.Y.Z.zip` from the [latest release](../../releases/latest) and unzip it somewhere permanent (not Downloads; the folder *is* the extension).
2. Open `chrome://extensions` (or your browser's equivalent, e.g. `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and choose the unzipped folder.

To update, download the new zip, replace the folder's contents, and click the reload arrow on the extension card.

### From source

1. Clone the repo (`calmer-yt`) somewhere permanent.
2. Follow steps 2 and 3 above, choosing the repo folder.

Repeat on each computer.

### Extension ID

`manifest.json` contains a `key` field, which pins the extension ID to:

```
mgbgoalkepibjnbejnnkkjhlbagnhfoa
```

Without it, Chrome derives the ID from the folder path, so the same extension at different paths on two computers would count as two different extensions. With the same ID everywhere, `chrome.storage.sync` syncs the toggle settings between computers signed into the same Chrome profile with sync turned on.

## Updating

1. Edit the files (or `git pull` on the other computer).
2. In `chrome://extensions`, click the reload arrow on the Calmer YT card.
3. Refresh open YouTube tabs.

Don't remove and re-add the extension to update it: removing it wipes the stored settings.

Bump `version` in `manifest.json` when you change something, so `chrome://extensions` shows which computer is behind.

## Releasing

1. Bump `version` in `manifest.json` and commit.
2. Tag and push: `git tag vX.Y.Z && git push origin main --tags`.

The `Release` workflow checks that the tag matches the manifest version, zips the extension files, and publishes a GitHub Release with the zip attached.

## When YouTube breaks something

YouTube changes its markup every few months, and something hidden will quietly come back.

1. Right-click the element that reappeared → **Inspect**.
2. Find a stable selector: a custom element name (`ytd-…`, `yt-…`), an `id`, or an attribute. Avoid matching visible text, since it changes with the UI language.
3. Add it to the matching file in `css/`, prefixed with that feature's class (e.g. `html.ut-hide-shorts …`).
4. Reload the extension and refresh the tab.

## How it works

Almost everything is CSS. `content.js` reads the settings and toggles one class per feature on `<html>` (for example `ut-hide-shorts`). Each rule in `css/` only applies while its class is present. There are no DOM scans or MutationObservers, so the cost on YouTube is close to zero.

JavaScript is only used where CSS can't help:

- **Redirects**: the home page and `/shorts/` URLs, on full page loads and on in-app link clicks (YouTube is a single-page app).
- **Hover previews**: a hidden preview video can keep playing with sound, so it gets muted and paused.

## Adding a feature

1. Add an entry to `YTC_FEATURES` in `features.js` (key, group, label, CSS class, default).
2. Add rules gated by `html.<cssClass>` to a file in `css/`. For a new file, add it to `content_scripts.css` in `manifest.json`.
3. Reload the extension.

The popup renders itself from `features.js`, so there's nothing else to wire up.

## Layout

```
manifest.json      Extension manifest (with pinned key)
.github/workflows/ Release automation (zip on tag)
features.js        Feature list: single source of truth for content script and popup
content.js         Applies classes, handles redirects and hover previews
css/               One file per feature area, all rules gated by <html> classes
popup/             Toolbar popup, generated from features.js
icons/             16 / 48 / 128 px icons
```

## General info

Not affiliated with or endorsed by YouTube or Google.
License: MIT.
