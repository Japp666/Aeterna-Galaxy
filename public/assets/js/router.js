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
      
      // Dacă se încarcă pagina de setup, se atașează codul de inițializare
      if (page === "setup") {
        // Funcția care desenează sigla avansată
        function previewCrest() {
          const canvas = document.getElementById("logoCanvas");
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          const w = canvas.width, h = canvas.height;
  
          // Preluăm opțiunile selectate
          const bgColor1 = document.getElementById("bgColor1").value;
          const bgColor2 = document.getElementById("bgColor2").value;
          const emblem = document.getElementById("emblemSelect").value;
          const emblemColor = document.getElementById("emblemColor").value;
  
          // Curățăm canvas-ul
          ctx.clearRect(0, 0, w, h);
  
          // Desenăm un scut modern (forma siglei)
          ctx.save();
          ctx.beginPath();
          // Linie de început: pornim din partea de sus a scutului
          ctx.moveTo(w * 0.5, h * 0.05);
          // Dreapta scutului: curbă lină până la partea de jos dreaptă
          ctx.quadraticCurveTo(w * 0.9, h * 0.15, w * 0.85, h * 0.55);
          // Partea de jos: curbă spre marginea stângă
          ctx.quadraticCurveTo(w * 0.8, h * 0.9, w * 0.5, h * 0.95);
          // Curba stângă
          ctx.quadraticCurveTo(w * 0.2, h * 0.9, w * 0.15, h * 0.55);
          // Închiderea formei către punctul de start
          ctx.quadraticCurveTo(w * 0.1, h * 0.15, w * 0.5, h * 0.05);
          ctx.closePath();
  
          // Gradient liniar pentru fundalul scutului
          const gradient = ctx.createLinearGradient(0, 0, w, h);
          gradient.addColorStop(0, bgColor1);
          gradient.addColorStop(1, bgColor2);
          ctx.fillStyle = gradient;
  
          // Adăugăm o umbră pentru adâncime
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
  
          ctx.fill();
          // Eliminăm umbra pentru contur
          ctx.shadowColor = "transparent";
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#222";
          ctx.stroke();
          ctx.restore();
  
          // Desenăm emblema personalizată în centru, într-o funcție dedicată
          drawAdvancedEmblem(ctx, emblem, emblemColor, w, h);
        }
  
        // Funcția pentru desenarea emblemelor cu un stil mai avansat
        function drawAdvancedEmblem(ctx, emblem, emblemColor, w, h) {
          ctx.save();
          ctx.fillStyle = emblemColor;
          ctx.strokeStyle = emblemColor;
          ctx.lineWidth = 2;
          const centerX = w / 2;
          // Plasăm emblema puțin spre partea inferioară a scutului
          const centerY = h * 0.6;
  
          switch (emblem) {
            case "crown":
              // Desenăm o coroană sofisticată cu trei vârfuri
              ctx.beginPath();
              // Linia de bază a coroanei
              ctx.moveTo(centerX - 40, centerY);
              ctx.lineTo(centerX + 40, centerY);
              // Vârful stâng
              ctx.moveTo(centerX - 40, centerY);
              ctx.lineTo(centerX - 20, centerY - 30);
              ctx.lineTo(centerX - 10, centerY);
              // Vârful central
              ctx.moveTo(centerX - 10, centerY);
              ctx.lineTo(centerX, centerY - 45);
              ctx.lineTo(centerX + 10, centerY);
              // Vârful drept
              ctx.moveTo(centerX + 10, centerY);
              ctx.lineTo(centerX + 20, centerY - 30);
              ctx.lineTo(centerX + 40, centerY);
              ctx.stroke();
              // Umplem coroană
              ctx.beginPath();
              ctx.moveTo(centerX - 40, centerY);
              ctx.lineTo(centerX - 20, centerY - 30);
              ctx.lineTo(centerX, centerY - 45);
              ctx.lineTo(centerX + 20, centerY - 30);
              ctx.lineTo(centerX + 40, centerY);
              ctx.closePath();
              ctx.fill();
              break;
            case "lion":
              // Desenăm o siluetă de cap de leu
              ctx.beginPath();
              // Fața
              ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
              ctx.fill();
              // Mane – cercuri mici în jurul feței
              for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
                const xOffset = Math.cos(angle) * 28;
                const yOffset = Math.sin(angle) * 28;
                ctx.beginPath();
                ctx.arc(centerX + xOffset, centerY + yOffset, 6, 0, 2 * Math.PI);
                ctx.fill();
              }
              break;
            case "trident":
              // Desenăm un trident modern
              ctx.beginPath();
              // Linia verticală centrală
              ctx.moveTo(centerX, centerY + 20);
              ctx.lineTo(centerX, centerY - 20);
              ctx.stroke();
              // Prong stâng
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - 20);
              ctx.quadraticCurveTo(centerX - 15, centerY - 35, centerX - 5, centerY - 20);
              ctx.stroke();
              // Prong central
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - 20);
              ctx.lineTo(centerX, centerY - 40);
              ctx.stroke();
              // Prong drept
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - 20);
              ctx.quadraticCurveTo(centerX + 15, centerY - 35, centerX + 5, centerY - 20);
              ctx.stroke();
              break;
            case "dolphin":
              // Desenăm o siluetă stilizată a unui delfin
              ctx.beginPath();
              ctx.moveTo(centerX - 25, centerY);
              ctx.bezierCurveTo(centerX - 10, centerY - 20, centerX + 10, centerY - 20, centerX + 25, centerY);
              ctx.bezierCurveTo(centerX + 10, centerY + 10, centerX - 10, centerY + 10, centerX - 25, centerY);
              ctx.fill();
              break;
            case "elephant":
              // Desenăm o siluetă stilizată de cap de elefant
              ctx.beginPath();
              // Capul
              ctx.arc(centerX, centerY - 10, 18, 0, Math.PI * 2);
              ctx.fill();
              // Trompa
              ctx.beginPath();
              ctx.moveTo(centerX, centerY + 8);
              ctx.quadraticCurveTo(centerX - 10, centerY + 25, centerX, centerY + 30);
              ctx.stroke();
              break;
            default:
              // Desen implicit: un mic simbol stelar
              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                ctx.lineTo(
                  centerX + 20 * Math.cos((18 + i * 72) * Math.PI / 180),
                  centerY + 20 * Math.sin((18 + i * 72) * Math.PI / 180)
                );
                ctx.lineTo(
                  centerX + 10 * Math.cos((54 + i * 72) * Math.PI / 180),
                  centerY + 10 * Math.sin((54 + i * 72) * Math.PI / 180)
                );
              }
              ctx.closePath();
              ctx.fill();
          }
          ctx.restore();
        }
  
        // Atașăm evenimentul la butonul "Previzualizează Sigla"
        const previewBtn = document.getElementById("previewCrestBtn");
        if (previewBtn) {
          previewBtn.addEventListener("click", previewCrest);
        }
  
        // Apelăm imediat preview pentru a afișa sigla la încărcare
        previewCrest();
  
        // Event listener pentru formularul de setup
        const setupForm = document.getElementById("setupForm");
        if (setupForm) {
          setupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const coachNameValue = document.getElementById("coachName").value;
            const clubNameValue = document.getElementById("clubName").value;
            // Extragem sigla curentă din canvas ca DataURL
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
