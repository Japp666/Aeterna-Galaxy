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
  console.log('game-ui: initializeGame()');

  gameContent = document.getElementById('game-content');

  // Înregistrează butoanele de meniu şi ataşează evenimente
  document.querySelectorAll('.menu-button').forEach(btn => {
    const tab = btn.dataset.tab;
    if (tab) {
      menuButtons[tab] = btn;
      btn.addEventListener('click', () => displayTab(tab));
    }
  });

  const state = getGameState();
  if (!state.isGameStarted) {
    displaySetupScreen();
  } else {
    // Dacă deja a fost configurat jocul, actualizează header-ul
    const headerEmblem = document.getElementById('header-club-emblem');
    const headerName   = document.getElementById('header-club-name');
    if (headerEmblem) headerEmblem.src = state.club.emblemUrl;
    if (headerName)   headerName.textContent = state.club.name;

    displayGameScreen();
  }
}

function displaySetupScreen() {
  fetch('components/setup.html')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      gameContent.innerHTML = html;
      initSetupScreen(displayGameScreen);
      showSuccess('Ecran de configurare afișat.');
    })
    .catch(err => {
      console.error(err);
      showError('Nu s-a putut încărca configurarea.');
    });
}

function displayGameScreen() {
  // După setup mergem automat pe Dashboard
  displayTab('dashboard');
}

async function displayTab(tabName) {
  try {
    // Activează butonul curent
    Object.values(menuButtons).forEach(btn => btn.classList.remove('active'));
    menuButtons[tabName]?.classList.add('active');

    let html;
    switch (tabName) {
      case 'dashboard':
        html = await loadDashboardTabContent();
        gameContent.innerHTML = html;
        initDashboardTab();
        showSuccess('Tab-ul Dashboard încărcat.');
        break;

      case 'standings':
        html = await loadStandingsTabContent();
        gameContent.innerHTML = html;
        initStandingsTab();
        showSuccess('Tab-ul Clasament încărcat.');
        break;

      case 'fixtures':
        html = await loadFixturesTabContent();
        gameContent.innerHTML = html;
        initFixturesTab();
        showSuccess('Tab-ul Meciuri încărcat.');
        break;

      default:
        showError(`Tab necunoscut: ${tabName}`);
        break;
    }
  } catch (err) {
    console.error(err);
    showError('Eroare la încărcarea tab-ului.');
  }
}

// La încărcarea paginii
document.addEventListener('DOMContentLoaded', initializeGame);
