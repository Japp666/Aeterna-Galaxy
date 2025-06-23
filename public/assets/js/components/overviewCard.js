import { el } from "../utils/dom.js";

export default {
  create({ title, value }) {
    return el("div", { class: "overview-card" },
      el("h3", {}, title),
      el("div", { class: "overview-value" }, value)
    );
  }
};
