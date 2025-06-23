import { navigateTo } from "./router.js";
import NavBar from "./components/navBar.js";

// Inițializează meniul de navigare
NavBar.init(navigateTo);

// La încărcarea documentului, navigăm către pagina "dashboard"
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("dashboard");
});
