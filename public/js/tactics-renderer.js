// public/js/tactics-renderer.js

import { getGameState, updateGameState, saveGameState } from './game-state.js';
import {
  renderPitch,
  placePlayersInPitchSlots,
  renderAvailablePlayers
} from './pitch-renderer.js';
import { formations, MENTALITY_ADJUSTMENTS } from './formations-data.js';

/**
 * Încarcă componenta HTML a tab-ului Tactică.
 */
export async function loadTacticsTabContent() {
  const res = await fetch('components/tactics.html');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/**
 * Inițializează logica tab-ului Tactică.
 */
export function initTacticsTab() {
  const state   = getGameState();
  const formBtn = document.getElementById('formation-buttons');
  const mentBtn = document.getElementById('mentality-buttons');
  const pitch   = document.getElementById('football-pitch');
  const avail   = document.getElementById('available-players-list');
  const autoBtn = document.getElementById('auto-arrange-btn');

  // 1) Botoane formație
  formBtn.innerHTML = '';
  Object.keys(formations).forEach(f => {
    if (f === 'GK') return;
    const b = document.createElement('button');
    b.textContent = f;
    b.className = 'btn formation-button';
    if (state.currentFormation === f) b.classList.add('active');
    b.onclick = () => {
      state.currentFormation = f;
      state.teamFormation = {};
      updateGameState(state);
      refresh();
    };
    formBtn.appendChild(b);
  });

  // 2) Butoane mentalitate
  mentBtn.querySelectorAll('button.btn').forEach(b => {
    const m = b.textContent.toLowerCase();
    if (state.currentMentality === m) b.classList.add('active');
    b.onclick = () => {
      state.currentMentality = m;
      updateGameState(state);
      refresh();
    };
  });

  // 3) Auto-arrange
  autoBtn.onclick = () => {
    const sorted = [...state.players].sort((a,b)=>b.overall - a.overall);
    formations[state.currentFormation].forEach((slot, i) => {
      state.teamFormation[slot.pos] = sorted[i]?.id || null;
    });
    updateGameState(state);
    refresh();
  };

  // 4) Funcția care re-randează teren și listă
  function refresh() {
    renderPitch(pitch, state.currentFormation, state.currentMentality);
    placePlayersInPitchSlots(pitch, state.teamFormation, avail, state.players);
    saveGameState();
  }

  // apel inițial
  refresh();
}
