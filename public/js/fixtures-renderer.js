// public/js/fixtures-renderer.js

import {
  getGameState,
  saveGameState,
  simulateDay,
  simulateSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadFixturesTabContent() {
  try {
    const res = await fetch('components/matches.html');
    if (!res.ok) throw new Error(res.status);
    return await res.text();
  } catch (err) {
    console.error(err);
    showError('Nu am putut încărca tab-ul Meciuri.');
    return `<p class="error-message">Eroare: ${err.message}</p>`;
  }
}

export function initFixturesTab() {
  try {
    const state = getGameState();
    const day = state.currentDay;
    const total = state.divisions[0].schedule.length;
    if (day > total) {
      showError('Sezon încheiat.');
      return;
    }

    document.getElementById('matchday-number').textContent = day;
    const list = document.getElementById('fixtures-list');
    list.innerHTML = '';

    // afișăm divizia 1 – poți extinde pentru toate
    const fixtures = state.divisions[0].schedule[day - 1];
    fixtures.forEach(f => {
      const li = document.createElement('li');
      li.textContent = `${f.home.name} ${f.home.stats.played}, ${f.away.name} ${f.away.stats.played}`;
      // poți aplica stiluri sau formulă mai detaliată
      list.appendChild(li);
    });

    // buton Simulate Day
    const dayBtn = document.getElementById('simulate-day-btn');
    dayBtn.onclick = () => {
      simulateDay();
      showSuccess(`Ziua ${day} simulată.`);
      initFixturesTab();
    };

    // buton Simulate Season
    const seasonBtn = document.getElementById('simulate-season-btn');
    seasonBtn.onclick = () => {
      simulateSeason();
      showSuccess('Sezonul a fost simulаt complet.');
      initFixturesTab();
    };

  } catch (err) {
    console.error(err);
    showError('Eroare la inițializarea Meciurilor.');
  }
}
