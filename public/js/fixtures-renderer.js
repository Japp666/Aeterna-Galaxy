// public/js/fixtures-renderer.js
import { getGameState, saveGameState } from './game-state.js';

export async function loadFixturesTabContent() {
  const r = await fetch('components/matches.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initFixturesTab() {
  const s = getGameState();
  const div = s.divisions[s.currentDivision-1];
  if (!div || !div.schedule) return;

  const day = s.currentDay;
  document.getElementById('matchday-number').textContent = day;

  const list = document.getElementById('fixtures-list');
  list.innerHTML = '';

  (div.schedule[day-1] || []).forEach(m => {
    const home = div.teams.find(t=>t.id===m.homeId);
    const away = div.teams.find(t=>t.id===m.awayId);
    if (home && away) {
      const li = document.createElement('li');
      li.textContent = `${home.name} vs ${away.name}`;
      list.appendChild(li);
    }
  });
}
