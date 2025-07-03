// public/js/main.js

import { getGameState, saveGameState, loadGameState, initializeNewGameState } from './game-state.js';
import { showGameScreen, showSetupScreen, updateHeaderInfo, displayTab, initUI } from './game-ui.js';
import { initNewsSystem } from './news.js';

/**
 * Initializes the application when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOM loaded. Initializing application.");

    initUI(); 

    const startGameButton = document.getElementById('start-game-button');
    const loadGameButton = document.getElementById('load-game-button');

    if (!startGameButton || !loadGameButton) {
        console.error("main.js: Essential buttons are missing. Ensure 'start-game-button' and 'load-game-button' exist in the DOM.");
        return;
    }

    const savedState = loadGameState();
    if (savedState) {
        showSetupScreen();
        console.log("main.js: Saved game state detected. Displaying setup screen with load option.");
    } else {
        showSetupScreen();
        console.log("main.js: No saved game state. Displaying setup screen.");
    }

    startGameButton.addEventListener('click', handleStartNewGame);
    loadGameButton.addEventListener('click', handleLoadGame);

    console.log("main.js: Event listeners for buttons added.");
});

/**
 * Handles the logic for starting a new game.
 */
function handleStartNewGame() {
    console.log("main.js: 'Start Game' button clicked.");
    const clubNameInput = document.getElementById('club-name-input');
    const coachNameInput = document.getElementById('coach-name-input');
    // const coachNicknameInput = document.getElementById('coach-nickname-input'); // Eliminat

    const clubName = clubNameInput.value.trim();
    const coachName = coachNameInput.value.trim();
    // const coachNickname = coachNicknameInput.value.trim(); // Eliminat

    if (!clubName || !coachName) { // Condiție actualizată
        alert("Please fill in all required fields to start a new game!");
        return;
    }

    initializeNewGameState(clubName, coachName); // Apel actualizat
    saveGameState(getGameState());
    showGameScreen();
    updateHeaderInfo();
    initNewsSystem();
    displayTab(getGameState().currentTab);
    console.log("main.js: New game started and initial state saved.");
}

/**
 * Handles the logic for loading an existing game.
 */
function handleLoadGame() {
    console.log("main.js: 'Continue Game' button clicked.");
    const loadedState = loadGameState();
    if (loadedState) {
        showGameScreen();
        updateHeaderInfo();
        initNewsSystem();
        displayTab(getGameState().currentTab);
        console.log("main.js: Game loaded successfully.");
    } else {
        alert("No saved game to load!");
        console.warn("main.js: No saved game found.");
    }
}
