// public/js/standings-renderer.js

import {
  getGameState,
  saveGameState,
  calculateStandings,
  finalizeSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadStandingsTabContent() {
  try {
    const res = await fetch('components/standings.html');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(err);
    showError('Nu am putut încărca Clasamentul.');
    return `<p class="error-message">Eroare: ${err.message}</p>`;
  }
}

export function initStandingsTab() {
  try {
    const state = getGameState();
    const divIdx = (state.currentDivision || 1) - 1;
    const division = state.divisions[divIdx];
    if (!division) {
      showError('Divizie invalidă.');
      return;
    }

    const sorted = calculateStandings(division);
    const tbody = document.getElementById('standings-table-body');
    tbody.innerHTML = '';

    sorted.forEach((team, i) => {
      const codeMatch = team.emblemUrl.match(/emblema(\d+)\.png$/);
      const code = codeMatch
        ? String(Number(codeMatch[1])).padStart(2, '0')
        : '01';
      const url = `img/emblems/emblema${code}.png`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>
          <img
            src="${url}"
            class="table-emblem"
            alt="Emblemă"
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

    showSuccess(`Clasament Divizia ${division.level} încărcat.`);

    const btn = document.getElementById('finalize-season-btn');
    if (btn && !btn._initialized) {
      btn.addEventListener('click', () => {
        finalizeSeason();
        saveGameState();
        showSuccess('Sezonul s-a încheiat, a început sezonul nou.');
        initStandingsTab();
      });
      btn._initialized = true;
    }
  } catch (err) {
    console.error(err);
    showError('Eroare la inițializarea Clasamentului.');
  }
}
