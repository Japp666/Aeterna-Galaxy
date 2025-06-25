// public/js/game-ui.js

import { loadDashboardTabContent, initDashboardTab } from './dashboard-renderer.js';
import { loadTeamTabContent, initTeamTab } from './team.js';
// Am scos importul pentru roster-renderer.js de aici,
// deoarece roster nu are încă un fișier HTML dedicat și va fi tratat ca "în construcție"

const gameContent = document.getElementById('game-content');
const menuButtons = document.querySelectorAll('.menu-button');

let activeTab = null;

export function initUI() {
    console.log("game-ui.js: initUI() - Inițializarea UI-ului jocului.");
    
    addMenuListeners();
    displayTab('dashboard'); // Afișează tab-ul dashboard la inițializare
    console.log("game-ui.js: initUI() - UI inițializat. Dashboard-ul ar trebui să fie activ.");
}

function addMenuListeners() {
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabName = event.target.dataset.tab;
            console.log(`game-ui.js: Click pe butonul meniu: ${tabName}`);
            displayTab(tabName);
        });
    });
    console.log("game-ui.js: Listeneri de meniu adăugați.");
}

export async function displayTab(tabName) {
    console.log(`game-ui.js: displayTab() - Se încearcă afișarea tab-ului: ${tabName}. Tab activ curent: ${activeTab}`);

    menuButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    if (activeTab === tabName) {
        console.log(`game-ui.js: Tab-ul '${tabName}' este deja activ. Nu se reîncarcă.`);
        return;
    }

    activeTab = tabName;

    let contentLoader;
    let initializer; // Poate fi null pentru tab-urile "în construcție"

    switch (tabName) {
        case 'dashboard':
            contentLoader = loadDashboardTabContent;
            initializer = initDashboardTab;
            break;
        case 'team':
            contentLoader = loadTeamTabContent;
            initializer = initTeamTab;
            break;
        case 'roster': // Acum roster este tratat ca "în construcție"
        case 'training':
        case 'finances':
        case 'fixtures': // Acesta era 'matches' în components, asigură-te că e același nume în meniu!
        case 'standings':
        case 'scouting': // Acesta era 'transfers' în components, asigură-te că e același nume în meniu!
        case 'settings': // Nu ai un fisier specific pentru asta.
            gameContent.innerHTML = `<p class="under-construction">Tab-ul "${tabName}" este în construcție. Revino mai târziu!</p>`;
            console.log(`game-ui.js: Tab-ul '${tabName}' este în construcție.`);
            return;
        default:
            gameContent.innerHTML = `<p class="error-message">Tab necunoscut: ${tabName}</p>`;
            console.error(`game-ui.js: Tab necunoscut: ${tabName}`);
            return;
    }

    try {
        console.log(`game-ui.js: Se încearcă încărcarea conținutului pentru tab-ul '${tabName}'...`);
        const htmlContent = await contentLoader();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM.`);

        // Dacă există un inițializator specific pentru tab, îl apelăm
        if (initializer) {
            setTimeout(() => {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}...`);
                initializer();
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            }, 50);
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}':`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}
