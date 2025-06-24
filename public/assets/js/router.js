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
      
      // Logica specifică pentru pagina 'setup'
      if (page === "setup") {
        // Lista link-urilor pentru embleme
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
        let selectedEmblem = emblemUrls[0];

        // Construim selectorul de embleme
        emblemSelector.innerHTML = "";
        emblemUrls.forEach((url, index) => {
          const img = document.createElement("img");
          img.src = url;
          img.alt = `Emblemă ${index + 1}`;
          img.classList.add("emblem-option");
          if (index === 0) img.classList.add("selected");
          img.addEventListener("click", () => {
            selectedEmblem = url;
            document.querySelectorAll(".emblem-option")
              .forEach(i => i.classList.remove("selected"));
            img.classList.add("selected");
            drawLogo();
          });
          emblemSelector.appendChild(img);
        });

        // Funcția de desenare a siglei în canvas folosind procesare pixel cu getImageData
        function drawLogo() {
          const canvas = document.getElementById("logoCanvas");
          const ctx = canvas.getContext("2d");
          const w = canvas.width, h = canvas.height;
          
          // Umple canvasul cu negru
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, w, h);
          
          // Desenăm emblema pe canvas cu factorul de scalare pentru a acoperi marginile
          const emblemImg = new Image();
          emblemImg.crossOrigin = "Anonymous";
          emblemImg.onload = () => {
            const scale = 1.2;
            const newW = w * scale;
            const newH = h * scale;
            const offsetX = (w - newW) / 2;
            const offsetY = (h - newH) / 2;
            ctx.drawImage(emblemImg, offsetX, offsetY, newW, newH);
            
            // Preluăm datele de imagine și înlocuim orice pixel nedesenat (alpha < 255) cu negru
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] < 255) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
              }
            }
            ctx.putImageData(imgData, 0, 0);
          };
          emblemImg.src = selectedEmblem;
        }

        // Apelăm funcția de previzualizare inițial
        drawLogo();

        // Evenimentul de submit pentru formularul de setup
        const form = document.getElementById("setupForm");
        form.addEventListener("submit", e => {
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
