import { el } from "../utils/dom.js";

export default {
  create() {
    return el("div", { class: "stats-panel" },
      el("p", {}, "Possesion: A 54% - 46%"),
      el("p", {}, "Shots: A 7 - 5")
    );
  }
};
