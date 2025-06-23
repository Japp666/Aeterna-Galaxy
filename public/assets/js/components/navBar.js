import { el } from "../utils/dom.js";

const items = [
  { key: "dashboard", label: "Dashboard" },
  { key: "news", label: "News" },
  { key: "match", label: "Matches" },
  { key: "scouting", label: "Scouting" },
  { key: "training", label: "Training" }
];

export default {
  init(navigate) {
    const navBar = el("nav", { class: "navbar" },
      ...items.map(item =>
        el("button", { onclick: () => navigate(item.key) }, item.label)
      )
    );
    document.getElementById("navbar").appendChild(navBar);
  }
};
