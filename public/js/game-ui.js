import { renderSetupScreen } from "./setup.js";

window.addEventListener("DOMContentLoaded", () => {
  const nickname = localStorage.getItem("coachNickname");

  if (!nickname) {
    renderSetupScreen();
  } else {
    // Încarcă dashboard-ul sau altă componentă după setup
    console.log("✅ Setup complet. Poți continua cu jocul.");
  }

  const resetBtn = document.getElementById("reset-game-button");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }
});
