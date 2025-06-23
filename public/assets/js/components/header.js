import { el } from "../utils/dom.js";

export default {
  create(title) {
    return el("header", { class: "header" },
      el("h1", {}, title),
      el("button", { onclick: () => alert("Settings") }, "⚙")
    );
  }
};
