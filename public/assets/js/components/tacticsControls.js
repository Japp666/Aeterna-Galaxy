import { el } from "../utils/dom.js";

export default {
  create() {
    return el("div", { class: "tactics-controls" },
      el("button", { onclick: () => console.log("Pressing ↑") }, "Pressing ↑"),
      el("button", { onclick: () => console.log("Defensive Line ↓") }, "Defensive Line ↓"),
      el("button", { onclick: () => console.log("Tempo ↑") }, "Tempo ↑"),
      el("button", { onclick: () => console.log("Tempo ↓") }, "Tempo ↓"),
      el("button", { onclick: () => console.log("Toggle Auto-Subs") }, "Toggle Auto-Subs")
    );
  },
  onEnd(matchData) {
    console.log("Match ended:", matchData);
  }
};
