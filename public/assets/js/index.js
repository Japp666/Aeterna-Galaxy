import { navigateTo } from "./router.js";
import NavBar from "./components/navBar.js";

// Inițializează meniul de navigare
NavBar.init(navigateTo);

// La încărcarea documentului, verificăm dacă setările clubului există în localStorage.
// Dacă nu, utilizatorul este direcționat către pagina de setup; altfel, se încarcă Dashboard-ul.
document.addEventListener("DOMContentLoaded", () => {
  const coachName = localStorage.getItem("coachName");
  const clubName = localStorage.getItem("clubName");
  const clubLogo = localStorage.getItem("clubLogo");

  if (!coachName || !clubName || !clubLogo) {
    navigateTo("setup");
  } else {
    navigateTo("dashboard");
  }
});
