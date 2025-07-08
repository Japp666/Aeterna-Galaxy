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
  const divIdx   = (state.currentDivision || 1) - 1;
  const division = state.divisions[divIdx];
  if (!division) {
    showError('Divizie invalidă.');
    return;
  }

  const schedule = division.schedule;
  if (!Array.isArray(schedule)) {
    showError('Calendarul nu există.');
    return;
  }

  const daySpan = document.getElementById('matchday-number');
  if (!daySpan) {
    showError('Elementul #matchday-number lipsă.');
    return;
  }
  const day = state.currentDay;
  daySpan.textContent = day;

  const list = document.getElementById('fixtures-list');
  if (!list) {
    showError('Elementul #fixtures-list lipsă.');
    return;
  }
  list.innerHTML = '';

  // Pentru fiecare meci, găsește echipele după ID
  (schedule[day - 1] || []).forEach(match => {
    const home = division.teams.find(t => t.id === match.homeId);
    const away = division.teams.find(t => t.id === match.awayId);
    if (home && away) {
      const li = document.createElement('li');
      li.textContent = `${home.name} vs ${away.name}`;
      list.appendChild(li);
    }
  });

  document.getElementById('simulate-day-btn').onclick = () => {
    simulateDay();
    saveGameState();
    initFixturesTab();
    showSuccess(`Ziua ${day} simulată.`);
  };

  document.getElementById('simulate-season-btn').onclick = () => {
    simulateSeason();
    saveGameState();
    initFixturesTab();
    showSuccess('Sezon complet simulat.');
  };
}
