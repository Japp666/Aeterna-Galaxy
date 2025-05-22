async function loadSection(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  const container = document.getElementById(id);
  container.innerHTML += html;
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('login-container');
  container.className = 'login-wrapper';

  await loadSection('login-container', 'login-nickname.html');
  await loadSection('login-container', 'race-select.html');

  // Selectare rasă
  let selectedRace = null;
  document.querySelectorAll('.race-card').forEach(card => {
    if (!card.classList.contains('inactive')) {
      card.addEventListener('click', () => {
        document.querySelectorAll('.race-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedRace = card.dataset.race;
      });
    }
  });

  // Buton start
  const startButton = document.createElement('button');
  startButton.textContent = 'Începe Jocul';
  startButton.onclick = () => {
    const nickname = document.getElementById('login-nickname').value.trim();

    if (!nickname) {
      alert("Introdu un nume.");
      return;
    }

    if (!selectedRace) {
      alert("Selectează o rasă.");
      return;
    }

    localStorage.setItem('player_name', nickname);
    localStorage.setItem('player_race', selectedRace);
    window.location.href = 'index.html';
  };

  container.appendChild(startButton);
});
