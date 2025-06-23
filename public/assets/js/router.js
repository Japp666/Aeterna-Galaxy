export function navigateTo(page) {
  const url = `views/${page}.html`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Nu s-a putut încărca ${url}`);
      }
      return response.text();
    })
    .then(html => {
      const appDiv = document.getElementById("app");
      appDiv.innerHTML = html;
      
      // Dacă pagina încărcată este "setup", atașăm event listener pentru formularul de configurare.
      if (page === "setup") {
        const form = document.getElementById("setupForm");
        if (form) {
          form.addEventListener("submit", (event) => {
            event.preventDefault();
            // Extragem valorile din câmpurile formularului.
            const coachNameValue = document.getElementById("coachName").value;
            const clubNameValue = document.getElementById("clubName").value;
            const clubLogoValue = document.getElementById("clubLogo").value;
            
            // Salvăm în localStorage.
            localStorage.setItem("coachName", coachNameValue);
            localStorage.setItem("clubName", clubNameValue);
            localStorage.setItem("clubLogo", clubLogoValue);
            
            // După salvare, navigăm la pagina Dashboard.
            navigateTo("dashboard");
          });
        }
      }
    })
    .catch(error => {
      console.error(error);
      document.getElementById("app").innerHTML = "<h2>Pagina nu poate fi încărcată</h2>";
    });
}
