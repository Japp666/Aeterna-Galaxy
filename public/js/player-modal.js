export function showPlayerModal(player) {
  fetch("public/components/player-details-modal.html")
    .then(res => res.text())
    .then(html => {
      const modalContainer = document.getElementById("player-modal");
      modalContainer.innerHTML = html;
      modalContainer.style.display = "flex";

      // Set player info
      document.getElementById("modal-player-name").textContent = player.name;
      document.getElementById("modal-player-age").textContent = player.age;
      document.getElementById("modal-player-position").textContent = player.position;
      document.getElementById("modal-player-team").textContent = player.team;
      document.getElementById("modal-player-rarity").textContent = player.rarity;
      document.getElementById("modal-player-rarity").classList.add(`rarity-${player.rarity.toLowerCase()}`);
      document.getElementById("modal-player-potential").textContent = player.potential;
      document.getElementById("modal-player-potential").classList.add(`rarity-${player.potential.toLowerCase()}`);

      // Atribute
      for (const attr in player.attributes) {
        const el = document.getElementById(`attr-${attr}`);
        if (el) el.textContent = player.attributes[attr];
      }

      // Inițiale și OVR
      document.querySelector(".player-modal-initials").textContent = player.initials;
      document.querySelector(".player-modal-ovr").textContent = `OVR ${player.ovr}`;

      // Steluțe
      document.querySelector(".player-stars-rating").innerHTML = "★".repeat(player.stars) + "☆".repeat(5 - player.stars);

      // Închidere
      document.getElementById("player-details-close-btn").addEventListener("click", () => {
        modalContainer.innerHTML = "";
        modalContainer.style.display = "none";
      });
    });
}
