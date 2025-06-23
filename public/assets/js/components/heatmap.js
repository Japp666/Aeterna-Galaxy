import { el } from "../utils/dom.js";

export default {
  create() {
    return el("div", { class: "heatmap" },
      el("p", {}, "Heatmap (minimap) goes here")
    );
  }
};
