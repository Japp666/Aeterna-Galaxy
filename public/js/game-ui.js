// public/js/game-ui.js

import { getGameState } from './game-state.js';
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

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'standings', label: 'Clasament' },
  { key: 'fixtures',  label: 'Meciuri' },
  { key: 'team',      label: 'Echipă' },
  { key: 'squad',     label: 'Lot' }
];

let menuButtons = {};

export async function initializeGame() {
  const header = document.getElementById('game-header');
  const content = document.getElementById('game-content');
  const state = getGameState();

  if (!state.isGameStarted) {
    header.style.display = 'none';
    const tpl = await fetch('components/setup.html')
      .then(r => r.ok ? r.text() : Promise.reject(`HTTP ${r.status}`));
    content.innerHTML = tpl;
    initSetupScreen(onSetupComplete);
    showSuccess('Afișat ecran de configurare.');
  } else {
    header.style.display = 'flex';
    updateHeader();
    showGameUI();
  }
}

function onSetupComplete() {
  document.getElementById('game-header').style.display = 'flex';
  updateHeader();
  showGameUI();
}

function updateHeader() {
  const state = getGameState();
  document.getElementById('header-club-emblem').src = state.club.emblemUrl;
  document.getElementById('header-club-name').textContent = state.club.name;
  document.getElementById('header-coach-nickname').textContent = state.coach.nickname;
  document.getElementById('header-club-funds').textContent =
    new Intl.NumberFormat('ro-RO').format(state.club.funds) + ' €';
}

function showGameUI() {
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

  displayTab('dashboard');
}

async function displayTab(tab) {
  Object.values(menuButtons).forEach(b => b.classList.remove('active'));
  menuButtons[tab]?.classList.add('active');

  const container = document.getElementById('tab-content');
  try {
    switch (tab) {
      case 'dashboard':
        container.innerHTML = await loadDashboardTabContent();
        initDashboardTab();
        showSuccess('Dashboard încărcat.');
        break;
      case 'standings':
        container.innerHTML = await loadStandingsTabContent();
        initStandingsTab();
        break;
      case 'fixtures':
        container.innerHTML = await loadFixturesTabContent();
        initFixturesTab();
        break;
      case 'team':
        container.innerHTML = `<p>Tab Echipă – În construcție</p>`;
        break;
      case 'squad':
        container.innerHTML = `<p>Tab Lot – În construcție</p>`;
        break;
      default:
        throw new Error(`Tab necunoscut: ${tab}`);
    }
  } catch (err) {
    console.error(err);
    showError(err.message || 'Eroare la încărcarea tab-ului.');
  }
}
