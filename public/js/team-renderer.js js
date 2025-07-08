// public/js/team-renderer.js
import { getGameState } from './game-state.js';
import { showSuccess } from './notification.js';

export async function loadTeamsTabContent() {
  const r = await fetch('components/teams.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initTeamsTab() {
  const s = getGameState();
  const div = s.divisions[s.currentDivision-1];
  document.getElementById('team-division-level').textContent = div.level;
  const ul = document.getElementById('teams-list');
  ul.innerHTML = '';
  div.teams.forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<img src="${t.emblemUrl}" width="24" /> ${t.name}`;
    ul.appendChild(li);
  });
  showSuccess('Echipe încărcate.');
}
