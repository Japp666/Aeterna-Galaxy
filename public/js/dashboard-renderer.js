// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';
import { showSuccess } from './notification.js';

export async function loadDashboardTabContent() {
  return await fetch('components/dashboard.html')
    .then(r => r.ok ? r.text() : Promise.reject(`HTTP ${r.status}`));
}

export function initDashboardTab() {
  const state = getGameState();
  document.getElementById('coach-name-display').textContent = state.coach.nickname;
  document.getElementById('club-name-display').textContent  = state.club.name;
  document.getElementById('club-funds-display').textContent = 
    new Intl.NumberFormat('ro-RO').format(state.club.funds);
  showSuccess('Dashboard actualizat.');
}
