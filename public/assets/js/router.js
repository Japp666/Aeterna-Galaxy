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
      
      if (page === "setup") {
        // Funcția care desenează sigla extinsă
        function previewCrest() {
          const canvas = document.getElementById("logoCanvas");
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          const w = canvas.width, h = canvas.height;
  
          // Preluăm valorile de culoare și opțiunile selectate
          const bgColor1 = document.getElementById("bgColor1").value;
          const bgColor2 = document.getElementById("bgColor2").value;
          const emblem = document.getElementById("emblemSelect").value;
          const emblemColor = document.getElementById("emblemColor").value;
  
          // Curățăm canvas-ul
          ctx.clearRect(0, 0, w, h);
  
          // Desenăm sigla sub forma unui scut modern
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(w * 0.5, h * 0.1);
          ctx.quadraticCurveTo(w * 0.9, h * 0.2, w * 0.85, h * 0.55);
          ctx.quadraticCurveTo(w * 0.8, h * 0.9, w * 0.5, h * 0.95);
          ctx.quadraticCurveTo(w * 0.2, h * 0.9, w * 0.15, h * 0.55);
          ctx.quadraticCurveTo(w * 0.1, h * 0.2, w * 0.5, h * 0.1);
          ctx.closePath();
  
          // Cream un gradient pentru fundalul scutului
          const gradient = ctx.createLinearGradient(0, 0, w, h);
          gradient.addColorStop(0, bgColor1);
          gradient.addColorStop(1, bgColor2);
          ctx.fillStyle = gradient;
  
          // Adăugăm o umbră ușoară
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
  
          ctx.fill();
          ctx.shadowColor = "transparent";
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#222";
          ctx.stroke();
          ctx.restore();
  
          // Desenăm emblema personalizată în centru – folosim o funcție dedicată
          drawAdvancedEmblem(ctx, emblem, emblemColor, w, h);
        }
        
        // Funcția pentru a desena o emblemă avansată
        function drawAdvancedEmblem(ctx, emblem, emblemColor, w, h) {
          ctx.save();
          ctx.fillStyle = emblemColor;
          ctx.strokeStyle = emblemColor;
          ctx.lineWidth = 2;
          const centerX = w / 2;
          // Plasăm emblema puțin mai jos de centrul scutului
          const centerY = h * 0.65;
  
          switch (emblem) {
            case "crown":
              // Desenăm o coroană sofisticată cu trei vârfuri, cu vârfuri diferite și umbrire
              ctx.beginPath();
              ctx.moveTo(centerX - 40, centerY);
              ctx.lineTo(centerX - 25, centerY - 30);
              ctx.lineTo(centerX - 15, centerY);
              ctx.lineTo(centerX - 5, centerY - 40);
              ctx.lineTo(centerX + 5, centerY);
              ctx.lineTo(centerX + 15, centerY - 30);
              ctx.lineTo(centerX + 30, centerY);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              break;
            case "lion":
              // Desenăm un cap de leu cu un contur circular și urechiușe simbolice
              ctx.beginPath();
              ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
              ctx.fill();
              // Adăugăm conturul „manei” ca mici cercuri
              for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 4) {
                const xOffset = Math.cos(angle) * 28;
                const yOffset = Math.sin(angle) * 28;
                ctx.beginPath();
                ctx.arc(centerX + xOffset, centerY + yOffset, 6, 0, 2 * Math.PI);
                ctx.fill();
              }
              break;
            case "trident":
              // Desenăm un trident mai detaliat: linia centrală plus trei pronguri curbe
              ctx.beginPath();
              // Linie centrală verticală
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
              // Desenăm un delfin stilizat cu curbe fluide
              ctx.beginPath();
              ctx.moveTo(centerX - 25, centerY);
              ctx.bezierCurveTo(centerX - 10, centerY - 25, centerX + 10, centerY - 25, centerX + 25, centerY);
              ctx.bezierCurveTo(centerX + 10, centerY + 10, centerX - 10, centerY + 10, centerX - 25, centerY);
              ctx.fill();
              break;
            case "elephant":
              // Desenăm un cap de elefant stilizat cu cerc pentru cap și o trompă arcuitată
              ctx.beginPath();
              ctx.arc(centerX, centerY - 10, 18, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(centerX, centerY + 8);
              ctx.quadraticCurveTo(centerX - 10, centerY + 25, centerX, centerY + 30);
              ctx.stroke();
              break;
            default:
              // Desenez implicit un simbol stelar mic
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
  
        // Legăm butonul de previzualizare cu funcția previewCrest
        const previewBtn = document.getElementById("previewCrestBtn");
        if (previewBtn) {
          previewBtn.addEventListener("click", previewCrest);
        }
  
        // Afișăm imediat sigla la încărcarea paginii
        previewCrest();
  
        // Event listener pentru formularul de setup
        const setupForm = document.getElementById("setupForm");
        if (setupForm) {
          setupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const coachNameValue = document.getElementById("coachName").value;
            const clubNameValue = document.getElementById("clubName").value;
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
