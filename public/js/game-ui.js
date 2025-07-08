// public/js/game-ui.js

import { getGameState, resetGameState } from './game-state.js';
import { initSetupScreen }    from './setup.js';
import { showError, showSuccess } from './notification.js';

import { initDashboardTab }   from './dashboard-renderer.js';
import { initStandingsTab }   from './standings-renderer.js';
import { initFixturesTab }    from './fixtures-renderer.js';
import { initTeamsTab }       from './team-renderer.js';
import { initSquadTab }       from './squad-renderer.js';

const TAB_TEMPLATES = {
  dashboard: `
    <div id="dashboard-content" class="card dashboard-container">
      <h2>Bun venit, <span id="coach-name-display"></span>!</h2>
      <p>Club: <strong><span id="club-name-display"></span></strong></p>
      <p>Buget: <strong><span id="club-funds-display"></span> €</strong></p>
    </div>
  `,
  standings: `
    <div class="card standings-container">
      <h2>Clasament Divizia <span id="division-level">–</span></h2>
      <table class="standings-table">
        <thead>
          <tr>
            <th>#</th><th>Echipă</th><th>J</th><th>V</th><th>E</th><th>Î</th><th>Pct</th>
          </tr>
        </thead>
        <tbody id="standings-table-body"></tbody>
      </table>
      <div class="standings-actions">
        <button id="finalize-season-btn" class="btn">Finalizează sezon</button>
      </div>
    </div>
  `,
  fixtures: `
    <div class="card fixtures-container">
      <h2>Calendar – Ziua <span id="matchday-number">–</span></h2>
      <ul id="fixtures-list" class="fixtures-list"></ul>
      <div class="fixtures-actions">
        <button id="simulate-day-btn" class="btn">Simulează Ziua</button>
        <button id="simulate-season-btn" class="btn">Simulează Sezonul</button>
      </div>
    </div>
  `,
  team: `
    <div id="team-content" class="card team-container">
      <h2>Echipe Divizia <span id="team-division-level">–</span></h2>
      <ul id="teams-list" class="teams-list"></ul>
    </div>
  `,
  squad: `
    <div id="squad-content" class="card squad-container">
      <h2>Lotul Clubului</h2>
      <ul id="squad-list"></ul>
    </div>
  `
};

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'standings', label: 'Clasament' },
  { key: 'fixtures',  label: 'Calendar' },
  { key: 'team',      label: 'Echipe' },
  { key: 'squad',     label: 'Lot' }
];

let menuButtons = {};

export function initializeGame() {
  const header  = document.getElementById('game-header');
  const content = document.getElementById('game-content');
  const state   = getGameState();

  if (!state.isGameStarted) {
    header.style.display = 'none';
    fetch('components/setup.html')
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(html => {
        content.innerHTML = html;
        initSetupScreen(onSetupComplete);
        showSuccess('Afișat ecran de configurare.');
      })
      .catch(err => showError('Nu am putut încărca setup.'));
  } else {
    header.style.display = 'flex';
    updateHeaderInfo();
    renderGameUI();
  }

  // Reset button
  const resetBtn = document.getElementById('reset-game-button');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Resetezi progresul?')) resetGameState();
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
  document.getElementById('header-club-emblem').src              = s.club.emblemUrl;
  document.getElementById('header-club-name').textContent       = s.club.name;
  document.getElementById('header-coach-nickname').textContent  = s.coach.nickname;
  document.getElementById('header-club-funds').textContent      =
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
    btn.onclick = () => displayTab(tab);
  });

  displayTab('dashboard');
}

function displayTab(tab) {
  // Activate button
  Object.values(menuButtons).forEach(b => b.classList.remove('active'));
  menuButtons[tab]?.classList.add('active');

  const container = document.getElementById('tab-content');
  container.innerHTML = TAB_TEMPLATES[tab] || `<p>Tab necunoscut: ${tab}</p>`;

  try {
    switch (tab) {
      case 'dashboard':
        initDashboardTab();
        break;
      case 'standings':
        initStandingsTab();
        break;
      case 'fixtures':
        initFixturesTab();
        break;
      case 'team':
        initTeamsTab();
        break;
      case 'squad':
        initSquadTab();
        break;
    }
    showSuccess(`${tab.charAt(0).toUpperCase() + tab.slice(1)} încărcat.`);
  } catch (err) {
    console.error(`Eroare în init${tab}:`, err);
    showError(`Nu am putut încărca ${tab}.`);
  }
}

document.addEventListener('DOMContentLoaded', initializeGame);
