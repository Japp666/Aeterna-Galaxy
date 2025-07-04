// js/main.js

import { initSetupScreen } from './setup.js';
import { getGameData, updateGameData, saveGameData } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js';
import { renderRoster } from './roster-renderer.js';
import { initTacticsManager } from './tactics-manager.js';
import { displayCurrentDay } from './ui-updates.js'; // Asigură-te că ui-updates.js exportă displayCurrentDay

const gameScreen = document.getElementById('game-screen');
const loadingScreen = document.getElementById('loading-screen');
const header = document.querySelector('header');
const navMenu = document.getElementById('nav-menu');
const gameContent = document.getElementById('game-content');

let currentTab = 'dashboard'; // Tab-ul activ implicit

document.addEventListener('DOMContentLoaded', initializeGame);

async function initializeGame() {
    console.log("main.js: initializeGame() - Începe inițializarea jocului.");

    // Preload game data
    const gameData = getGameData();
    console.log("main.js: initializeGame() - Stare inițială a jocului. isGameStarted:", gameData.isGameStarted);

    // If game not started or no saved data, show setup screen
    if (!gameData.isGameStarted) {
        console.log("main.js: initializeGame() - Nici o stare de joc salvată sau isGameStarted este FALSE. Se afișează ecranul de setup.");
        showSetupScreen();
    } else {
        console.log("main.js: initializeGame() - Stare de joc existentă. Se încarcă jocul.");
        showGameScreen();
        // Încarcă și afișează tab-ul activ după încărcarea datelor
        await loadTab(currentTab);
        displayCurrentDay(gameData.currentDay); // Afișează ziua curentă
    }

    loadingScreen.style.display = 'none'; // Hide loading screen once initialized
}

function showSetupScreen() {
    console.log("main.js: showSetupScreen() - Se afișează ecranul de setup.");
    loadingScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    header.style.display = 'none';
    navMenu.style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';

    // Se inițializează ecranul de setup după ce DOM-ul a fost injectat
    // Adăugăm un mic delay pentru a ne asigura că elementele sunt disponibile
    setTimeout(() => {
        console.log("main.js: showSetupScreen() - HTML pentru setup a fost injectat în DOM.");
        console.log("main.js: showSetupScreen() - Se inițializează logica setup.js după un scurt delay...");
        initSetupScreen();
    }, 50);
}

function showGameScreen() {
    console.log("main.js: showGameScreen() - Se afișează ecranul de joc.");
    document.getElementById('setup-screen').style.display = 'none';
    loadingScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    header.style.display = 'flex'; // sau 'block'/'grid' depinde de stilul header-ului tău
    navMenu.style.display = 'block';
}

// Exportă funcția startGame pentru a fi accesibilă din setup.js
export function startGame(coachName, selectedTeamId) {
    console.log("main.js: startGame() - Pornirea jocului.");
    const gameData = getGameData(); // Obține starea curentă
    updateGameData({
        isGameStarted: true,
        coachName: coachName,
        selectedTeamId: selectedTeamId,
        // Resetăm diviziile pentru a asigura o stare curată la fiecare joc nou
        // Aici am putea refolosi logica de la inițializarea din game-state.js
        divisions: JSON.parse(JSON.stringify(gameData.divisions)) // Folosim diviziile inițializate la start
    });
    saveGameData(); // Salvează starea inițială

    showGameScreen();
    loadTab('dashboard'); // Încarcă tab-ul dashboard la începutul jocului
    displayCurrentDay(gameData.currentDay);
}


// Navigația între tab-uri
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', async (event) => {
        event.preventDefault();
        const tabName = event.target.dataset.tab;
        if (tabName && tabName !== currentTab) {
            await loadTab(tabName);
            currentTab = tabName;
            // Actualizează clasa 'active' pentru link-urile de navigație
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            event.target.classList.add('active');
        }
    });
});

async function loadTab(tabName) {
    console.log(`main.js: Se încearcă încărcarea tab-ului: ${tabName}`);
    let htmlFileName;
    let initializer;
    let rootElementId; // ID-ul elementului rădăcină specific fiecărui tab

    // Reset gameContent HTML (useful for some tabs)
    gameContent.innerHTML = `<p>Loading ${tabName}...</p>`;

    switch (tabName) {
        case 'dashboard':
            htmlFileName = 'dashboard.html';
            initializer = renderDashboard;
            rootElementId = 'dashboard-content';
            break;
        case 'team':
            htmlFileName = 'team-overview.html';
            // initializer = initTeamOverview; // Presupunem că vei avea o funcție similară
            rootElementId = 'team-overview-content';
            break;
        case 'roster':
            htmlFileName = 'roster.html';
            initializer = renderRoster;
            rootElementId = 'roster-content';
            break;
        case 'tactics':
            htmlFileName = 'tactics.html';
            initializer = initTacticsManager;
            rootElementId = 'tactics-content';
            break;
        case 'schedule':
            htmlFileName = 'schedule.html';
            // initializer = initSchedule;
            rootElementId = 'schedule-content';
            break;
        case 'standings':
            htmlFileName = 'standings.html';
            // initializer = initStandings;
            rootElementId = 'standings-content';
            break;
        case 'transfers':
            htmlFileName = 'transfers.html';
            // initializer = initTransfers;
            rootElementId = 'transfers-content';
            break;
        case 'finances':
            htmlFileName = 'finances.html';
            // initializer = initFinances;
            rootElementId = 'finances-content';
            break;
        case 'settings':
            htmlFileName = 'settings.html';
            // initializer = initSettings;
            rootElementId = 'settings-content';
            break;
        default:
            console.warn(`main.js: Tab necunoscut: ${tabName}`);
            gameContent.innerHTML = `<p class="error-message">Tab-ul '${tabName}' nu există.</p>`;
            return;
    }

    try {
        const response = await fetch(`components/${htmlFileName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContent.innerHTML = htmlContent;
        console.log(`main.js: Tab-ul "${tabName}" a fost încărcat în DOM din components/${htmlFileName}.`);

        if (initializer && rootElementId) {
            const tabRootElement = gameContent.querySelector(`#${rootElementId}`);
            if (tabRootElement) {
                console.log(`main.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${rootElementId})...`);
                // Apelăm direct initializer, care va conține logica de găsire a elementelor intern
                initializer(tabRootElement);
                console.log(`main.js: Logica pentru tab-ul ${tabName} inițializată.`);
            } else {
                console.error(`main.js: Eroare: Elementul rădăcină #${rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit.</p>`;
            }
        }
    } catch (error) {
        console.error(`main.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}

// Funcție placeholder pentru a afișa ziua curentă (va fi implementată în ui-updates.js)
// export function displayCurrentDay(day) {
//     const currentDayElement = document.getElementById('current-day');
//     if (currentDayElement) {
//         currentDayElement.textContent = `Ziua: ${day}`;
//     }
// }
