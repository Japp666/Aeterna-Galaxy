export function showRaceSelection() {
  const raceContainer = document.getElementById('race-selection');
  raceContainer.innerHTML = `
    <div class="race-title">Alege-ți rasa:</div>
    <div class="race-cards">
      <div class="race-card" onclick="selectRace('Solari')">
        <img src="https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png" alt="Solari">
        <h3>Solari</h3>
        <p>Descendenți ai omenirii, maeștri ai adaptării și progresului.</p>
      </div>
      <div class="race-card inactive">
        <img src="https://via.placeholder.com/100x100?text=In+Curând" alt="Coming Soon">
        <h3>???</h3>
        <p>În curând...</p>
      </div>
    </div>
  `;
  raceContainer.classList.remove('hidden');
}

export function setupRaceCards() {
  window.selectRace = function (race) {
    window.user.race = race;
    document.getElementById('race-selection').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('buildingsTab').classList.remove('hidden');
    document.getElementById('userName').textContent = `Comandant ${window.user.name}`;
  };
}
