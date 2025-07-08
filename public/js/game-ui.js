// public/js/game-ui.js

import { getGameState, resetGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { showError, showSuccess } from './notification.js';

import { loadDashboardTabContent, initDashboardTab } from './dashboard-renderer.js';
import { loadStandingsTabContent, initStandingsTab } from './standings-renderer.js';
import { loadFixturesTabContent, initFixturesTab } from './fixtures-renderer.js';
import { loadTacticsTabContent, initTacticsTab } from './tactics-renderer.js';
import { loadSquadTabContent, initSquadTab } from './squad-renderer.js';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', loader: loadDashboardTabContent, init: initDashboardTab },
  { key: 'standings', label: 'Clasament', loader: loadStandingsTabContent, init: initStandingsTab },
  { key: 'fixtures',  label: 'Calendar',  loader: loadFixturesTabContent,  init: initFixturesTab },
  { key: 'tactics',   label: 'Tactică',   loader: loadTacticsTabContent,   init: initTacticsTab },
  { key: 'squad',     label: 'Lot',       loader: loadSquadTabContent,     init: initSquadTab }
];

let menuButtons = {};

export function initializeGame() {
  const header  = document.getElementById('game-header');
  const content = document.getElementById('game-content');
  const state   = getGameState();

  if (!state.isGameStarted) {
    header.style.display = 'none';
    fetch('components/setup.html')
      .then(r => r.ok ? r.text() : Promise.reject(`HTTP ${r.status}`))
      .then(html => {
        content.innerHTML = html;
        initSetupScreen(onSetupComplete);
        showSuccess('Setup inițial afișat.');
      })
      .catch(err => {
        console.error('Eroare la încărcarea setup:', err);
        showError('Nu s-a putut încărca ecranul de configurare.');
      });
  } else {
    header.style.display = 'flex';
    updateHeaderInfo();
    renderGameUI();
  }

  const resetBtn = document.getElementById('reset-game-button');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Ești sigur că vrei să resetezi progresul?')) {
        resetGameState();
      }
    };
  }
}

function onSetupComplete() {
  document.getElementById('game-header').style.display = 'flex';
  updateHeaderInfo();
  renderGameUI();
}

function updateHeaderInfo() {
  const state = getGameState();
  document.getElementById('header-club-emblem').src = state.club.emblemUrl;
  document.getElementById('header-club-name').textContent = state.club.name;
  document.getElementById('header-coach-nickname').textContent = state.coach.nickname;
  document.getElementById('header-club-funds').textContent =
    new Intl.NumberFormat('ro-RO').format(state.club.funds) + ' €';
}

function renderGameUI() {
  const content = document.getElementById('game-content');
  content.innerHTML = `
    <div class="menu-bar">
      ${TABS.map(t =>
        `<div class="menu-button" data-tab="${t.key}">${t.label}</div>`
      ).join('')}
    </div>
    <div id="tab-content"></div>
  `;

  menuButtons = {};
  document.querySelectorAll('.menu-button').forEach(btn => {
    const tabKey = btn.dataset.tab;
    menuButtons[tabKey] = btn;
    btn.addEventListener('click', () => displayTab(tabKey));
  });

  displayTab('dashboard');
}

async function displayTab(tabKey) {
  const tabDef = TABS.find(t => t.key === tabKey);
  if (!tabDef) {
    showError(`Tab necunoscut: ${tabKey}`);
    return;
  }

  Object.values(menuButtons).forEach(btn => btn.classList.remove('active'));
  menuButtons[tabKey]?.classList.add('active');

  const container = document.getElementById('tab-content');
  try {
    const html = await tabDef.loader();
    container.innerHTML = html;
    tabDef.init();
    showSuccess(`${tabDef.label} încărcat cu succes.`);
  } catch (error) {
    console.error(`Eroare la încărcarea tab-ului "${tabDef.label}":`, error);
    container.innerHTML = `<p class="error-message">Eroare la încărcarea "${tabDef.label}".</p>`;
  }
}

document.addEventListener('DOMContentLoaded', initializeGame);
