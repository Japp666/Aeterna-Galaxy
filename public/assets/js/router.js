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
      
      // Dacă se încarcă pagina de setup, atașăm codul pentru inițializare
      if (page === "setup") {
        
        // Funcția ce desenează sigla pe canvas
        function previewCrest() {
          const canvas = document.getElementById("logoCanvas");
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          const w = canvas.width, h = canvas.height;
          // Obținem culorile și opțiunile selectate
          const bgColor1 = document.getElementById("bgColor1").value;
          const bgColor2 = document.getElementById("bgColor2").value;
          const emblem = document.getElementById("emblemSelect").value;
          const emblemColor = document.getElementById("emblemColor").value;
          
          // Curățăm canvas-ul
          ctx.clearRect(0, 0, w, h);
          
          // Desenăm forma de scut
          ctx.beginPath();
          ctx.moveTo(w / 2, 0);
          ctx.lineTo(w, h * 0.3);
          ctx.lineTo(w * 0.85, h);
          ctx.lineTo(w * 0.15, h);
          ctx.lineTo(0, h * 0.3);
          ctx.closePath();
          
          // Creăm un gradient liniar care folosește culorile selectate
          const gradient = ctx.createLinearGradient(0, 0, w, h);
          gradient.addColorStop(0, bgColor1);
          gradient.addColorStop(1, bgColor2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = "#000";
          ctx.stroke();
          
          // Desenăm emblema în centru
          drawEmblem(ctx, emblem, emblemColor, w, h);
        }
        
        // Funcția pentru desenarea emblemelor
        function drawEmblem(ctx, emblem, emblemColor, w, h) {
          ctx.fillStyle = emblemColor;
          ctx.strokeStyle = emblemColor;
          ctx.lineWidth = 2;
          const centerX = w / 2, centerY = h / 2;
          switch (emblem) {
            case "crown":
              // Desen simplu de coroană: bază și câteva triunghiuri
              ctx.fillRect(centerX - 20, centerY, 40, 10);
              ctx.beginPath();
              ctx.moveTo(centerX - 20, centerY);
              ctx.lineTo(centerX - 10, centerY - 20);
              ctx.lineTo(centerX, centerY);
              ctx.closePath();
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(centerX - 5, centerY);
              ctx.lineTo(centerX, centerY - 25);
              ctx.lineTo(centerX + 5, centerY);
              ctx.closePath();
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(centerX + 10, centerY);
              ctx.lineTo(centerX + 20, centerY - 20);
              ctx.lineTo(centerX + 30, centerY);
              ctx.closePath();
              ctx.fill();
              break;
            case "lion":
              // Desen simplu pentru cap de leu: cerc central și două urechiușe
              ctx.beginPath();
              ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(centerX - 12, centerY - 12, 5, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(centerX + 12, centerY - 12, 5, 0, 2 * Math.PI);
              ctx.fill();
              break;
            case "trident":
              // Desenul unui trident cu trei pronguri
              ctx.beginPath();
              ctx.moveTo(centerX - 20, centerY + 15);
              ctx.lineTo(centerX - 20, centerY - 15);
              ctx.moveTo(centerX, centerY + 15);
              ctx.lineTo(centerX, centerY - 20);
              ctx.moveTo(centerX + 20, centerY + 15);
              ctx.lineTo(centerX + 20, centerY - 15);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(centerX - 20, centerY - 15);
              ctx.lineTo(centerX + 20, centerY - 15);
              ctx.stroke();
              break;
            case "dolphin":
              // Desenul unui delfin stilizat folosind curbe
              ctx.beginPath();
              ctx.moveTo(centerX - 15, centerY);
              ctx.quadraticCurveTo(centerX, centerY - 20, centerX + 15, centerY);
              ctx.quadraticCurveTo(centerX, centerY + 20, centerX - 15, centerY);
              ctx.fill();
              break;
            case "elephant":
              // Desenul unui elefant stilizat: cap circular și trompă
              ctx.beginPath();
              ctx.arc(centerX, centerY - 5, 15, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(centerX, centerY + 10);
              ctx.lineTo(centerX, centerY + 25);
              ctx.stroke();
              break;
            default:
              // Desen implicit (punct)
              ctx.beginPath();
              ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
              ctx.fill();
          }
        }
        
        // Atașăm evenimentul la butonul "Previzualizează Sigla"
        const previewBtn = document.getElementById("previewCrestBtn");
        if (previewBtn) {
          previewBtn.addEventListener("click", previewCrest);
        }
        
        // Apelăm preview inițial pentru a afișa sigla la încărcare
        previewCrest();
        
        // Evenimentul de submit pentru formularul de setup
        const setupForm = document.getElementById("setupForm");
        if (setupForm) {
          setupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const coachNameValue = document.getElementById("coachName").value;
            const clubNameValue = document.getElementById("clubName").value;
            // Extragem sigla curentă din canvas ca Data URL
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
