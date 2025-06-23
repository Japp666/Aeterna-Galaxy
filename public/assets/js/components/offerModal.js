import { el } from "../utils/dom.js";

export default {
  create(player) {
    const modal = el("div", { class: "offer-modal" },
      el("h3", {}, `Oferă pentru ${player.name}`),
      el("label", {}, "Salariu: "),
      el("input", { type: "number", value: player.salary }),
      el("label", {}, "Taxă Transfer: "),
      el("input", { type: "number", value: player.marketValue }),
      el("button", { onclick: () => console.log("Offer sent!") }, "Trimite ofertă"),
      el("button", { onclick: () => modal.remove() }, "Anulează")
    );
    document.body.appendChild(modal);
    return modal;
  }
};
