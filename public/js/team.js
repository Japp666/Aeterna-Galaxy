import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';

export function renderTeam() {
  const roster = document.getElementById('roster');
  const facilities = document.getElementById('facilities');
  if (!roster || !facilities) {
    console.error('Elementele #roster sau #facilities lipsesc din DOM');
    return;
  }
  if (!gameState.players || !Array.isArray(gameState.players) || gameState.players.length === 0) {
    roster.innerHTML = '<p>Nu există jucători în lot. Încearcă resetarea jocului.</p>';
    facilities.innerHTML = '<p>Jucătorii nu sunt încărcați.</p>';
    return;
  }
  roster.innerHTML = `
    <table class="player-table">
      <thead>
        <tr>
          <th>Nume</th>
          <th>Poziție</th>
          <th>Rating</th>
          <th>Stamina</th>
          <th>Moral</th>
          <th>Salariu</th>
          <th>Contract</th>
        </tr>
      </thead>
      <tbody>
        ${gameState.players.map(p => `
          <tr class="player-row" data-id="${p.id}">
            <td>${p.name || 'N/A'}</td>
            <td>${p.position || 'N/A'}</td>
            <td>${p.rating || 0}</td>
            <td>${p.stamina || 0}</td>
            <td>${p.morale || 0}</td>
            <td>${(p.salary || 0).toLocaleString()} €</td>
            <td>${p.contractYears || 0} ani</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="player-modal" class="modal hidden">
      <div class="modal-content">
        <span id="close-modal" class="close">&times;</span>
        <h2 id="player-name"></h2>
        <p><strong>Poziție:</strong> <span id="player-position"></span></p>
        <div class="status-bar">
          <label>Rating:</label>
          <div class="bar-container">
            <div id="rating-bar" class="bar"></div>
            <span id="rating-value" class="bar-value"></span>
          </div>
        </div>
        <div class="status-bar">
          <label>Stamina:</label>
          <div class="bar-container">
            <div id="stamina-bar" class="bar"></div>
            <span id="stamina-value" class="bar-value"></span>
          </div>
        </div>
        <div class="status-bar">
          <label>Moral:</label>
          <div class="bar-container">
            <div id="moral-bar" class="bar"></div>
            <span id="moral-value" class="bar-value"></span>
          </div>
        </div>
        <p><strong>Salariu:</strong> <span id="player-salary"></span></p>
        <p><strong>Contract:</strong> <span id="player-contract"></span></p>
      </div>
    </div>
  `;
  facilities.innerHTML = `
    <div class="facility-card">
      <h3>Stadion (Nivel ${gameState.club.facilities.stadium.level})</h3>
      <p>Capacitate: ${gameState.club.facilities.stadium.capacity}</p>
      <p>Cost upgrade: ${gameState.club.facilities.stadium.cost.toLocaleString()} €</p>
      <button id="upgrade-stadium" class="button" ${gameState.club.budget < gameState.club.facilities.stadium.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <div class="facility-card">
      <h3>Antrenament (Nivel ${gameState.club.facilities.training.level})</h3>
      <p>Efect: +${gameState.club.facilities.training.effect} rating</p>
      <p>Cost upgrade: ${gameState.club.facilities.training.cost.toLocaleString()} €</p>
      <button id="upgrade-training" class="button" ${gameState.club.budget < gameState.club.facilities.training.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <div class="facility-card">
      <h3>Academie (Nivel ${gameState.club.facilities.academy.level})</h3>
      <p>Rating tineret: ${gameState.club.facilities.academy.youthRating}</p>
      <p>Cost upgrade: ${gameState.club.facilities.academy.cost.toLocaleString()} €</p>
      <button id="upgrade-academy" class="button" ${gameState.club.budget < gameState.club.facilities.academy.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <div class="facility-card">
      <h3>Recuperare (Nivel ${gameState.club.facilities.recovery.level})</h3>
      <p>Efect: +${gameState.club.facilities.recovery.recovery} stamina</p>
      <p>Cost upgrade: ${gameState.club.facilities.recovery.cost.toLocaleString()} €</p>
      <button id="upgrade-recovery" class="button" ${gameState.club.budget < gameState.club.facilities.recovery.cost || gameState.club.energy < 100 ? 'disabled' : ''}>Upgrade</button>
    </div>
    <button id="renegotiate-contracts" class="button">Renegociază contracte</button>
  `;

  const playerRows = document.querySelectorAll('.player-row');
  playerRows.forEach(row => {
    row.removeEventListener('click', handlePlayerClick);
    row.addEventListener('click', handlePlayerClick);
  });

  const closeModalButton = document.getElementById('close-modal');
  if (closeModalButton) {
    closeModalButton.removeEventListener('click', closeModal);
    closeModalButton.addEventListener('click', closeModal);
  }
  const modal = document.getElementById('player-modal');
  if (modal) {
    modal.removeEventListener('click', handleModalBackgroundClick);
    modal.addEventListener('click', handleModalBackgroundClick);
    modal.classList.add('hidden');
  }
}

function handlePlayerClick(event) {
  const playerId = event.currentTarget.dataset.id;
  const player = gameState.players.find(p => p.id == playerId);
  if (player) {
    showPlayerModal(player);
  } else {
    console.error(`Jucător cu ID ${playerId} nu a fost găsit`);
  }
}

function handleModalBackgroundClick(event) {
  if (event.target.id === 'player-modal') {
    closeModal();
  }
}

function closeModal() {
  const modal = document.getElementById('player-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showPlayerModal(player) {
  if (!player) {
    console.error('Jucătorul este null sau undefined');
    return;
  }
  const modal = document.getElementById('player-modal');
  if (!modal) {
    console.error('Elementul #player-modal nu a fost găsit');
    return;
  }
  document.getElementById('player-name').textContent = player.name || 'N/A';
  document.getElementById('player-position').textContent = player.position || 'N/A';
  document.getElementById('player-salary').textContent = `${(player.salary || 0).toLocaleString()} €`;
  document.getElementById('player-contract').textContent = `${player.contractYears || 0} ani`;
  updateStatusBar('rating', player.rating || 0);
  updateStatusBar('stamina', player.stamina || 0);
  updateStatusBar('moral', player.morale || 0);
  modal.classList.remove('hidden');
}

function updateStatusBar(type, value) {
  const bar = document.getElementById(`${type}-bar`);
  const valueSpan = document.getElementById(`${type}-value`);
  if (!bar || !valueSpan) {
    console.error(`Elementele pentru ${type}-bar sau ${type}-value lipsesc`);
    return;
  }
  const width = Math.min(value, 100);
  const color = value >= 70 ? '#00ff00' : value >= 40 ? '#ffff00' : '#ff0000';
  bar.style.width = `${width}%`;
  bar.style.backgroundColor = color;
  valueSpan.textContent = value;
}

export function upgradeFacility(type) {
  const facility = gameState.club.facilities[type];
  if (gameState.club.budget >= facility.cost && gameState.club.energy >= 100) {
    gameState.club.budget -= facility.cost;
    gameState.club.energy -= 100;
    facility.level++;
    facility.cost = Math.floor(facility.cost * 1.5);
    if (type === 'stadium') {
      facility.capacity += 5000;
    } else if (type === 'training') {
      facility.effect += 2;
    } else if (type === 'academy') {
      facility.youthRating += 10;
    } else if (type === 'recovery') {
      facility.recovery += 5;
      gameState.players.forEach(p => {
        p.stamina = Math.min(p.stamina + 5, 100);
      });
    }
    if (gameState.season.phase === 'offseason') {
      facility.cost = Math.floor(facility.cost * 0.85);
    }
    saveGame();
    showMessage(`Facilitatea ${type} upgradată la nivel ${facility.level}!`, 'success');
    renderTeam();
  } else {
    showMessage('Buget sau energie insuficientă!', 'error');
  }
}

export function renegotiateContracts() {
  const expiring = gameState.players.filter(p => p.contractYears < 1);
  if (expiring.length === 0) {
    showMessage('Niciun jucător cu contract expirat!', 'info');
    return;
  }
  if (gameState.club.energy >= 100) {
    gameState.club.energy -= 100;
    let totalCost = 0;
    expiring.forEach(p => {
      const newSalary = Math.floor(p.salary * 1.2);
      if (gameState.club.budget >= newSalary) {
        p.salary = newSalary;
        p.contractYears = 2;
        p.morale = Math.min(p.morale + 10, 100);
        totalCost += newSalary;
      }
    });
    gameState.club.budget -= totalCost;
    saveGame();
    showMessage(`Contracte renegociate! Cost total: ${totalCost.toLocaleString()} €`, 'success');
    renderTeam();
  } else {
    showMessage('Energie insuficientă!', 'error');
  }
}
