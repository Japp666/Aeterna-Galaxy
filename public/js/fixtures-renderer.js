// public/js/fixtures-renderer.js
import {
  getGameState,
  saveGameState,
  simulateDay,
  simulateSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadFixturesTabContent() {
  const r = await fetch('components/matches.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initFixturesTab() {
  const s = getGameState();
  const div = s.divisions[s.currentDivision-1];
  const sched = div?.schedule;
  if (!sched) return showError('Calendarul nu există.');

  const day = s.currentDay;
  document.getElementById('matchday-number').textContent = day;
  const list = document.getElementById('fixtures-list');
  list.innerHTML='';

  sched[day-1].forEach(m=>{
    const li = document.createElement('li');
    li.textContent = `${m.home.name} vs ${m.away.name}`;
    list.appendChild(li);
  });

  document.getElementById('simulate-day-btn').onclick = ()=>{
    simulateDay(); saveGameState(); initFixturesTab(); showSuccess(`Ziua ${day} simulată.`);
  };
  document.getElementById('simulate-season-btn').onclick = ()=>{
    simulateSeason(); saveGameState(); initFixturesTab(); showSuccess('Sezon simul עליו.');
  };
}
