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
    const navBar = el(
      "nav",
      { class: "navbar" },
      ...items.map(item =>
        el("button", { onclick: () => navigate(item.key) }, item.label)
      ),
      // Butonul "Reset Game" adăugat în meniul de navigare
      el(
        "button",
        {
          onclick: () => {
            if (
              confirm(
                "Sigur dorești să resetezi jocul? Toate datele vor fi șterse!"
              )
            ) {
              localStorage.clear();
              window.location.reload();
            }
          }
        },
        "Reset Game"
      )
    );

    const navContainer = document.getElementById("navbar");
    if (navContainer) {
      navContainer.innerHTML = "";
      navContainer.appendChild(navBar);
    } else {
      console.error("Elementul cu id 'navbar' nu a fost găsit.");
    }
  }
};
