export default {
  init(navigate) {
    // Creăm containerul meniului
    const navBar = document.createElement("nav");
    navBar.className = "navbar";

    // Lista butoanelor din meniu
    const items = [
      { key: "dashboard", label: "Dashboard" },
      { key: "news", label: "News" },
      { key: "match", label: "Matches" },
      { key: "scouting", label: "Scouting" },
      { key: "training", label: "Training" }
    ];
    // Creăm câte un buton pentru fiecare item din meniu
    items.forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        console.log("Navigating to:", item.key);
        navigate(item.key);
      });
      navBar.appendChild(btn);
    });

    // Butonul de resetare a jocului
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Game";
    resetBtn.addEventListener("click", () => {
      if (confirm("Sigur dorești să resetezi jocul? Toate datele vor fi șterse!")) {
        localStorage.clear();
        window.location.reload();
      }
    });
    navBar.appendChild(resetBtn);

    // Inserăm meniul în elementul cu id="navbar"
    const navContainer = document.getElementById("navbar");
    if (navContainer) {
      navContainer.innerHTML = "";
      navContainer.appendChild(navBar);
    } else {
      console.error("Elementul cu id 'navbar' nu a fost găsit.");
    }
  }
};
