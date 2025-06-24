// js/game-ui.js - Gestionarea interfeței utilizator a jocului (meniu, tab-uri, știri)

import { loadComponent } from './utils.js';
import { initializeGameState } from './game-state.js';
import { initSetupScreen } from './setup.js';

const gameContent = document.getElementById('game-content');
const mainMenu = document.querySelector('.main-menu');
const gameContainer = document.getElementById('game-container');
const setupScreen = document.getElementById('setup-screen');
const resetGameBtn = document.getElementById('reset-game-btn');
const currentNewsElement = document.getElementById('current-news'); // NOU: Elementul pentru știri

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

// NOU: Lista de știri posibile
const newsHeadlines = [
    "Descoperire galactică! Noi talente au apărut pe piața de transferuri.",
    "Tensiuni în Divizia Alfa! Cluburile se luptă pentru supremație.",
    "Fenomen meteorologic rar afectează planetele cu stadioane. Meciuri amânate?",
    "Fanii sunt în extaz după ultima victorie a echipei!",
    "Sezonul se apropie de final. Cine va fi campionul Ligii Stelare?",
    "Zvonuri de transfer: un jucător legendar ar putea schimba echipa!",
    "Noi reguli propuse de Federația Galactică de Fotbal. Ce impact vor avea?",
    "Antrenamentul intensiv dă roade! Jucătorii sunt în formă maximă.",
    "Cupa Galactică începe în curând! Echipele se pregătesc intens.",
    "O nouă generație de nave de transport pentru fani a fost lansată."
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
 * Afișează o știre aleatorie din lista.
 */
function displayRandomNews() {
    const randomIndex = Math.floor(Math.random() * newsHeadlines.length);
    currentNewsElement.textContent = newsHeadlines[randomIndex];
    // Resetăm animația pentru a o reporni de fiecare dată când se schimbă știrea
    currentNewsElement.style.animation = 'none';
    void currentNewsElement.offsetWidth; // Trigger a reflow
    currentNewsElement.style.animation = null;
}

/**
 * Inițializează UI-ul principal al jocului.
 */
export function initGameUI() {
    renderMainMenu();
    displayRandomNews(); // Afișează o știre la inițializare
    // Poți seta un interval pentru a schimba știrile automat, de exemplu la fiecare 10-15 secunde
    // setInterval(displayRandomNews, 15000); // Se va schimba știrea la fiecare 15 secunde

    resetGameBtn.addEventListener('click', () => {
        if (!confirm('Ești sigur că vrei să resetezi jocul? Progresul va fi pierdut!')) {
            return;
        }
        localStorage.removeItem('fmStellarLeagueGameState');
        window.location.reload();
    });
}
