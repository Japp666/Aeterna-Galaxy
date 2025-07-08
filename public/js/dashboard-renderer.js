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
  const nameEl = document.getElementById('coach-name-display');
  const clubEl = document.getElementById('club-name-display');
  const fundEl = document.getElementById('club-funds-display');

  if (!nameEl || !clubEl || !fundEl) {
    console.error('initDashboardTab: Elemente lipsă în dashboard.html');
    return;
  }

  nameEl.textContent = state.coach.nickname;
  clubEl.textContent = state.club.name;
  fundEl.textContent = new Intl.NumberFormat('ro-RO').format(state.club.funds);
  showSuccess('Dashboard actualizat.');
}
