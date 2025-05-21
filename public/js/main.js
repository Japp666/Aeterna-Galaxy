// js/main.js

import { showTab } from './utils.js';
import { initializeUser, saveUserName, saveUserRace, getUserData } from './user.js';
import { updateHUD } from './hud.js';
import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { renderFleet } from './fleet.js';
import { createMapGrid } from './map.js';

// Get modal elements
const nicknameModal = document.getElementById('nicknameModal');
const playerNameInput = document.getElementById('playerNameInput');
const submitNicknameBtn = document.getElementById('submitNicknameBtn');

const raceSelectionModal = document.getElementById('raceSelectionModal');
const raceCards = document.querySelectorAll('.race-card');
const startGameBtn = document.getElementById('startGameBtn');

// Get tab buttons
const homeBtn = document.getElementById('homeBtn');
const buildingsBtn = document.getElementById('buildingsBtn');
const researchBtn = document.getElementById('researchBtn');
const fleetBtn = document.getElementById('fleetBtn');
const mapBtn = document.getElementById('mapBtn');
const rankingsBtn = document.getElementById('rankingsBtn'); // Added rankings button

// Event Listeners for Tab Buttons
homeBtn.addEventListener('click', () => showTab('homeTab'));
buildingsBtn.addEventListener('click', () => showTab('buildingsTab'));
researchBtn.addEventListener('click', () => showTab('researchTab'));
fleetBtn.addEventListener('click', () => showTab('fleetTab'));
mapBtn.addEventListener('click', () => showTab('mapTab'));
rankingsBtn.addEventListener('click', () => showTab('rankingsTab')); // Added rankings button event listener

document.addEventListener('DOMContentLoaded', () => {
    const userData = getUserData();

    if (!userData || !userData.name) {
        nicknameModal.style.display = 'flex';
        playerNameInput.focus();
    } else if (!userData.race) {
        // If name exists but race doesn't, show race selection modal
        raceSelectionModal.style.display = 'flex';
    } else {
        // User data exists, initialize game
        initializeGame();
    }
});

// Nickname Modal Logic
playerNameInput.addEventListener('input', () => {
    submitNicknameBtn.disabled = playerNameInput.value.trim().length < 3;
});

submitNicknameBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        saveUserName(name);
        nicknameModal.style.display = 'none'; // Hide nickname modal
        raceSelectionModal.style.display = 'flex'; // Show race selection modal
    }
});

// Race Selection Modal Logic
let selectedRace = null;

raceCards.forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('coming-soon')) {
            // Prevent selection of 'Coming Soon' cards
            return;
        }

        raceCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedRace = card.dataset.race;
        startGameBtn.disabled = false;
    });
});

startGameBtn.addEventListener('click', () => {
    if (selectedRace) {
        saveUserRace(selectedRace);
        raceSelectionModal.style.display = 'none'; // Hide race selection modal
        initializeGame(); // Start the game after race selection
    }
});

// Main game initialization function
function initializeGame() {
    console.log("Game initialized!");
    updateHUD(); // Update HUD with loaded user data
    renderBuildings();
    renderResearch();
    renderFleet();
    createMapGrid();
    // Potentially show initial tab like 'homeTab'
    showTab('homeTab');
}

// Global functions for debugging/testing (optional)
window.showTab = showTab;
