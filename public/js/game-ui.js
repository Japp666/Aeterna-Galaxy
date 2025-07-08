// public/js/game-ui.js
import { getGameState, resetGameState } from './game-state.js';
import { initSetupScreen }           from './setup.js';
import { showSuccess, showError }    from './notification.js';

import {
  loadDashboardTabContent,
  initDashboardTab
} from './dashboard-renderer.js';

import {
  loadStandingsTabContent,
  initStandingsTab
} from './standings-renderer.js';

import {
  loadFixturesTabContent,
  initFixturesTab
} from './fixtures-renderer.js';

import {
  loadTeamsTabContent,
  initTeamsTab
} from './team-renderer.js';

import {
  loadSquadTabContent,
  initSquadTab
} from './squad-renderer.js';

const TABS = [
  {key:'dashboard',label:'Dashboard'},
  {key:'standings',label:'Clasament'},
  {key:'fixtures',label:'Calendar'},
  {key:'team',label:'Echipe'},
  {key:'squad',label:'Lot'}
];

let menuButtons = {};
export async function initializeGame() {
  const hdr= document.getElementById('game-header');
  const cont= document.getElementById('game-content');
  const state= getGameState();

  if (!state.isGameStarted) {
    hdr.style.display='none';
    const tpl = await fetch('components/setup.html').then(r=>r.ok?r.text():Promise.reject());
    cont.innerHTML = tpl;
    initSetupScreen(onSetupComplete);
    showSuccess('Setup afișat.');
  } else {
    hdr.style.display='flex';
    updateHeader();
    renderUI();
  }

  // Reset button
  const rb=document.getElementById('reset-game-button');
  if (rb) rb.onclick = ()=> {
    if (confirm('Reset progres?')) resetGameState();
  };
}

function onSetupComplete() {
  document.getElementById('game-header').style.display='flex';
  updateHeader();
  renderUI();
}

function updateHeader() {
  const s=getGameState();
  document.getElementById('header-club-emblem').src = s.club.emblemUrl;
  document.getElementById('header-club-name').textContent = s.club.name;
  document.getElementById('header-coach-nickname').textContent = s.coach.nickname;
  document.getElementById('header-club-funds').textContent =
    new Intl.NumberFormat('ro-RO').format(s.club.funds) + ' €';
}

function renderUI() {
  const cont=document.getElementById('game-content');
  cont.innerHTML = `
    <div class="menu-bar">
      ${TABS.map(t=>`<div class="menu-button" data-tab="${t.key}">${t.label}</div>`).join('')}
    </div>
    <div id="tab-content"></div>
  `;
  menuButtons = {};
  document.querySelectorAll('.menu-button').forEach(b=>{
    const tab=b.dataset.tab;
    menuButtons[tab]=b;
    b.onclick=()=>displayTab(tab);
  });
  displayTab('dashboard');
}

async function displayTab(tab) {
  Object.values(menuButtons).forEach(b=>b.classList.remove('active'));
  menuButtons[tab]?.classList.add('active');
  const cnt=document.getElementById('tab-content');
  try {
    switch(tab) {
      case 'dashboard':
        cnt.innerHTML = await loadDashboardTabContent();
        initDashboardTab(); break;
      case 'standings':
        cnt.innerHTML = await loadStandingsTabContent();
        initStandingsTab(); break;
      case 'fixtures':
        cnt.innerHTML = await loadFixturesTabContent();
        initFixturesTab(); break;
      case 'team':
        cnt.innerHTML = await loadTeamsTabContent();
        initTeamsTab(); break;
      case 'squad':
        cnt.innerHTML = await loadSquadTabContent();
        initSquadTab(); break;
    }
    showSuccess(`${tab.charAt(0).toUpperCase()+tab.slice(1)} încărcat.`);
  } catch(e) {
    console.error(e);
    showError(`Eroare la tab: ${tab}`);
  }
}
