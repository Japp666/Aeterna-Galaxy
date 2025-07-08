// public/js/game-ui.js

import { getGameState, resetGameState } from './game-state.js';
import { initSetupScreen }    from './setup.js';
import { showError, showSuccess } from './notification.js';

import { initDashboardTab, loadDashboardTabContent } from './dashboard-renderer.js';
import { initStandingsTab, loadStandingsTabContent } from './standings-renderer.js';
import { initFixturesTab, loadFixturesTabContent }   from './fixtures-renderer.js';
import { initTacticsTab, loadTacticsTabContent }     from './tactics-renderer.js';
import { initSquadTab, loadSquadTabContent }         from './squad-renderer.js';

const TABS = [
  { key:'dashboard', label:'Dashboard',   loader: loadDashboardTabContent,  init:initDashboardTab },
  { key:'standings', label:'Clasament',   loader: loadStandingsTabContent, init:initStandingsTab },
  { key:'fixtures',  label:'Calendar',    loader: loadFixturesTabContent,  init:initFixturesTab },
  { key:'tactics',   label:'Tactică',     loader: loadTacticsTabContent,   init:initTacticsTab },
  { key:'squad',     label:'Lot',         loader: loadSquadTabContent,     init:initSquadTab }
];

let menuButtons = {};

export function initializeGame() {
  const hdr = document.getElementById('game-header');
  const cnt = document.getElementById('game-content');
  const s   = getGameState();

  if (!s.isGameStarted) {
    hdr.style.display = 'none';
    fetch('components/setup.html')
      .then(r=>r.ok?r.text():Promise.reject(r.status))
      .then(html=> {
        cnt.innerHTML = html;
        initSetupScreen(onSetupComplete);
      });
  } else {
    hdr.style.display = 'flex';
    updateHeader();
    renderUI();
  }

  const rb = document.getElementById('reset-game-button');
  if (rb) rb.onclick = ()=> {
    if (confirm('Resetezi progresul?')) resetGameState();
  };
}

function onSetupComplete() {
  document.getElementById('game-header').style.display = 'flex';
  updateHeader();
  renderUI();
}

function updateHeader() {
  const s = getGameState();
  document.getElementById('header-club-emblem').src = s.club.emblemUrl;
  document.getElementById('header-club-name').textContent = s.club.name;
  document.getElementById('header-coach-nickname').textContent = s.coach.nickname;
  document.getElementById('header-club-funds').textContent =
    new Intl.NumberFormat('ro-RO').format(s.club.funds) + ' €';
}

function renderUI() {
  const cnt = document.getElementById('game-content');
  cnt.innerHTML = `
    <div class="menu-bar">
      ${TABS.map(t=>`<div class="menu-button" data-tab="${t.key}">${t.label}</div>`).join('')}
    </div>
    <div id="tab-content"></div>
  `;
  menuButtons = {};
  document.querySelectorAll('.menu-button').forEach(b=>{
    const key = b.dataset.tab;
    menuButtons[key]=b;
    b.onclick = ()=>displayTab(key);
  });
  displayTab('dashboard');
}

async function displayTab(key) {
  Object.values(menuButtons).forEach(b=>b.classList.remove('active'));
  menuButtons[key]?.classList.add('active');

  const tab = TABS.find(t=>t.key===key);
  if (!tab) return showError('Tab necunoscut: ' + key);

  const cont = document.getElementById('tab-content');
  try {
    const html = await tab.loader();
    cont.innerHTML = html;
    tab.init();
    showSuccess(tab.label + ' încărcat.');
  } catch (e) {
    console.error(e);
    showError('Eroare la ' + tab.label);
  }
}

document.addEventListener('DOMContentLoaded', initializeGame);
