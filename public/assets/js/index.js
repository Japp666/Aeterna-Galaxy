import { navigateTo } from "./router.js";
import NavBar from "./components/navBar.js";

// Initializează NavBar-ul (se injectează în div-ul cu id="navbar")
NavBar.init(navigateTo);

// La load-ul paginii, navigăm către dashboard
document.addEventListener("DOMContentLoaded", () => {
  navigateTo("dashboard");
});
