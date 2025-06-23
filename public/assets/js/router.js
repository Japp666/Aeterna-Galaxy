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
      // Dacă se încarcă pagina de setup, atașează event listener pentru formular
      if (page === "setup") {
        const form = document.getElementById("setupForm");
        if (form) {
          form.addEventListener("submit", (event) => {
            event.preventDefault();
            const coachNameValue = document.getElementById("coachName").value;
            const clubNameValue = document.getElementById("clubName").value;
            // Extrage sigla din canvas ca DataURL
            const canvas = document.getElementById("logoCanvas");
            const clubLogoValue = canvas.toDataURL();
            localStorage.setItem("coachName", coachNameValue);
            localStorage.setItem("clubName", clubNameValue);
            localStorage.setItem("clubLogo", clubLogoValue);
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
