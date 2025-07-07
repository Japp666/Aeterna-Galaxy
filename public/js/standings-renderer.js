// public/js/standings-renderer.js

import {
  getGameState,
  saveGameState,
  calculateStandings,
  finalizeSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadStandingsTabContent() {
  return await fetch('components/standings.html')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });
}

export function initStandingsTab() {
  const state = getGameState();
  const divIdx = (state.currentDivision || 1) - 1;
  const division = state.divisions[divIdx];
  if (!division) {
    showError('Divizie invalidă.');
    return;
  }

  document.getElementById('division-level').textContent = division.level;

  const tbody = document.getElementById('standings-table-body');
  tbody.innerHTML = '';

  calculateStandings(division).forEach((team, i) => {
    const codeMatch = team.emblemUrl.match(/emblema(\d+)\.png$/);
    const code = codeMatch ? String(Number(codeMatch[1])).padStart(2,'0') : '01';
    const url = `img/emblems/emblema${code}.png`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>
        <img src="${url}" class="table-emblem" alt="" 
             onerror="this.onerror=null;this.src='img/emblems/emblema01.png';">
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

  const btn = document.getElementById('finalize-season-btn');
  if (btn && !btn._init) {
    btn.addEventListener('click', () => {
      finalizeSeason();
      saveGameState();
      showSuccess('Sezon finalizat.');
      initStandingsTab();
    });
    btn._init = true;
  }

  showSuccess('Clasament încărcat.');
}
