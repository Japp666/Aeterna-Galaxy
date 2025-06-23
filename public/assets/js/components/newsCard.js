import { el } from "../utils/dom.js";

export default {
  create({ icon, title, subtitle, isNew = false }) {
    return el("div", { class: "news-card" },
      el("span", { class: "news-icon" }, icon),
      el("div", { class: "news-content" },
        el("h4", {}, title),
        el("small", {}, subtitle)
      ),
      isNew ? el("span", { class: "news-badge" }, "New") : ""
    );
  }
};
