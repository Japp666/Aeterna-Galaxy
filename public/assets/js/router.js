if (page === "setup") {
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
  let selectedEmblem = emblemUrls[0]; // implicit prima

  // Construim grila cu imagini
  emblemUrls.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = `Emblemă ${index + 1}`;
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.margin = "4px";
    img.style.border = index === 0 ? "3px solid #00ffcc" : "1px solid #444";
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      selectedEmblem = url;
      Array.from(emblemSelector.children).forEach(i => i.style.border = "1px solid #444");
      img.style.border = "3px solid #00ffcc";
      previewCanvas(); // actualizăm canvasul
    });
    emblemSelector.appendChild(img);
  });

  // Previzualizarea siglei în canvas
  function previewCanvas() {
    const canvas = document.getElementById("logoCanvas");
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const bg1 = document.getElementById("bgColor1").value;
    const bg2 = document.getElementById("bgColor2").value;

    // fundal gradient
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, bg1);
    grad.addColorStop(1, bg2);
    ctx.fillStyle = grad;

    // Scut simplificat
    ctx.beginPath();
    ctx.moveTo(w / 2, 20);
    ctx.lineTo(w - 20, h / 2);
    ctx.lineTo(w / 2, h - 20);
    ctx.lineTo(20, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emblemă – imagine
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, w / 2 - 32, h / 2 - 32, 64, 64);
    };
    img.src = selectedEmblem;
  }

  // Refacem canvasul dacă se schimbă culorile
  ["bgColor1", "bgColor2"].forEach(id =>
    document.getElementById(id).addEventListener("input", previewCanvas)
  );

  // Executăm preview inițial
  previewCanvas();

  // Submit-ul formularului
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
    localStorage.setItem("clubEmblemURL", selectedEmblem); // salvează linkul

    navigateTo("dashboard");
  });
}
