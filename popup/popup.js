// Renders one switch per entry in YTC_FEATURES (features.js), grouped by `group`.

const container = document.getElementById("features");

function render(settings) {
  const groups = new Map();
  for (const f of YTC_FEATURES) {
    if (!groups.has(f.group)) groups.set(f.group, []);
    groups.get(f.group).push(f);
  }

  for (const [group, features] of groups) {
    const heading = document.createElement("h2");
    heading.textContent = group;
    const list = document.createElement("ul");

    for (const f of features) {
      const item = document.createElement("li");
      const label = document.createElement("label");

      const text = document.createElement("span");
      text.textContent = f.label;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!settings[f.key];
      input.addEventListener("change", () => {
        chrome.storage.sync.set({ [f.key]: input.checked });
      });

      const toggle = document.createElement("span");
      toggle.className = "switch";

      label.append(text, input, toggle);
      item.append(label);
      list.append(item);
    }

    container.append(heading, list);
  }
}

chrome.storage.sync.get(YTC_DEFAULTS, render);
