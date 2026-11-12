// Calmer YT content script. Runs at document_start on every YouTube page.
// features.js is loaded before this file and provides YTC_FEATURES / YTC_DEFAULTS.
//
// Most features are pure CSS: this script only toggles classes on <html>.
// The JavaScript below exists for the few things CSS can't do (redirects,
// pausing hover previews).

let settings = { ...YTC_DEFAULTS };

// ---------- Settings -> <html> classes ----------

function applyClasses() {
  const root = document.documentElement;
  for (const f of YTC_FEATURES) {
    root.classList.toggle(f.cssClass, !!settings[f.key]);
  }
}

chrome.storage.sync.get(YTC_DEFAULTS, (stored) => {
  settings = stored;
  applyClasses();
  redirectIfNeeded();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key in YTC_DEFAULTS) settings[key] = newValue;
  }
  applyClasses();
});

// ---------- Redirects (homeRedirect, hideShorts) ----------

// Returns the URL we'd rather be at, or null if this one is fine.
function rewrite(url) {
  if (settings.homeRedirect && url.pathname === "/") {
    return "/feed/subscriptions";
  }
  if (settings.hideShorts && url.pathname.startsWith("/shorts/")) {
    const id = url.pathname.split("/")[2];
    if (id) return `/watch?v=${encodeURIComponent(id)}`;
  }
  return null;
}

function redirectIfNeeded() {
  const target = rewrite(new URL(location.href));
  if (target) location.replace(target);
}

// Catch in-app navigation before YouTube's own router handles it
// (logo, "Home" in the menu, Shorts links). Capture phase, so this runs
// before YouTube's click handlers on the link.
document.addEventListener(
  "click",
  (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.hostname !== location.hostname) return;
    const target = rewrite(url);
    if (!target) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.assign(target);
  },
  true
);

// Fallback for navigations that don't come from a link click (back/forward, etc.).
document.addEventListener("yt-navigate-finish", redirectIfNeeded);
window.addEventListener("popstate", redirectIfNeeded);

// ---------- Play-on-hover (noHoverPreview) ----------

// Hiding the preview player isn't enough: it can still play (and make sound)
// while invisible. "play" doesn't bubble, but a capture listener still sees it.
document.addEventListener(
  "play",
  (e) => {
    if (!settings.noHoverPreview) return;
    const video = e.target;
    if (!(video instanceof HTMLMediaElement)) return;
    if (video.closest("ytd-video-preview, #video-preview, #inline-preview-player")) {
      video.muted = true;
      video.pause();
    }
  },
  true
);
