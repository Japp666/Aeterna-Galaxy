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
    console.error('Nu am găsit #game-content');
    return;
  }

  const state = getGameState();
  if (!state.isGameStarted) {
    // ecran SETUP
    const tpl = await fetch('components/setup.html')
      .then(r => r.ok ? r.text() : Promise.reject(r.status));
    gameContent.innerHTML = tpl;
    initSetupScreen(displayGameScreen);
    showSuccess('Setup afișat.');
  } else {
    displayGameScreen();
  }
}

async function displayGameScreen() {
  // Meniul global
  gameContent.innerHTML = `
    <div class="menu-bar">
      <div class="menu-button" data-tab="dashboard">Dashboard</div>
      <div class="menu-button" data-tab="standings">Clasament</div>
      <div class="menu-button" data-tab="fixtures">Meciuri</div>
      <div class="menu-button" data-tab="team">Echipă</div>
      <div class="menu-button" data-tab="squad">Lot</div>
    </div>
    <div id="tab-content"></div>
  `;
  document.querySelectorAll('.menu-button').forEach(btn => {
    const tab = btn.dataset.tab;
    menuButtons[tab] = btn;
    btn.addEventListener('click', () => displayTab(tab));
  });

  // Prima pagină deschisă
  displayTab('dashboard');
}

async function displayTab(tab) {
  // toggle active
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
        container.innerHTML = `<p>Ecran Echipă – în construcție</p>`;
        break;
      case 'squad':
        container.innerHTML = `<p>Ecran Lot – în construcție</p>`;
        break;
      default:
        container.innerHTML = `<p>Tab necunoscut: ${tab}</p>`;
    }
  } catch (err) {
    console.error(err);
    showError('Eroare la încărcarea conținutului.');
  }
}
