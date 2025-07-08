// public/js/squad-renderer.js

import { getGameState } from './game-state.js';

export async function loadSquadTabContent() {
  const r = await fetch('components/roster-tab.html');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export function initSquadTab() {
  const state = getGameState();
  const body  = document.getElementById('roster-table-body');
  const sortSel = document.getElementById('sort-squad');

  function render() {
    let arr = [...state.players];
    switch(sortSel.value) {
      case 'name':     arr.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'stars':    arr.sort((a,b)=>b.stars - a.stars); break;
      case 'position': arr.sort((a,b)=>a.position.localeCompare(b.position)); break;
    }

    body.innerHTML = '';
    arr.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.initials}</td>
        <td>${p.name}</td>
        <td>${p.position}</td>
        <td>${p.overall}</td>
        <td>${'★'.repeat(p.stars)}${'☆'.repeat(6 - p.stars)}</td>
      `;
      tr.onclick = () => showPlayerModal(p);
      body.appendChild(tr);
    });
  }

  sortSel.onchange = render;
  render();
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
        <span>Moral: ${p.morale || 'normal'}</span>
      </div>
      <div class="stars">${'★'.repeat(p.stars)}${'☆'.repeat(6 - p.stars)}</div>
      <button onclick="alert('Vezi oferte pentru ${p.name}')">Vezi oferte</button>
      <button onclick="alert('Pune la vânzare pe ${p.name}')">Vinde</button>
      <button onclick="document.getElementById('player-modal').classList.remove('show')">Închide</button>
    </div>
  `;
}
