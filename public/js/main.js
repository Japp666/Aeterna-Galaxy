// public/js/main.js

import { getGameState, saveGameState, loadGameState, initializeNewGameState } from './game-state.js';
import { showGameScreen, showSetupScreen, updateHeaderInfo, displayTab, initUI } from './game-ui.js'; // Import initUI
import { initNewsSystem } from './news.js'; // Import news system

/**
 * Initializes the application when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOM loaded. Initializing application.");

    // Initialize UI elements and listeners once the DOM is ready
    initUI(); 

    const startGameButton = document.getElementById('start-game-button');
    const loadGameButton = document.getElementById('load-game-button');
    const nextDayButton = document.getElementById('next-day-button');

    if (!startGameButton || !loadGameButton || !nextDayButton) {
        console.error("main.js: Essential buttons are missing. Ensure 'start-game-button', 'load-game-button', and 'next-day-button' exist in the DOM.");
        return;
    }

    // Check if a game state is saved
    const savedState = loadGameState();
    if (savedState) {
        // If a saved state exists, show the setup screen with the option to continue
        showSetupScreen();
        console.log("main.js: Saved game state detected. Displaying setup screen with load option.");
    } else {
        // If no saved state, show the setup screen directly
        showSetupScreen();
        console.log("main.js: No saved game state. Displaying setup screen.");
    }

    // Add listeners for buttons
    startGameButton.addEventListener('click', handleStartNewGame);
    loadGameButton.addEventListener('click', handleLoadGame);
    nextDayButton.addEventListener('click', handleNextDay);

    console.log("main.js: Event listeners for buttons added.");
});

/**
 * Handles the logic for starting a new game.
 */
function handleStartNewGame() {
    console.log("main.js: 'Start Game' button clicked.");
    const clubNameInput = document.getElementById('club-name-input');
    const coachNameInput = document.getElementById('coach-name-input');
    const coachNicknameInput = document.getElementById('coach-nickname-input');

    const clubName = clubNameInput.value.trim();
    const coachName = coachNameInput.value.trim();
    const coachNickname = coachNicknameInput.value.trim();

    if (!clubName || !coachName || !coachNickname) {
        alert("Please fill in all fields to start a new game!"); // Using alert temporarily, will be replaced with a UI modal
        return;
    }

    initializeNewGameState(clubName, coachName, coachNickname);
    saveGameState(getGameState()); // Save initial state
    showGameScreen(); // Display main game screen
    updateHeaderInfo(); // Update header with new info
    initNewsSystem(); // Initialize news system
    displayTab(getGameState().currentTab); // Display the initial tab after showing game screen
    console.log("main.js: New game started and initial state saved.");
}

/**
 * Handles the logic for loading an existing game.
 */
function handleLoadGame() {
    console.log("main.js: 'Continue Game' button clicked.");
    const loadedState = loadGameState();
    if (loadedState) {
        // Game state is already set by loadGameState() in game-state.js
        showGameScreen(); // Display main game screen
        updateHeaderInfo(); // Update header with loaded info
        initNewsSystem(); // Initialize news system
        displayTab(getGameState().currentTab); // Display the initial tab after showing game screen
        console.log("main.js: Game loaded successfully.");
    } else {
        alert("No saved game to load!"); // Using alert temporarily, will be replaced with a UI modal
        console.warn("main.js: No saved game found.");
    }
}

/**
 * Handles the logic for advancing a day in the game.
 */
function handleNextDay() {
    console.log("main.js: 'Next Day' button clicked.");
    let gameState = getGameState();

    // Advance the day
    gameState.currentDay++;
    if (gameState.currentDay > 30) { // Assume 30 days in a month/period
        gameState.currentDay = 1;
        gameState.currentSeason++; // Advance the season (or month, depends on game logic)
        // Logic for end-of-season/month events could be added here
        console.log(`main.js: Advanced to Season ${gameState.currentSeason}, Day 1.`);
    } else {
        console.log(`main.js: Advanced to Day ${gameState.currentDay} of Season ${gameState.currentSeason}.`);
    }

    // Daily events should happen here:
    // - Calculation of daily income/expenses
    // - Player training progress
    // - Checking matches scheduled for the current day
    // - Generation of new news

    // Example: News generation (will be extended in news.js module)
    initNewsSystem(); // Re-initialize news system to generate new news (if applicable)

    saveGameState(gameState); // Save updated state
    updateHeaderInfo(); // Update header
    displayTab(getGameState().currentTab); // Re-display current tab to update its content
}
