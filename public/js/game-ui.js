// public/js/game-ui.js

import { getGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';

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

import { showError, showSuccess } from './notification.js';

const menuButtons = {};
let gameContent;

export async function initializeGame() {
  gameContent = document.getElementById('game-content');
  if (!gameContent) {
    console.error('game-ui: #game-content nu a fost găsit în DOM.');
    return;
  }

  const state = getGameState();
  if (!state.isGameStarted) {
    // Dacă nu e pornit jocul, afișăm setup-ul
    const tpl = await fetch('components/setup.html').then(r =>
      r.ok ? r.text() : Promise.reject(r.status)
    );
    gameContent.innerHTML = tpl;
    initSetupScreen(displayGameScreen);
    showSuccess('Afișat ecranul de configurare.');
  } else {
    // Joc pornit → tab dashboard
    displayGameScreen();
  }
}

async function displayGameScreen() {
  // Construim butoanele de meniu
  const menuTpl = `
    <div class="menu-bar">
      <div class="menu-button" data-tab="dashboard">Dashboard</div>
      <div class="menu-button" data-tab="standings">Clasament</div>
      <div class="menu-button" data-tab="fixtures">Meciuri</div>
    </div>
    <div id="tab-content"></div>
  `;
  gameContent.innerHTML = menuTpl;
  const tabContainer = document.getElementById('tab-content');

  // Atasăm evenimentele pe butoane și mapăm
  document.querySelectorAll('.menu-button').forEach(btn => {
    const tab = btn.dataset.tab;
    menuButtons[tab] = btn;
    btn.addEventListener('click', () => displayTab(tab));
  });

  // Inițial deschidem Dashboard
  displayTab('dashboard');
}

async function displayTab(tabName) {
  try {
    // Toggle active
    Object.values(menuButtons).forEach(b => b.classList.remove('active'));
    menuButtons[tabName]?.classList.add('active');

    const tabContainer = document.getElementById('tab-content');
    let html;

    switch (tabName) {
      case 'dashboard':
        html = await loadDashboardTabContent();
        tabContainer.innerHTML = html;
        initDashboardTab();
        showSuccess('Dashboard încărcat.');
        break;

      case 'standings':
        html = await loadStandingsTabContent();
        tabContainer.innerHTML = html;
        initStandingsTab();
        showSuccess('Clasament încărcat.');
        break;

      case 'fixtures':
        html = await loadFixturesTabContent();
        tabContainer.innerHTML = html;
        initFixturesTab();
        showSuccess('Meciuri încărcate.');
        break;

      default:
        showError(`Tab necunoscut: ${tabName}`);
    }

  } catch (err) {
    console.error('game-ui:', err);
    showError('Eroare la schimbarea tab-ului.');
  }
}
