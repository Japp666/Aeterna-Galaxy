// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';
import { showSuccess } from './notification.js';

export async function loadDashboardTabContent() {
  const res = await fetch('components/dashboard.html');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function initDashboardTab() {
  const state = getGameState();
  document.getElementById('coach-name-display').textContent = state.coach.nickname;
  document.getElementById('club-name-display').textContent  = state.club.name;
  document.getElementById('club-funds-display').textContent =
    new Intl.NumberFormat('ro-RO').format(state.club.funds);
  showSuccess('Dashboard actualizat.');
}
