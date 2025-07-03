// public/js/game-ui.js

import { getGameState, updateGameState } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js';
import { initTeamTab } from './team.js';
import { initPlayerManagement } from './player-management.js';

let gameContentDiv;
let gameHeaderDiv;
let menuButtons;
let currentActiveTab = null;

const tabConfig = {
    'dashboard': { html: 'dashboard.html', initializer: renderDashboard, rootElementId: 'dashboard-content' },
    'team': { html: 'team.html', initializer: initTeamTab, rootElementId: 'team-content' },
    'roster': { html: 'roster-tab.html', initializer: initPlayerManagement, rootElementId: 'roster-content' },
    'players': { html: 'players.html', initializer: null, rootElementId: 'players-content' },
    'finances': { html: 'finance.html', initializer: null, rootElementId: 'finance-content' },
    'fixtures': { html: 'matches.html', initializer: null, rootElementId: 'matches-content' },
    'standings': { html: 'standings.html', initializer: null, rootElementId: 'standings-content' },
    'scouting': { html: 'transfers.html', initializer: null, rootElementId: 'transfers-content' },
    'settings': { html: 'settings.html', initializer: null, rootElementId: 'settings-content' }
};

/**
 * Initializes the game user interface.
 * This function should be called once the DOM is fully loaded.
 * It gets references to essential UI elements and sets up global listeners.
 */
export function initUI() {
    console.log("game-ui.js: initUI() - Starting game UI initialization (getting DOM refs and adding menu listeners).");
    gameContentDiv = document.getElementById('game-content');
    gameHeaderDiv = document.getElementById('game-header');
    menuButtons = document.querySelectorAll('.menu-button');

    console.log("game-ui.js: gameContentDiv found:", !!gameContentDiv);
    console.log("game-ui.js: gameHeaderDiv found:", !!gameHeaderDiv);
    console.log("game-ui.js: menuButtons count:", menuButtons ? menuButtons.length : 0);


    if (!gameContentDiv || !gameHeaderDiv || menuButtons.length === 0) {
        console.error("game-ui.js: Essential UI elements are missing during initUI. This might indicate a DOM loading issue or incorrect IDs/classes.");
    } else {
        addMenuListeners();
        console.log("game-ui.js: UI elements references obtained and menu listeners added.");
    }
}

/**
 * Adds event listeners to the menu buttons.
 */
function addMenuListeners() {
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabName = event.target.dataset.tab;
            console.log(`game-ui.js: Clicked menu button: ${tabName}`);
            displayTab(tabName);
        });
    });
    console.log("game-ui.js: Menu listeners added.");
}

/**
 * Displays a specific tab and loads its corresponding HTML content.
 * @param {string} tabName - The name of the tab to display (e.g., 'dashboard', 'team').
 */
export async function displayTab(tabName) {
    console.log(`game-ui.js: displayTab() - Attempting to display tab: ${tabName}. Current active tab: ${currentActiveTab}`);

    if (!gameContentDiv) {
        console.error("game-ui.js: gameContentDiv is not initialized. Cannot display tab. Ensure initUI was called.");
        return;
    }

    const config = tabConfig[tabName];
    if (!config) {
        console.error(`game-ui.js: Missing configuration for tab: ${tabName}`);
        gameContentDiv.innerHTML = `<p class="error-message">Error: Tab '${tabName}' is not configured.</p>`;
        return;
    }

    if (currentActiveTab) {
        const prevButton = document.querySelector(`.menu-button[data-tab="${currentActiveTab}"]`);
        if (prevButton) {
            prevButton.classList.remove('active');
        }
    }

    const newButton = document.querySelector(`.menu-button[data-tab="${tabName}"]`);
    if (newButton) {
        newButton.classList.add('active');
    }
    currentActiveTab = tabName;

    const gameState = getGameState();
    if (gameState) {
        updateGameState({ currentTab: tabName });
    }

    try {
        console.log(`game-ui.js: Attempting to load content for tab '${tabName}' from components/${config.html}...`);
        const response = await fetch(`components/${config.html}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContentDiv.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab "${tabName}" loaded into DOM from components/${config.html}.`);

        if (config.initializer) {
            if (config.rootElementId) {
                const tabRootElement = gameContentDiv.querySelector(`#${config.rootElementId}`);
                if (tabRootElement) {
                    console.log(`game-ui.js: Initializing logic for tab ${tabName}, passing root element (${config.rootElementId})...`);
                    config.initializer(tabRootElement, getGameState());
                    console.log(`game-ui.js: Logic for tab ${tabName} initialized.`);
                } else {
                    console.error(`game-ui.js: Error: Root element #${config.rootElementId} not found after loading tab ${tabName}. This might happen if the HTML component file does not contain the expected root ID.`);
                    gameContentDiv.innerHTML = `<p class="error-message">Error loading tab "${tabName}": Main element not found.</p>`;
                }
            } else {
                console.log(`game-ui.js: Initializing logic for tab ${tabName} without a specific root element...`);
                config.initializer(getGameState());
                console.log(`game-ui.js: Logic for tab ${tabName} initialized.`);
            }
        } else {
            console.log(`game-ui.js: Tab ${tabName} does not have specific JavaScript initializer.`);
        }

    } catch (error) {
        console.error(`game-ui.js: Error displaying tab '${tabName}' from components/${config.html}:`, error);
        gameContentDiv.innerHTML = `<p class="error-message">Error loading tab "${tabName}". Please reload the game.</p>`;
    }
}

/**
 * Updates the header information (club name, funds, season, day).
 */
export function updateHeaderInfo() {
    const gameState = getGameState();
    if (gameState && gameState.club && gameState.coach && gameState.currentSeason !== undefined && gameState.currentDay !== undefined) {
        const clubEmblemElement = document.getElementById('header-club-emblem');
        // const coachNicknameElement = document.getElementById('header-coach-nickname'); // Eliminat
        const clubNameElement = document.getElementById('header-club-name');
        const clubFundsElement = document.getElementById('header-club-funds');

        if (clubEmblemElement) {
            clubEmblemElement.src = gameState.club.emblemUrl || 'https://placehold.co/60x60/000000/FFFFFF?text=CLUB';
            console.log("game-ui.js: Emblem SRC set to:", clubEmblemElement.src); // Log pentru diagnoză emblemă
        }
        // if (coachNicknameElement) coachNicknameElement.textContent = gameState.coach.nickname || 'N/A'; // Eliminat
        if (clubNameElement) clubNameElement.textContent = gameState.club.name || 'N/A';
        if (clubFundsElement) clubFundsElement.textContent = `${(gameState.club.funds || 0).toLocaleString('ro-RO')} €`;
    }
    console.log("game-ui.js: Header information updated.");
}

/**
 * Shows the main game screen and hides the setup screen.
 */
export function showGameScreen() {
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');

    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        console.log("game-ui.js: Game screen displayed.");
    } else {
        console.error("game-ui.js: Error: setupScreen or gameScreen elements not found.");
    }
}

/**
 * Hides the main game screen and shows the setup screen.
 */
export function showSetupScreen() {
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');

    if (setupScreen && gameScreen) {
        setupScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        console.log("game-ui.js: Setup screen displayed.");
    } else {
        console.error("game-ui.js: Error: setupScreen or gameScreen elements not found.");
    }
}

/**
 * Placeholder function to display a custom confirmation modal.
 * DO NOT use window.confirm() or alert() in production.
 * @param {string} message - The message to display in the modal.
 * @param {function} onConfirm - Callback called on confirmation.
 * @param {function} onCancel - Callback called on cancellation.
 */
export function showConfirmationModal(message, onConfirm, onCancel) {
    console.warn("showConfirmationModal: Placeholder function. Implement a real UI modal.");
    if (window.confirm(message)) {
        onConfirm();
    } else {
        onCancel();
    }
}
