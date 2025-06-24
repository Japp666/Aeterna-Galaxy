export default {
  init(navigate) {
    const navBar = document.createElement("nav");
    navBar.className = "navbar";

    const items = [
      { key: "dashboard", label: "Dashboard" },
      { key: "news", label: "News" },
      { key: "match", label: "Matches" },
      { key: "scouting", label: "Scouting" },
      { key: "training", label: "Training" }
    ];
    items.forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        console.log("Navigating to:", item.key);
        navigate(item.key);
      });
      navBar.appendChild(btn);
    });
  
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset Game";
    resetBtn.addEventListener("click", () => {
      if (confirm("Sigur dorești să resetezi jocul? Toate datele vor fi șterse!")) {
        localStorage.clear();
        window.location.reload();
      }
    });
    navBar.appendChild(resetBtn);
    
    const navContainer = document.getElementById("navbar");
    if (navContainer) {
      navContainer.innerHTML = "";
      navContainer.appendChild(navBar);
    } else {
      console.error("Elementul cu id 'navbar' nu a fost găsit.");
    }
  }
};
