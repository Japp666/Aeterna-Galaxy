// public/js/roster-renderer.js

import { getGameState } from './game-state.js';
import { POSITION_MAP } from './tactics-data.js';
import { getRarity, getStars } from './player-generator.js';
import { showError, showSuccess } from './notification.js'; // nou

// Încarcă HTML-ul pentru tabul Roster
export async function loadRosterTabContent() {
  try {
    const response = await fetch('components/roster-tab.html');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
  } catch (err) {
    console.error('roster-renderer.js: Eroare la încărcare:', err);
    showError('Eroare la încărcarea lotului de jucători.');
    return `<p class="error-message">Eroare la încărcare: ${err.message}</p>`;
  }
}

// Afișează jucătorii în tabel
export function initRosterTab() {
  const gameState = getGameState();
  const rosterBody = document.getElementById('roster-table-body');
  const modal = document.getElementById('player-details-modal');
  const modalClose = document.getElementById('player-details-close-btn');

  if (!rosterBody) {
    showError('Elementul tabelului de jucători nu a fost găsit.');
    return;
  }

  if (modal && modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  rosterBody.innerHTML = '';

  const sortedPlayers = [...gameState.players].sort((a, b) => b.overall - a.overall);

  if (sortedPlayers.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="5" class="no-players-message">Nu există jucători în lot.</td>`;
    rosterBody.appendChild(row);
    return;
  }

  sortedPlayers.forEach(player => {
    const tr = document.createElement('tr');
    tr.dataset.playerId = player.id;
    tr.setAttribute('role', 'button');
    tr.setAttribute('tabindex', '0');
    tr.addEventListener('click', () => showPlayerDetails(player));

    const stars = getStars(player.overall);
    let starHtml = '';
    for (let i = 0; i < 6; i++) {
      starHtml += `<i class="${i < stars ? 'fas filled-star' : 'far empty-star'} fa-star"></i>`;
    }

    const posText = player.playablePositions.map(p => POSITION_MAP[p] || p).join(', ');

    tr.innerHTML = `
      <td>
        <div class="player-initials-circle-roster-table">
          <span class="player-initials-roster">${player.initials}</span>
          <span class="player-pos-initial-roster">${player.position}</span>
        </div>
      </td>
      <td>${player.name}</td>
      <td>${posText}</td>
      <td><span class="ovr-value">${Math.round(player.overall)}</span></td>
      <td><div class="player-stars-table">${starHtml}</div></td>
    `;

    rosterBody.appendChild(tr);
  });

  showSuccess('Lotul de jucători a fost încărcat cu succes.');
}

// Afișează modalul cu detalii despre jucător
function showPlayerDetails(player) {
  const modal = document.getElementById('player-details-modal');
  if (!modal) {
    showError('Modalul de jucător nu a fost găsit.');
    return;
  }

  document.getElementById('modal-player-name').textContent = player.name;
  document.getElementById('modal-player-age').textContent = Math.round(player.age);
  document.getElementById('modal-player-position').textContent = POSITION_MAP[player.position] || player.position;
  document.getElementById('modal-player-team').textContent = getGameState().club.name;

  const rarityTag = document.getElementById('modal-player-rarity');
  rarityTag.textContent = player.rarity.toUpperCase();
  rarityTag.className = `player-rarity-tag rarity-${player.rarity}`;

  const potentialTag = document.getElementById('modal-player-potential');
  potentialTag.textContent = player.potential.toUpperCase();
  potentialTag.className = `player-potential-tag rarity-${player.potential}`;

  document.querySelector('.player-modal-initials').textContent = player.initials;
  document.querySelector('.player-modal-ovr').textContent = `OVR ${Math.round(player.overall)}`;

  const stars = getStars(player.overall);
  const container = modal.querySelector('.player-stars-rating');
  container.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const icon = document.createElement('i');
    icon.className = `${i < stars ? 'fas filled-star' : 'far empty-star'} fa-star`;
    container.appendChild(icon);
  }

  if (player.attributes) {
    document.getElementById('attr-deposedare').textContent = Math.round(player.attributes.defensiv.deposedare);
    document.getElementById('attr-marcaj').textContent = Math.round(player.attributes.defensiv.marcaj);
    document.getElementById('attr-pozitionare').textContent = Math.round(player.attributes.defensiv.pozitionare);
    document.getElementById('attr-lovitura_de_cap').textContent = Math.round(player.attributes.defensiv.lovitura_de_cap);
    document.getElementById('attr-curaj').textContent = Math.round(player.attributes.defensiv.curaj);

    document.getElementById('attr-pase').textContent = Math.round(player.attributes.ofensiv.pase);
    document.getElementById('attr-dribling').textContent = Math.round(player.attributes.ofensiv.dribling);
    document.getElementById('attr-centrari').textContent = Math.round(player.attributes.ofensiv.centrari);
    document.getElementById('attr-sutare').textContent = Math.round(player.attributes.ofensiv.sutare);
    document.getElementById('attr-finalizare').textContent = Math.round(player.attributes.ofensiv.finalizare);
    document.getElementById('attr-creativitate').textContent = Math.round(player.attributes.ofensiv.creativitate);

    document.getElementById('attr-vigoare').textContent = Math.round(player.attributes.fizic.vigoare);
    document.getElementById('attr-forta').textContent = Math.round(player.attributes.fizic.forta);
    document.getElementById('attr-agresivitate').textContent = Math.round(player.attributes.fizic.agresivitate);
    document.getElementById('attr-viteza').textContent = Math.round(player.attributes.fizic.viteza);
  }

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  modal.focus();
}
