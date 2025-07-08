// public/js/standings-renderer.js
import {
  getGameState,
  saveGameState,
  calculateStandings,
  finalizeSeason
} from './game-state.js';
import { showError, showSuccess } from './notification.js';

export async function loadStandingsTabContent() {
  const r = await fetch('components/standings.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initStandingsTab() {
  const s = getGameState();
  const idx = (s.currentDivision||1)-1;
  const div = s.divisions[idx];
  if (!div) return showError('Divizie invalidă.');

  document.getElementById('division-level').textContent = div.level;
  const tbody = document.getElementById('standings-table-body');
  tbody.innerHTML='';

  calculateStandings(div).forEach((t,i)=>{
    const m = t.emblemUrl.match(/emblema(\d+)\.png$/);
    const c = m?String(Number(m[1])).padStart(2,'0'):'01';
    const url = `img/emblems/emblema${c}.png`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>
        <img src="${url}" class="table-emblem" alt="" 
             onerror="this.onerror=null;this.src='img/emblems/emblema01.png';">
        ${t.name}
      </td>
      <td>${t.stats.played}</td>
      <td>${t.stats.won}</td>
      <td>${t.stats.draw}</td>
      <td>${t.stats.lost}</td>
      <td>${t.stats.pts}</td>
    `;
    tbody.appendChild(tr);
  });

  const b = document.getElementById('finalize-season-btn');
  if (b && !b._init) {
    b.onclick = ()=>{
      finalizeSeason();
      saveGameState();
      initStandingsTab();
      showSuccess('Sezon finalizat.');
    };
    b._init = true;
  }
  showSuccess('Clasament încărcat.');
}
