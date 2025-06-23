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
      
      // Execută cod specific pentru pagina "setup"
      if (page === "setup") {
        // Adăugăm event listener pentru formularul de setup
        const setupForm = document.getElementById("setupForm");
        if (setupForm) {
          setupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const coachNameValue = document.getElementById("coachName").value;
            const clubNameValue = document.getElementById("clubName").value;
            // Extragem sigla din canvas ca DataURL
            const canvas = document.getElementById("logoCanvas");
            const clubLogoValue = canvas.toDataURL();
            localStorage.setItem("coachName", coachNameValue);
            localStorage.setItem("clubName", clubNameValue);
            localStorage.setItem("clubLogo", clubLogoValue);
            navigateTo("dashboard");
          });
        }
        
        // Inițializarea canvas-ului: generăm sigla
        const canvas = document.getElementById("logoCanvas");
        if (canvas) {
          const ctx = canvas.getContext("2d");
          function generateLogo() {
            console.log("Se generează sigla...");
            // Ștergem conținutul canvas-ului
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Umplem canvas-ul cu negru pur
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Alegem aleator forma: "circle" sau "square"
            const shape = Math.random() < 0.5 ? "circle" : "square";
            // Lista de culori neon SF
            const colors = ["#00ffcc", "#00ccff", "#cc00ff", "#ff00cc", "#ffcc00"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            console.log("Forma selectată:", shape, "Culoare:", color);
            ctx.fillStyle = color;
            if (shape === "circle") {
              const radius = canvas.width / 3;
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
              ctx.fill();
            } else {
              const size = canvas.width / 1.5;
              const x = (canvas.width - size) / 2;
              const y = (canvas.height - size) / 2;
              ctx.fillRect(x, y, size, size);
            }
          }
          // Generăm sigla imediat
          generateLogo();
          // Adăugăm event listener pentru butonul "Generează Siglă"
          const generateBtn = document.getElementById("generateLogoBtn");
          if (generateBtn) {
            generateBtn.addEventListener("click", generateLogo);
          }
        }
      }
    })
    .catch(error => {
      console.error(error);
      document.getElementById("app").innerHTML = "<h2>Pagina nu poate fi încărcată</h2>";
    });
}
