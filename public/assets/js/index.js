// public/assets/js/index.js
import { navigateTo } from "./router.js";
import NavBar from "./components/navBar.js";

// Inițializează NavBar-ul din div-ul cu id="navbar"
NavBar.init(navigateTo);

// La încărcarea completă a paginii, navigăm către dashboard
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("dashboard");
});
