// public/js/fixtures-renderer.js
import {
  getGameState,
  saveGameState,
  simulateDay,
  simulateSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadFixturesTabContent() {
  const res = await fetch('components/matches.html');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function initFixturesTab() {
  const state = getGameState();
  const div = state.divisions[(state.currentDivision||1)-1];
  const sched = div?.schedule;
  if (!sched) {
    showError('Calendarul nu există.');
    return;
  }

  const day = state.currentDay;
  const numEl = document.getElementById('matchday-number');
  if (!numEl) {
    showError('Elementul #matchday-number lipsă.');
    return;
  }
  numEl.textContent = day;

  const list = document.getElementById('fixtures-list');
  if (!list) {
    showError('Elementul #fixtures-list lipsă.');
    return;
  }
  list.innerHTML = '';

  (sched[day-1]||[]).forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.home.name} vs ${m.away.name}`;
    list.appendChild(li);
  });

  document.getElementById('simulate-day-btn').onclick = () => {
    simulateDay(); saveGameState(); initFixturesTab(); showSuccess(`Ziua ${day} simulată.`);
  };
  document.getElementById('simulate-season-btn').onclick = () => {
    simulateSeason(); saveGameState(); initFixturesTab(); showSuccess('Sezon complet simul at.');
  };
}
