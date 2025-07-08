// public/js/team-renderer.js
import { getGameState } from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadTeamsTabContent() {
  const res = await fetch('components/team.html');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function initTeamsTab() {
  const state = getGameState();
  const division = state.divisions[(state.currentDivision||1)-1];
  if (!division) {
    showError('Divizie invalidă.');
    return;
  }

  const lvl = document.getElementById('team-division-level');
  if (!lvl) {
    showError('Elementul #team-division-level lipsă.');
    return;
  }
  lvl.textContent = division.level;

  const ul = document.getElementById('teams-list');
  if (!ul) {
    showError('Elementul #teams-list lipsă.');
    return;
  }
  ul.innerHTML = '';

  division.teams.forEach(team => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${team.emblemUrl}" width="24" onerror="this.onerror=null;this.src='img/emblems/emblema01.png';" /> ${team.name}`;
    ul.appendChild(li);
  });

  showSuccess('Echipe încărcate.');
}
