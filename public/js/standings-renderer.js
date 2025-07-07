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
    console.error('standings-renderer.js:', err);
    showError('Nu am putut încărca Clasamentul.');
    return `<p class="error-message">Eroare: ${err.message}</p>`;
  }
}

export function initStandingsTab() {
  try {
    const state = getGameState();
    if (!state.divisions || !state.divisions.length) {
      showError('Nu există date de clasament.');
      return;
    }

    // Afișăm clasamentul pentru divizia 1 (nivelul 1)
    const division = state.divisions[0];
    const sorted = calculateStandings(division);

    const tbody = document.getElementById('standings-table-body');
    if (!tbody) {
      showError('Elementul pentru tabelul de clasament nu a fost găsit.');
      return;
    }
    tbody.innerHTML = '';

    sorted.forEach((team, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <img src="${team.emblemUrl}" class="table-emblem" alt="Emblemă">
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
    if (btn && !btn._initialized) {
      btn.addEventListener('click', () => {
        finalizeSeason();
        saveGameState();
        showSuccess('Sezonul a fost finalizat! A început un nou sezon.');
        initStandingsTab();
      });
      btn._initialized = true;
    }
  } catch (err) {
    console.error('standings init error', err);
    showError('Eroare la inițializarea Clasamentului.');
  }
}
