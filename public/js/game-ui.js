// public/js/game-ui.js

import { getGameState } from './game-state.js'; // Asigură-te că această linie există
import { renderDashboard } from './dashboard-renderer.js'; // Asigură-te că această linie există
import { renderTeam } from './team-renderer.js';
import { renderRoster } from './roster-renderer.js';
import { renderFinance } from './finance-renderer.js';
import { renderMatches } from './matches-renderer.js';
import { renderOffseason } from './offseason-renderer.js';

const gameContent = document.getElementById('game-content');
const gameScreen = document.getElementById('game-screen');
const setupScreen = document.getElementById('setup-screen');
const menuButtons = document.querySelectorAll('.menu-button');
let currentActiveTab = null;

/**
 * Inițializează elementele UI ale jocului și adaugă listeneri.
 */
export function initUI() {
    console.log("game-ui.js: initUI() - Începerea inițializării UI-ului jocului.");

    // Adaugă listeneri pentru butoanele de meniu
    menuButtons.forEach(button => {
        if (!button._hasClickListener) { // Evită adăugarea multiplă a listenerilor
            button.addEventListener('click', (event) => {
                const tab = event.target.dataset.tab;
                console.log(`game-ui.js: Buton meniu "${tab}" apăsat.`);
                switch (tab) {
                    case 'dashboard':
                        displayTab('dashboard', 'dashboard.html', renderDashboard, 'dashboard-content');
                        break;
                    case 'team':
                        displayTab('team', 'team.html', renderTeam, 'team-content');
                        break;
                    case 'roster':
                        displayTab('roster', 'roster.html', renderRoster, 'roster-content');
                        break;
                    case 'finance':
                        displayTab('finance', 'finance.html', renderFinance, 'finance-content');
                        break;
                    case 'matches':
                        displayTab('matches', 'matches.html', renderMatches, 'matches-content');
                        break;
                    case 'offseason':
                        displayTab('offseason', 'offseason.html', renderOffseason, 'offseason-content');
                        break;
                    default:
                        console.warn(`game-ui.js: Tab necunoscut: ${tab}`);
                }
            });
            button._hasClickListener = true;
        }
    });
    console.log("game-ui.js: Listeneri de meniu adăugați.");

    // Afișează tab-ul implicit la pornire (Dashboard)
    displayTab('dashboard', 'dashboard.html', renderDashboard, 'dashboard-content');
    console.log("game-ui.js: UI inițializat. Se afișează dashboard-ul.");
}

/**
 * Afișează un tab specific în zona de conținut a jocului.
 * @param {string} tabName - Numele tab-ului (ex: 'dashboard', 'team', 'roster').
 * @param {string} htmlFileName - Numele fișierului HTML al componentei (ex: 'dashboard.html').
 * @param {function(HTMLElement, object): void} [initializer] - Funcție de inițializare specifică tab-ului, care primește elementul rădăcină și starea jocului.
 * @param {string} [rootElementId] - ID-ul elementului rădăcină al tab-ului în HTML-ul încărcat.
 */
export async function displayTab(tabName, htmlFileName, initializer, rootElementId) {
    console.log(`game-ui.js: displayTab() - Se încearcă afișarea tab-ului: ${tabName}. Tab activ curent: ${currentActiveTab}`);

    // Actualizează clasa "active" pentru butoanele de meniu
    menuButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    currentActiveTab = tabName; // Actualizează tab-ul activ curent

    try {
        const response = await fetch(`components/${htmlFileName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul \"${tabName}\" a fost încărcat în DOM din components/${htmlFileName}.`);

        if (initializer && rootElementId) {
            const tabRootElement = gameContent.querySelector(`#${rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${rootElementId}) și starea jocului...`);
                
                // Obține cea mai recentă stare a jocului chiar înainte de a inițializa tab-ul
                const currentGameState = getGameState(); 
                initializer(tabRootElement, currentGameState); // Trece și starea jocului
                
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            } else {
                console.error(`game-ui.js: Eroare: Elementul rădăcină #${rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului \"${tabName}\": Elementul principal nu a fost găsit.</p>`;
            }
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului \"${tabName}\": ${error.message}</p>`;
    }
}

/**
 * Afișează ecranul principal al jocului și ascunde ecranul de setup.
 */
export function showGameScreen() {
    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex'; // Asigură-te că este 'flex' pentru layout-ul principal
        initUI(); // Inițializează UI-ul jocului când se afișează ecranul de joc
        console.log("game-ui.js: Ecranul jocului a fost afișat.");
    } else {
        console.error("game-ui.js: Eroare: Elementele setupScreen sau gameScreen nu au fost găsite.");
    }
    updateHeaderInfo(); // Actualizează informațiile din header la afișarea ecranului de joc
}

/**
 * Actualizează informațiile din antet (header) pe baza stării curente a jocului.
 */
export function updateHeaderInfo() {
    const gameState = getGameState();
    const clubNameElement = document.getElementById('header-club-name');
    const coachNameElement = document.getElementById('header-coach-name');
    const seasonInfoElement = document.getElementById('header-season-info');
    const balanceElement = document.getElementById('header-balance');

    if (clubNameElement) clubNameElement.textContent = gameState.club.name;
    if (coachNameElement) coachNameElement.textContent = gameState.coach.name;
    if (seasonInfoElement) seasonInfoElement.textContent = `Sezon: ${gameState.currentSeason} | Ziua: ${gameState.currentDay}`;
    if (balanceElement) balanceElement.textContent = `Balanță: ${gameState.club.balance.toLocaleString('ro-RO', { style: 'currency', currency: 'CREDITS' })}`;

    console.log("game-ui.js: Informații header actualizate.");
}
