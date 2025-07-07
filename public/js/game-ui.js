// public/js/game-ui.js

import { showError } from './notification.js';

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');
let activeTab = null;

export function initUI() {
  console.log('game-ui.js: initUI() - Inițializarea UI-ului.');
  addMenuListeners();
  displayTab('dashboard'); // Tab implicit
}

function addMenuListeners() {
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      console.log(`game-ui.js: Click pe tabul '${tabName}'`);
      displayTab(tabName);
    });
  });
}

export async function displayTab(tabName) {
  // Activează butonul de meniu corespunzător
  menuButtons.forEach(button =>
    button.dataset.tab === tabName
      ? button.classList.add('active')
      : button.classList.remove('active')
  );

  if (activeTab === tabName) {
    console.log(`game-ui.js: Tabul '${tabName}' este deja activ.`);
    return;
  }

  activeTab = tabName;

  try {
    let html = '';
    let module = null;

    switch (tabName) {
      case 'dashboard':
        html = await fetch('components/dashboard.html').then(r => r.text());
        gameContent.innerHTML = html;
        module = await import('./dashboard-renderer.js');
        module.initDashboardTab();
        break;

      case 'team':
        html = await fetch('components/team.html').then(r => r.text());
        gameContent.innerHTML = html;
        module = await import('./team.js');
        module.initTeamTab(gameContent.querySelector('#team-content'));
        break;

      case 'roster':
        html = await fetch('components/roster-tab.html').then(r => r.text());
        gameContent.innerHTML = html;
        module = await import('./roster-renderer.js');
        module.initRosterTab();
        break;

      case 'training':
        html = await fetch('components/training.html').then(r => r.text());
        gameContent.innerHTML = html;
        // În viitor: import('./training.js') și apel initTrainingTab()
        break;

      case 'finances':
        html = await fetch('components/finance.html').then(r => r.text());
        gameContent.innerHTML = html;
        break;

      case 'fixtures':
        html = await fetch('components/matches.html').then(r => r.text());
        gameContent.innerHTML = html;
        break;

      case 'standings':
        html = await fetch('components/standings.html').then(r => r.text());
        gameContent.innerHTML = html;
        break;

      case 'scouting':
        html = await fetch('components/transfers.html').then(r => r.text());
        gameContent.innerHTML = html;
        break;

      case 'settings':
        gameContent.innerHTML = `<p class="under-construction">Tab-ul "${tabName}" este în construcție.</p>`;
        break;

      default:
        throw new Error(`Tab necunoscut: ${tabName}`);
    }
  } catch (err) {
    console.error(`game-ui.js: Eroare la încărcarea tab-ului '${tabName}':`, err);
    gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}"</p>`;
    showError(`Eroare la "${tabName}": ${err.message}`);
  }
}
