import { el } from "../utils/dom.js";

export default {
  create({ scoutName, level, region }) {
    return el("div", { class: "scout-card" },
      el("h4", {}, scoutName),
      el("small", {}, `Level: ${level} - Region: ${region}`)
    );
  }
};
