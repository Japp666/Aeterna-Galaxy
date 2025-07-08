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
  const div = state.divisions[0];
  const schedule = div.schedule;
  if (!Array.isArray(schedule)) {
    showError('Calendarul nu există.');
    return;
  }

  const day = state.currentDay;
  const total = schedule.length;
  if (day > total) {
    showError('Sezon încheiat.');
    return;
  }

  document.getElementById('matchday-number').textContent = day;

  const list = document.getElementById('fixtures-list');
  if (!list) {
    showError('Lista de meciuri missing.');
    return;
  }
  list.innerHTML = '';

  schedule[day - 1].forEach(f => {
    const li = document.createElement('li');
    li.textContent = `${f.home.name} vs ${f.away.name}`;
    list.appendChild(li);
  });

  const dayBtn = document.getElementById('simulate-day-btn');
  dayBtn.onclick = () => {
    simulateDay();
    saveGameState();
    showSuccess(`Ziua ${day} simulată.`);
    initFixturesTab();
  };

  const seasonBtn = document.getElementById('simulate-season-btn');
  seasonBtn.onclick = () => {
    simulateSeason();
    saveGameState();
    showSuccess('Sezon complet simulat.');
    initFixturesTab();
  };
}
