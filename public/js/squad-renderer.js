// public/js/squad-renderer.js
import { getGameState } from './game-state.js';
import { showSuccess } from './notification.js';

export async function loadSquadTabContent() {
  const r = await fetch('components/squad.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initSquadTab() {
  const s = getGameState();
  const ul = document.getElementById('squad-list');
  ul.innerHTML = '';
  s.players.forEach(p=>{
    const li = document.createElement('li');
    li.textContent = `${p.name} (${p.position}) – Rating: ${p.rating}`;
    ul.appendChild(li);
  });
  showSuccess('Lot încărcat.');
}
