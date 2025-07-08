// public/js/standings-renderer.js
import {
  getGameState,
  saveGameState,
  calculateStandings,
  finalizeSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadStandingsTabContent() {
  const res = await fetch('components/standings.html');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function initStandingsTab() {
  const state = getGameState();
  const divIdx = (state.currentDivision || 1) - 1;
  const division = state.divisions[divIdx];
  if (!division) {
    showError('Divizie invalidă.');
    return;
  }

  // Setăm nivelul diviziei
  const lvlEl = document.getElementById('division-level');
  if (!lvlEl) {
    showError('Elementul #division-level lipsă.');
    return;
  }
  lvlEl.textContent = division.level;

  // Populăm tabelul
  const tbody = document.getElementById('standings-table-body');
  if (!tbody) {
    showError('Elementul #standings-table-body lipsă.');
    return;
  }
  tbody.innerHTML = '';

  calculateStandings(division).forEach((team, i) => {
    const match = team.emblemUrl.match(/emblema(\d+)\.png$/);
    const code  = match ? String(Number(match[1])).padStart(2,'0') : '01';
    const url   = `img/emblems/emblema${code}.png`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>
        <img src="${url}"
             class="table-emblem"
             alt=""
             onerror="this.onerror=null;this.src='img/emblems/emblema01.png';"
        >
        ${team.name}
      </td>
      <td>${team.stats.played}</td>
      <td>${team.stats.won}</td>
      <td>${team.stats.draw}</td>
      <td>${team.stats.lost}</td>
      <td>${team.stats.pts}</td>
    `;
    tbody.appendChild(tr);
  });

  // Buton finalizează sezon
  const btn = document.getElementById('finalize-season-btn');
  if (btn && !btn._init) {
    btn.addEventListener('click', () => {
      finalizeSeason();
      saveGameState();
      initStandingsTab();
      showSuccess('Sezon finalizat.');
    });
    btn._init = true;
  }

  showSuccess('Clasament încărcat.');
}
