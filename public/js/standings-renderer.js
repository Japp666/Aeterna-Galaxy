// public/js/standings-renderer.js

import {
  getGameState,
  saveGameState,
  calculateStandings,
  finalizeSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadStandingsTabContent() {
  // ...
}

export function initStandingsTab() {
  const state = getGameState();
  if (!state.divisions?.length) {
    showError('Nu există date de clasament.');
    return;
  }

  const division = state.divisions[0];
  const sorted   = calculateStandings(division);
  const tbody    = document.getElementById('standings-table-body');
  tbody.innerHTML = '';

  sorted.forEach((team, idx) => {
    // refacem codul cu padStart(2,'0')
    const m    = team.emblemUrl.match(/emblema(\d+)\.png$/);
    const code = m ? String(Number(m[1])).padStart(2, '0') : '01';
    const url  = `img/emblems/emblema${code}.png`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <img
          src="${url}"
          class="table-emblem"
          alt="${team.name}"
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

  showSuccess('Clasamentul a fost încărcat.');

  const btn = document.getElementById('finalize-season-btn');
  if (btn && !btn._init) {
    btn.addEventListener('click', () => {
      finalizeSeason();
      saveGameState();
      showSuccess(`Sezonul s-a încheiat, a început sezon ${getGameState().currentSeason}.`);
      initStandingsTab();
    });
    btn._init = true;
  }
}
