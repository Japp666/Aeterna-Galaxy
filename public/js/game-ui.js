// public/js/game-ui.js

import { getGameState, resetGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { showError, showSuccess } from './notification.js';

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
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'standings', label: 'Clasament' },
  { key: 'fixtures',  label: 'Calendar' },
  { key: 'team',      label: 'Echipe' },
  { key: 'squad',     label: 'Lot' }
];

let menuButtons = {};

export async function initializeGame() {
  const header = document.getElementById('game-header');
  const area   = document.getElementById('notification-area');
  const content= document.getElementById('game-content');
  const state  = getGameState();

  if (!state.isGameStarted) {
    header.style.display = 'none';
    const tpl = await fetch('components/setup.html')
      .then(r => r.ok ? r.text() : Promise.reject(r.status));
    content.innerHTML = tpl;
    initSetupScreen(onSetupComplete);
    showSuccess('Afișat ecran de configurare.');
  } else {
    header.style.display = 'flex';
    updateHeaderInfo();
    renderGameUI();
  }

  // Reset button logic
  const resetBtn = document.getElementById('reset-game-button');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Resetezi progresul?')) {
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
  const s = getGameState();
  document.getElementById('header-club-emblem').src = s.club.emblemUrl;
  document.getElementById('header-club-name').textContent = s.club.name;
  document.getElementById('header-coach-nickname').textContent = s.coach.nickname;
  document.getElementById('header-club-funds').textContent =
    new Intl.NumberFormat('ro-RO').format(s.club.funds) + ' €';
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
    const tab = btn.dataset.tab;
    menuButtons[tab] = btn;
    btn.addEventListener('click', () => displayTab(tab));
  });

  // show default tab
  displayTab('dashboard');
}

async function displayTab(tab) {
  // Activate menu button
  Object.values(menuButtons).forEach(btn => btn.classList.remove('active'));
  menuButtons[tab]?.classList.add('active');

  const container = document.getElementById('tab-content');
  try {
    let html;
    switch (tab) {
      case 'dashboard':
        html = await loadDashboardTabContent();
        container.innerHTML = html;
        initDashboardTab();
        showSuccess('Dashboard încărcat.');
        break;

      case 'standings':
        html = await loadStandingsTabContent();
        container.innerHTML = html;
        initStandingsTab();
        break;

      case 'fixtures':
        html = await loadFixturesTabContent();
        container.innerHTML = html;
        initFixturesTab();
        break;

      case 'team':
        html = await loadTeamsTabContent();
        container.innerHTML = html;
        initTeamsTab();
        break;

      case 'squad':
        html = await loadSquadTabContent();
        container.innerHTML = html;
        initSquadTab();
        break;

      default:
        container.innerHTML = `<p class="error-message">Tab necunoscut: ${tab}</p>`;
        console.error(`game-ui: Tab "${tab}" nu există.`);
    }
  } catch (err) {
    console.error(`game-ui: Eroare la încărcarea tab-ului "${tab}":`, err);
    showError(`Eroare la încărcarea tab-ului "${tab}".`);
  }
}

// start UI when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGame);
