// public/assets/js/index.js

import { navigateTo } from "./router.js";
import NavBar from "./components/navBar.js";

NavBar.init(navigateTo);

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
