import { getGameState, updateGameState, saveGameState } from './game-state.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { formations } from './formations-data.js';

export async function loadTacticsTabContent() {
  const res = await fetch('components/tactics.html');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function initTacticsTab() {
  const state = getGameState();
  const formBtns = document.getElementById('formation-buttons');
  const mentBtns = document.getElementById('mentality-buttons');
  const pitch    = document.getElementById('football-pitch');
  const list     = document.getElementById('available-players-list');
  const auto     = document.getElementById('auto-arrange-btn');

  formBtns.innerHTML = '';
  Object.keys(formations).filter(f => f !== 'GK').forEach(f => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = f;
    if (state.currentFormation === f) b.classList.add('active');
    b.onclick = () => {
      state.currentFormation = f;
      state.teamFormation = {};
      updateGameState(state);
      refresh();
    };
    formBtns.appendChild(b);
  });

  mentBtns.querySelectorAll('button.btn').forEach(b => {
    const m = b.textContent.toLowerCase();
    if (state.currentMentality === m) b.classList.add('active');
    b.onclick = () => {
      state.currentMentality = m;
      updateGameState(state);
      refresh();
    };
  });

  auto.onclick = () => {
    const sorted = [...state.players].sort((a,b) => b.overall - a.overall);
    formations[state.currentFormation].forEach((slot, i) => {
      state.teamFormation[slot.pos] = sorted[i]?.id || null;
    });
    updateGameState(state);
    refresh();
  };

  function refresh() {
    renderPitch(pitch, state.currentFormation, state.currentMentality);
    placePlayersInPitchSlots(pitch, state.teamFormation, list, state.players);
    saveGameState();
  }

  refresh();
}
