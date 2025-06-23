import { el } from "../utils/dom.js";

export default {
  create() {
    return el("div", { class: "event-feed" },
      el("p", {}, "Evenimentele vor apărea aici...")
    );
  },
  onUpdate(event) {
    console.log("Update event:", event);
    // Actualizează UI-ul (ex.: adaugă evenimente în feed)
  }
};
