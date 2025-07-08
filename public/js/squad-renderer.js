import { getGameState } from './game-state.js';

export async function loadSquadTabContent() {
  const r = await fetch('components/roster-tab.html');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export function initSquadTab() {
  const s    = getGameState();
  const body = document.getElementById('roster-table-body');
  body.innerHTML = '';

  s.players.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.initials}</td>
      <td>${p.name}</td>
      <td>${p.position}</td>
      <td>${p.overall} ${'★'.repeat(p.stars)}${'☆'.repeat(6-p.stars)}</td>
    `;
    body.appendChild(tr);
  });
}
