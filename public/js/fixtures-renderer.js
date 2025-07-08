import { getGameState } from './game-state.js';

export async function loadFixturesTabContent() {
  const r = await fetch('components/matches.html');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export function initFixturesTab() {
  const s   = getGameState();
  const div = s.divisions[s.currentDivision - 1];
  if (!div) return;

  const dayEl = document.getElementById('matchday-number');
  const list  = document.getElementById('fixtures-list');
  dayEl.textContent = s.currentDay;
  list.innerHTML = '';

  (div.schedule[s.currentDay - 1] || []).forEach(m => {
    const home = div.teams.find(t => t.id === m.homeId);
    const away = div.teams.find(t => t.id === m.awayId);
    if (home && away) {
      const li = document.createElement('li');
      li.textContent = `${home.name} vs ${away.name}`;
      list.appendChild(li);
    }
  });
}
