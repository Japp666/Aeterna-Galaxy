import { getGameState } from './game-state.js';

export async function loadSquadTabContent() {
  const r = await fetch('components/roster-tab.html');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export function initSquadTab() {
  const state = getGameState();
  const tbody = document.getElementById('roster-table-body');
  tbody.innerHTML = '';

  state.players.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.initials}</td>
      <td>${p.name}</td>
      <td>${p.position}</td>
      <td>${p.overall}</td>
      <td>${'★'.repeat(p.stars)}${'☆'.repeat(6 - p.stars)}</td>
    `;
    tr.onclick = () => showPlayerModal(p);
    tbody.appendChild(tr);
  });
}

function showPlayerModal(p) {
  const modal = document.getElementById('player-modal');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="player-modal">
      <h3>${p.name}</h3>
      <div class="stats">
        <span>Vârstă: ${p.age}</span>
        <span>Poziție: ${p.position}</span>
        <span>OVR: ${p.overall}</span>
        <span>Potențial: ${p.potential}</span>
      </div>
      <div class="stars">${'★'.repeat(p.stars)}${'☆'.repeat(6 - p.stars)}</div>
      <button onclick="alert('Funcție: vezi oferte')">Vezi oferte</button>
      <button onclick="alert('Funcție: pune la vânzare')">Vinde</button>
      <button onclick="document.getElementById('player-modal').classList.remove('show')">Închide</button>
    </div>
  `;
}
