import { getGameState, calculateStandings } from './game-state.js';

export async function loadStandingsTabContent() {
  const r = await fetch('components/standings.html');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export function initStandingsTab() {
  const s   = getGameState();
  const div = s.divisions[s.currentDivision - 1];
  if (!div) return;

  const lvl = document.getElementById('division-level');
  const tb  = document.getElementById('standings-table-body');
  lvl.textContent = div.level;
  tb.innerHTML = '';

  calculateStandings(div).forEach((team, i) => {
    const tr = document.createElement('tr');
    if (i < 2)      tr.classList.add('promote');
    else if (i < 6) tr.classList.add('playoff');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${team.name}</td>
      <td>${team.stats.played}</td>
      <td>${team.stats.won}</td>
      <td>${team.stats.draw}</td>
      <td>${team.stats.lost}</td>
      <td>${team.stats.pts}</td>
    `;
    tb.appendChild(tr);
  });
}
