// public/js/tactics-renderer.js
import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { formations, MENTALITY_ADJUSTMENTS } from './formations-data.js';

export async function loadTacticsTabContent() {
  const r = await fetch('components/tactics.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initTacticsTab() {
  const s = getGameState();
  const btnsForm = document.getElementById('formation-buttons');
  const btnsMent = document.getElementById('mentality-buttons');
  const pitch    = document.getElementById('football-pitch');
  const avail    = document.getElementById('available-players-list');
  const autoBtn  = document.getElementById('auto-arrange-btn');

  // Generare butoane formație
  btnsForm.innerHTML = '';
  Object.keys(formations).filter(f=>f!=='GK').forEach(f=>{
    const b = document.createElement('button');
    b.textContent = f; b.classList.add('btn');
    if (s.currentFormation===f) b.classList.add('active');
    b.onclick = () => {
      s.currentFormation = f;
      s.teamFormation = {};
      updateGameState(s);
      refresh();
    };
    btnsForm.appendChild(b);
  });

  // Mentalitate
  btnsMent.querySelectorAll('button.btn').forEach(b=>{
    const m = b.textContent.toLowerCase();
    if (s.currentMentality===m) b.classList.add('active');
    b.onclick = () => {
      s.currentMentality = m;
      updateGameState(s);
      refresh();
    };
  });

  autoBtn.onclick = () => {
    // plasare auto (simplificat: primele jucători cei mai buni)
    const players = s.players.slice().sort((a,b)=>b.overall-a.overall);
    formations[s.currentFormation].forEach((slot,i)=>{
      s.teamFormation[slot.pos] = players[i]?.id || null;
    });
    updateGameState(s);
    refresh();
  };

  function refresh() {
    renderPitch(pitch, s.currentFormation, s.currentMentality);
    placePlayersInPitchSlots(pitch, s.teamFormation, avail, s.players);
    renderAvailablePlayers(avail, s.players);
    saveGameState();
  }

  // inițial
  refresh();
}
