// public/js/game-ui.js

import { getGameState, updateGameState } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js';
import { initTeamTab } from './team.js';
import { initPlayerManagement } from './player-management.js'; // Import the initializer for roster

let gameContentDiv;
let gameHeaderDiv;
let menuButtons;
let currentActiveTab = null;

// Map tabs to their HTML files, initializers, and root element IDs
// initializer: the function that will be called after the tab's HTML is loaded
// rootElementId: the ID of the root element within the tab's HTML file
const tabConfig = {
    'dashboard': { html: 'dashboard.html', initializer: renderDashboard, rootElementId: 'dashboard-content' },
    'team': { html: 'team.html', initializer: initTeamTab, rootElementId: 'team-content' },
    'roster': { html: 'roster-tab.html', initializer: initPlayerManagement, rootElementId: 'roster-content' },
    'players': { html: 'players.html', initializer: null, rootElementId: 'players-content' }, // "Training" - will need a dedicated module
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

    // Diagnostic logs to check if elements are found
    console.log("game-ui.js: gameContentDiv found:", !!gameContentDiv);
    console.log("game-ui.js: gameHeaderDiv found:", !!gameHeaderDiv);
    console.log("game-ui.js: menuButtons count:", menuButtons ? menuButtons.length : 0);


    if (!gameContentDiv || !gameHeaderDiv || menuButtons.length === 0) {
        console.error("game-ui.js: Essential UI elements are missing during initUI. This might indicate a DOM loading issue or incorrect IDs/classes.");
        // We will not return here, but rather let the calling function handle the display.
        // The displayTab function will perform its own checks.
    } else {
        addMenuListeners();
        console.log("game-ui.js: UI elements references obtained and menu listeners added.");
    }
    // IMPORTANT: displayTab is NOT called here anymore. It will be called from main.js
    // after the game screen is made visible.
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

    // Deactivate the currently active tab visually
    if (currentActiveTab) {
        const prevButton = document.querySelector(`.menu-button[data-tab="${currentActiveTab}"]`);
        if (prevButton) {
            prevButton.classList.remove('active');
        }
    }

    // Activate the new tab visually
    const newButton = document.querySelector(`.menu-button[data-tab="${tabName}"]`);
    if (newButton) {
        newButton.classList.add('active');
    }
    currentActiveTab = tabName;

    // Save the current tab in the game state
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

        // Initialize tab-specific logic, if an initializer exists
        if (config.initializer) {
            if (config.rootElementId) {
                const tabRootElement = gameContentDiv.querySelector(`#${config.rootElementId}`);
                if (tabRootElement) {
                    console.log(`game-ui.js: Initializing logic for tab ${tabName}, passing root element (${config.rootElementId})...`);
                    config.initializer(tabRootElement, getGameState()); // Pass root element and game state
                    console.log(`game-ui.js: Logic for tab ${tabName} initialized.`);
                } else {
                    console.error(`game-ui.js: Error: Root element #${config.rootElementId} not found after loading tab ${tabName}. This might happen if the HTML component file does not contain the expected root ID.`);
                    gameContentDiv.innerHTML = `<p class="error-message">Error loading tab "${tabName}": Main element not found.</p>`;
                }
            } else {
                // Case where the initializer does not need a specific rootElementId
                console.log(`game-ui.js: Initializing logic for tab ${tabName} without a specific root element...`);
                config.initializer(getGameState()); // Pass only gameState
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
        const coachNicknameElement = document.getElementById('header-coach-nickname');
        const clubNameElement = document.getElementById('header-club-name');
        const clubFundsElement = document.getElementById('header-club-funds');
        // const seasonDayElement = document.getElementById('header-season-day'); // Uncomment if added to HTML

        if (clubEmblemElement) clubEmblemElement.src = gameState.club.emblemUrl || 'https://placehold.co/60x60/000000/FFFFFF?text=CLUB';
        if (coachNicknameElement) coachNicknameElement.textContent = gameState.coach.nickname || 'N/A';
        if (clubNameElement) clubNameElement.textContent = gameState.club.name || 'N/A';
        if (clubFundsElement) clubFundsElement.textContent = `${(gameState.club.funds || 0).toLocaleString('ro-RO')} €`;
        // if (seasonDayElement) seasonDayElement.textContent = `Sezon: ${gameState.currentSeason} | Ziua: ${gameState.currentDay}`;
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
        gameScreen.style.display = 'flex'; // Use flex for layout
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
    // This is a temporary implementation to avoid confirm() errors
    // In a real application, you would create a modal div, OK/Cancel buttons, and attach listeners.
    if (window.confirm(message)) { // Used only for quick testing, will be replaced
        onConfirm();
    } else {
        onCancel();
    }
}
