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

const TABS = ['dashboard', 'standings', 'fixtures', 'team', 'squad'];
let menuButtons = {};

export async function initializeGame() {
  const header = document.getElementById('game-header');
  const content = document.getElementById('game-content');
  const state = getGameState();

  if (!state.isGameStarted) {
    // Afișăm ecranul de Setup
    header.style.display = 'none';
    const tpl = await fetch('components/setup.html')
      .then(r => r.ok ? r.text() : Promise.reject(r.status));
    content.innerHTML = tpl;
    initSetupScreen(onSetupComplete);
    showSuccess('Afișat ecranul de configurare.');
  } else {
    // Interfață completă
    header.style.display = 'flex';
    updateHeader();
    showGameUI();
  }
}

function onSetupComplete() {
  const header = document.getElementById('game-header');
  header.style.display = 'flex';
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
  // Construim bara de meniu + containerul de tab
  content.innerHTML = `
    <div class="menu-bar">
      ${TABS.map(t =>
        `<div class="menu-button" data-tab="${t}">${
          t.charAt(0).toUpperCase() + t.slice(1)
        }</div>`
      ).join('')}
    </div>
    <div id="tab-content"></div>
  `;

  // Mapăm click-urile butoanelor
  menuButtons = {};
  document.querySelectorAll('.menu-button').forEach(btn => {
    const tab = btn.dataset.tab;
    menuButtons[tab] = btn;
    btn.addEventListener('click', () => displayTab(tab));
  });

  // Deschidem implicit Dashboard
  displayTab('dashboard');
}

async function displayTab(tab) {
  // Toggle active
  Object.values(menuButtons).forEach(b => b.classList.remove('active'));
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
        showSuccess('Clasament încărcat.');
        break;
      case 'fixtures':
        html = await loadFixturesTabContent();
        container.innerHTML = html;
        initFixturesTab();
        showSuccess('Meciuri încărcate.');
        break;
      case 'team':
        container.innerHTML = `<p>Ecran Echipă – În construcție</p>`;
        break;
      case 'squad':
        container.innerHTML = `<p>Ecran Lot – În construcție</p>`;
        break;
    }
  } catch (err) {
    console.error(err);
    showError(`Nu am putut încărca tab-ul "${tab}".`);
  }
}
