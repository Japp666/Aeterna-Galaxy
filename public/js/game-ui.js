// public/js/game-ui.js

import { showError } from './notification.js';

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');
let activeTab = null;

export function initUI() {
  console.log('game-ui.js: initUI() - Încep inițializarea UI.');
  addMenuListeners();
  // La pornire, afișăm dashboard fără a încărca toate modulele
  displayTab('dashboard');
}

function addMenuListeners() {
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      console.log(`game-ui.js: click pe tab ${tab}`);
      displayTab(tab);
    });
  });
}

export async function displayTab(tabName) {
  // Highlight în meniu
  menuButtons.forEach(btn =>
    btn.dataset.tab === tabName
      ? btn.classList.add('active')
      : btn.classList.remove('active')
  );

  if (activeTab === tabName) {
    console.log(`game-ui.js: Tab-ul ${tabName} e deja activ.`);
    return;
  }
  activeTab = tabName;

  try {
    let html, module;
    switch (tabName) {
      case 'dashboard':
        html = await fetch('components/dashboard.html').then(r=>r.text());
        gameContent.innerHTML = html;
        module = await import('./dashboard-renderer.js');
        module.initDashboardTab();
        break;

      case 'team':
        html = await fetch('components/team.html').then(r=>r.text());
        gameContent.innerHTML = html;
        module = await import('./team.js');
        module.initTeamTab(gameContent.querySelector('#team-content'));
        break;

      case 'roster':
        html = await fetch('components/roster-tab.html').then(r=>r.text());
        gameContent.innerHTML = html;
        module = await import('./roster-renderer.js');
        module.initRosterTab();
        break;

      case 'training':
        html = await fetch('components/training.html').then(r=>r.text());
        gameContent.innerHTML = html;
        // nu există încă initTrainingTab
        break;

      case 'finances':
        html = await fetch('components/finance.html').then(r=>r.text());
        gameContent.innerHTML = html;
        break;

      case 'fixtures':
        html = await fetch('components/matches.html').then(r=>r.text());
        gameContent.innerHTML = html;
        break;

      case 'standings':
        html = await fetch('components/standings.html').then(r=>r.text());
        gameContent.innerHTML = html;
        break;

      case 'scouting':
        html = await fetch('components/transfers.html').then(r=>r.text());
        gameContent.innerHTML = html;
        break;

      case 'settings':
        gameContent.innerHTML = `<p class="under-construction">Tab-ul "${tabName}" este în construcție.</p>`;
        break;

      default:
        throw new Error(`Tab necunoscut: ${tabName}`);
    }
  } catch (err) {
    console.error('game-ui.js: Eroare la afișarea tab-ului', tabName, err);
    gameContent.innerHTML = `<p class="error-message">Nu am putut încărca tab-ul ${tabName}.</p>`;
    showError(`Eroare la ${tabName}: ${err.message}`);
  }
}
