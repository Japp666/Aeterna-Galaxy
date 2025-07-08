import { getGameState, updateGameState, saveGameState } from './game-state.js';
import {
  renderPitch,
  placePlayersInPitchSlots
} from './pitch-renderer.js';
import { formations } from './formations-data.js';

export async function loadTacticsTabContent() {
  const r = await fetch('components/tactics.html');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

export function initTacticsTab() {
  const s      = getGameState();
  const formEl = document.getElementById('formation-buttons');
  const mentEl = document.getElementById('mentality-buttons');
  const pitch  = document.getElementById('football-pitch');
  const avail  = document.getElementById('available-players-list');
  const autoB  = document.getElementById('auto-arrange-btn');

  formEl.innerHTML = '';
  Object.keys(formations).forEach(f=>{
    if (f==='GK') return;
    const btn = document.createElement('button');
    btn.textContent = f;
    btn.className   = 'btn formation-button';
    if (s.currentFormation===f) btn.classList.add('active');
    btn.onclick     = ()=>{
      s.currentFormation = f;
      s.teamFormation    = {};
      updateGameState(s);
      refresh();
    };
    formEl.appendChild(btn);
  });

  mentEl.querySelectorAll('button.btn').forEach(b=>{
    const m = b.textContent.toLowerCase();
    if (s.currentMentality===m) b.classList.add('active');
    b.onclick = ()=>{
      s.currentMentality = m;
      updateGameState(s);
      refresh();
    };
  });

  autoB.onclick = ()=>{
    const sorted = [...s.players].sort((a,b)=>b.overall-a.overall);
    formations[s.currentFormation].forEach((slot,i)=>{
      s.teamFormation[slot.pos] = sorted[i]?.id||null;
    });
    updateGameState(s);
    refresh();
  };

  function refresh(){
    renderPitch(pitch,s.currentFormation,s.currentMentality);
    placePlayersInPitchSlots(pitch,s.teamFormation,avail,s.players);
    saveGameState();
  }

  refresh();
}
