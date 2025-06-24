// public/assets/js/router.js

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
      
      // Dacă s-a încărcat pagina de setup, se atașează logica specifică
      if (page === "setup") {
        // Array cu link-urile emblemelor
        const emblemUrls = [
          "https://i.postimg.cc/mkB8cRGQ/01.png",
          "https://i.postimg.cc/hjFCBTyZ/02.png",
          "https://i.postimg.cc/QMK6w0bW/03.png",
          "https://i.postimg.cc/TwrtY1Bd/04.png",
          "https://i.postimg.cc/vThXfjQC/05.png",
          "https://i.postimg.cc/bY9m7GQL/06.png",
          "https://i.postimg.cc/jdqMtscT/07.png",
          "https://i.postimg.cc/ncd0L6SD/08.png",
          "https://i.postimg.cc/zGVpH04P/09.png",
          "https://i.postimg.cc/4xqP6pg4/10.png"
        ];

        const emblemSelector = document.getElementById("emblemSelector");
        let selectedEmblem = emblemUrls[0]; // implicit prima emblemă

        // Creează grila de opțiuni pentru embleme
        emblemSelector.innerHTML = "";
        emblemUrls.forEach((url, index) => {
          const img = document.createElement("img");
          img.src = url;
          img.alt = `Emblemă ${index + 1}`;
          img.classList.add("emblem-option");
          if (index === 0) img.classList.add("selected");
          img.addEventListener("click", () => {
            selectedEmblem = url;
            document
              .querySelectorAll(".emblem-option")
              .forEach(i => i.classList.remove("selected"));
            img.classList.add("selected");
            drawLogo();
          });
          emblemSelector.appendChild(img);
        });

        // Funcția de desenare a siglei în canvas
        function drawLogo() {
          const canvas = document.getElementById("logoCanvas");
          const ctx = canvas.getContext("2d");
          const w = canvas.width,
            h = canvas.height;
          const bg1 = document.getElementById("bgColor1").value;
          const bg2 = document.getElementById("bgColor2").value;
          const border = document.getElementById("emblemColor").value;

          ctx.clearRect(0, 0, w, h);
          ctx.save();

          // Creează gradientul pentru fundalul siglei
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, bg1);
          grad.addColorStop(1, bg2);
          ctx.fillStyle = grad;

          // Desenează o formă de scut (simplificată)
          ctx.beginPath();
          ctx.moveTo(w / 2, 20);
          ctx.lineTo(w - 20, h / 2);
          ctx.lineTo(w / 2, h - 20);
          ctx.lineTo(20, h / 2);
          ctx.closePath();
          ctx.fill();

          // Desenează conturul siglei
          ctx.strokeStyle = border;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Desenează emblema în centru (la dimensiuni 64×64)
          const emblemImg = new Image();
          emblemImg.onload = () => {
            ctx.drawImage(emblemImg, w / 2 - 32, h / 2 - 32, 64, 64);
          };
          emblemImg.src = selectedEmblem;
          ctx.restore();
        }

        // Actualizează canvasul la modificarea culorilor
        ["bgColor1", "bgColor2", "emblemColor"].forEach(id => {
          document.getElementById(id).addEventListener("input", drawLogo);
        });

        // Desenează sigla inițial
        drawLogo();

        // Atasează evenimentul pentru submit-ul formularului de setup
        const setupForm = document.getElementById("setupForm");
        setupForm.addEventListener("submit", e => {
          e.preventDefault();
          const coach = document.getElementById("coachName").value;
          const club = document.getElementById("clubName").value;
          const canvas = document.getElementById("logoCanvas");
          const logo = canvas.toDataURL();
          
          localStorage.setItem("coachName", coach);
          localStorage.setItem("clubName", club);
          localStorage.setItem("clubLogo", logo);
          localStorage.setItem("clubEmblemURL", selectedEmblem);
          
          navigateTo("dashboard");
        });
      }
    })
    .catch(error => {
      console.error(error);
      document.getElementById("app").innerHTML =
        "<h2>Pagina nu poate fi încărcată</h2>";
    });
}
