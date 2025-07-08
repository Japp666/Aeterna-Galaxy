// public/js/dashboard-renderer.js
import { getGameState } from './game-state.js';
import { showSuccess } from './notification.js';

export async function loadDashboardTabContent() {
  const r = await fetch('components/dashboard.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initDashboardTab() {
  const s = getGameState();
  document.getElementById('coach-name-display').textContent = s.coach.nickname;
  document.getElementById('club-name-display').textContent  = s.club.name;
  document.getElementById('club-funds-display').textContent =
    new Intl.NumberFormat('ro-RO').format(s.club.funds);
  showSuccess('Dashboard actualizat.');
}
