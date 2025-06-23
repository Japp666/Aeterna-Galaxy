import { el } from "../utils/dom.js";

export default {
  create() {
    return el("div", { class: "training-calendar" },
      el("p", {}, "Calendar de antrenamente va fi aici")
    );
  }
};
