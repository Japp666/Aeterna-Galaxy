// public/js/tactics-renderer.js

import { getGameState, updateGameState } from './game-state.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { formations } from './formations-data.js';

export async function loadTacticsTabContent() {
  const r = await fetch('components/tactics.html');
  if (!r.ok) throw new Error(r.status);
  return r.text();
}

export function initTacticsTab() {
  const state = getGameState();
  const formBtn = document.getElementById('formation-buttons');
  const mentBtn = document.getElementById('mentality-buttons');
  const pitch   = document.getElementById('football-pitch');
  const avail   = document.getElementById('available-players-list');
  const autoBtn = document.getElementById('auto-arrange-btn');

  // Generează butoanele de formație
  formBtn.innerHTML = '';
  Object.keys(formations).forEach(f => {
    if (f==='GK') return;
    const b = document.createElement('button');
    b.textContent = f;
    if (state.currentFormation===f) b.classList.add('active');
    b.onclick = () => {
      state.currentFormation = f;
      updateGameState(state);
      refresh();
    };
    formBtn.appendChild(b);
  });

  // Mentalitate
  mentBtn.querySelectorAll('button.btn').forEach(b => {
    const m = b.textContent.toLowerCase();
    if (state.currentMentality===m) b.classList.add('active');
    b.onclick = () => {
      state.currentMentality = m;
      updateGameState(state);
      refresh();
    };
  });

  // Auto-arrange
  autoBtn.onclick = () => {
    const sorted = [...state.players].sort((a,b)=>b.overall-a.overall);
    formations[state.currentFormation].forEach((slot,i)=>{
      state.teamFormation[slot.pos] = sorted[i]?.id || null;
    });
    updateGameState(state);
    refresh();
  };

  function refresh() {
    renderPitch(pitch, state.currentFormation, state.currentMentality);
    placePlayersInPitchSlots(pitch, state.teamFormation, avail, state.players);
    renderAvailablePlayers(avail, state.players);
  }

  refresh();
}
