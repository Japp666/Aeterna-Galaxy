// public/js/squad-renderer.js
import { getGameState } from './game-state.js';

export async function loadSquadTabContent() {
  const r = await fetch('components/roster-tab.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initSquadTab() {
  const s = getGameState();
  const body = document.getElementById('roster-table-body');
  body.innerHTML = '';

  s.players.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.initials}</td>
      <td>${p.name}</td>
      <td>${p.position}</td>
      <td>${p.overall}</td>
      <td>${'★'.repeat(p.stars)}${'☆'.repeat(6-p.stars)}</td>
    `;
    tr.onclick = () => showPlayerModal(p);
    body.appendChild(tr);
  });
}

function showPlayerModal(p) {
  // creați modalul din JS
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="player-modal">
      <h3>${p.name}</h3>
      <div class="stats">
        <span>Age: ${p.age}</span>
        <span>OVR: ${p.overall}</span>
        <span>Pot: ${p.potential}</span>
      </div>
      <div class="stars">${'★'.repeat(p.stars)}${'☆'.repeat(6-p.stars)}</div>
      <button id="offer-btn">Vezi oferte</button>
      <button id="sell-btn">Vinde</button>
      <button id="close-btn">Închide</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#close-btn').onclick = () => modal.remove();
  modal.querySelector('#offer-btn').onclick = () => alert('Oferte pentru ' + p.name);
  modal.querySelector('#sell-btn').onclick  = () => alert('Pui pe piață pe ' + p.name);
}
