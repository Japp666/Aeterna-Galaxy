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
    // Removed nextDayButton as per user request

    if (!startGameButton || !loadGameButton) { // Adjusted check
        console.error("main.js: Essential buttons are missing. Ensure 'start-game-button' and 'load-game-button' exist in the DOM.");
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
    // Removed nextDayButton listener

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
    initNewsSystem(); // Initialize news system (e.g., generate initial news)
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
        initNewsSystem(); // Initialize news system (e.g., ensure news are loaded/generated)
        displayTab(getGameState().currentTab); // Display the initial tab after showing game screen
        console.log("main.js: Game loaded successfully.");
    } else {
        alert("No saved game to load!"); // Using alert temporarily, will be replaced with a UI modal
        console.warn("main.js: No saved game found.");
    }
}

// Removed handleNextDay function as per user request
