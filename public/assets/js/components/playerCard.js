import { el } from "../utils/dom.js";
import { fmtEuro } from "../utils/formatter.js";

export default {
  create(player) {
    return el("div", { class: "player-card" },
      el("h4", {}, player.name),
      el("p", {}, `Vârstă: ${player.age}`),
      el("p", {}, `Potențial: ${player.potential}`),
      el("p", {}, `Salariu: ${fmtEuro(player.salary)}`),
      el("p", {}, `Valoare piață: ${fmtEuro(player.marketValue)}`)
    );
  }
};
