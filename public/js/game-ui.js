// js/game-ui.js - Gestionarea interfeței utilizator a jocului (meniu, tab-uri)

import { loadComponent } from './utils.js';
import { initializeGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';
import { initNewsSystem } from './news.js'; // NOU: Importăm sistemul de știri

const gameContent = document.getElementById('game-content');
const mainMenu = document.querySelector('.main-menu');
const gameContainer = document.getElementById('game-container');
const setupScreen = document.getElementById('setup-screen');
const resetGameBtn = document.getElementById('reset-game-btn');
const currentNewsElement = document.getElementById('current-news'); // Referința la elementul de știri

// Definim structura meniului
const menuItems = [
    { id: 'dashboard', text: 'Dashboard', component: 'dashboard' },
    { id: 'team', text: 'Echipă', component: 'team' },
    { id: 'matches', text: 'Meciuri', component: 'matches' },
    { id: 'standings', text: 'Clasament', component: 'standings' },
    { id: 'transfers', text: 'Transferuri', component: 'transfers' },
    { id: 'training', text: 'Antrenament', component: 'training' },
    { id: 'finance', text: 'Finanțe', component: 'finance' },
    { id: 'offseason', text: 'Pauză Comp.', component: 'offseason' }
];

/**
 * Generează meniul principal de navigație.
 */
function renderMainMenu() {
    mainMenu.innerHTML = '';
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.id = `menu-btn-${item.id}`;
        button.classList.add('menu-btn');
        button.textContent = item.text;
        button.dataset.component = item.component;

        button.addEventListener('click', () => {
            displayTab(item.id);
        });
        mainMenu.appendChild(button);
    });
}

/**
 * Afișează conținutul unui anumit tab.
 * @param {string} tabId - ID-ul tab-ului de afișat (ex: 'dashboard', 'team').
 */
export async function displayTab(tabId) {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeButton = document.getElementById(`menu-btn-${tabId}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const selectedItem = menuItems.find(item => item.id === tabId);
    if (selectedItem && selectedItem.component) {
        const componentHtml = await loadComponent(selectedItem.component);
        gameContent.innerHTML = componentHtml;
        console.log(`Tab-ul "${selectedItem.text}" a fost încărcat.`);
    } else {
        gameContent.innerHTML = `<p>Conținut pentru ${tabId} nu este disponibil încă.</p>`;
        console.warn(`Componenta pentru tab-ul ${tabId} nu a fost găsită.`);
    }
}

/**
 * Inițializează UI-ul principal al jocului.
 */
export function initGameUI() {
    renderMainMenu();
    initNewsSystem(currentNewsElement, 15000); // NOU: Inițializează sistemul de știri

    resetGameBtn.addEventListener('click', () => {
        if (!confirm('Ești sigur că vrei să resetezi jocul? Progresul va fi pierdut!')) {
            return;
        }
        localStorage.removeItem('fmStellarLeagueGameState');
        window.location.reload();
    });
}
