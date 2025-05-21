// js/main.js

import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { renderMap } from './map.js';
import { renderFleet } from './fleet.js';
import {
    loadGame, saveGame, getUserData, getPlayerName, setPlayerName,
    getPlayerRace, setPlayerRace, updateResources, resetGame
} from './user.js';
import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

// --- Race Data (Only Solari and Coming Soon) ---
const races = [
    {
        id: "Solari",
        name: "Solari",
        description: "Experți în energie solară și colonizare rapidă. Bonusuri la producția de energie și expansiune.",
        image: "public/img/solari_race.png" // Asigură-te că ai această imagine!
    },
    {
        id: "ComingSoon",
        name: "În curând...",
        description: "Noi rase vor fi disponibile în viitor!",
        image: "public/img/coming_soon.png",
        disabled: true // Va fi un card non-selectabil
    }
];

// --- DOM Element References ---
const gameContainer = document.getElementById('game-container');
const nameModal = document.getElementById('name-modal');
const playerNameInput = document.getElementById('player-name-input');
const saveNameButton = document.getElementById('save-name-button');
const raceSelectionScreen = document.getElementById('race-selection-screen');
const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');


// --- Game Initialization Flow ---
window.addEventListener('DOMContentLoaded', () => {
    loadGame(); // Load saved data

    const userData = getUserData();

    // Debugging: Reset game for testing initial flow if needed
    // resetGame(); // Uncomment this line if you need to force reset for testing

    if (!userData.playerName) {
        showNameModal(); // Show name input if no name
    } else if (!userData.playerRace) {
        showRaceSelectionScreen(); // Show race selection if no race
    } else {
        startGame(); // Start game if both are set
    }

    // Set up navigation event listeners (Moved here to ensure they are always attached)
    document.getElementById('nav-buildings').addEventListener('click', renderBuildings);
    document.getElementById('nav-research').addEventListener('click', renderResearch);
    document.getElementById('nav-map').addEventListener('click', renderMap);
    document.getElementById('nav-fleet').addEventListener('click', renderFleet);

    // Set up reset game button
    document.getElementById('reset-game-button').addEventListener('click', resetGame);
});


// --- Modal / Screen Functions ---

function showNameModal() {
    // Hide all other main screens
    gameContainer.style.display = 'none';
    raceSelectionScreen.style.display = 'none';
    nameModal.style.display = 'flex'; // Use flex for centering

    saveNameButton.onclick = () => {
        const name = playerNameInput.value.trim();
        if (name) {
            setPlayerName(name);
            nameModal.style.display = 'none';
            showRaceSelectionScreen(); // Move to race selection after name
        } else {
            showMessage("Te rog introdu-ți numele.", "error");
        }
    };
}

function showRaceSelectionScreen() {
    // Hide all other main screens
    gameContainer.style.display = 'none';
    nameModal.style.display = 'none';
    raceSelectionScreen.style.display = 'flex'; // Use flex for centering

    renderRaceCards();
}

function renderRaceCards() {
    raceCardsContainer.innerHTML = ''; // Clear previous cards

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        if (race.disabled) {
            card.classList.add('disabled');
        } else {
            card.dataset.race = race.id; // Store race ID
        }

        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}" onerror="this.onerror=null;this.src='public/img/placeholder.png';">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            ${race.disabled ?
                '<button class="select-race-button" disabled>În curând</button>' :
                '<button class="select-race-button">Selectează</button>'
            }
        `;
        raceCardsContainer.appendChild(card);

        if (!race.disabled) {
            card.querySelector('.select-race-button').addEventListener('click', () => {
                selectRace(race.id);
            });
        }
    });
}

function selectRace(raceId) {
    setPlayerRace(raceId);
    raceSelectionScreen.style.display = 'none';
    startGame(); // Start the game after race selection
    showMessage(`Ai ales rasa ${getPlayerRace()}!`, "success");
}

function startGame() {
    // Show the main game interface
    gameContainer.style.display = 'flex'; // Use flex to enable flexbox layout
    nameModal.style.display = 'none';
    raceSelectionScreen.style.display = 'none';

    updateHUD(); // Update HUD with player name and race
    renderBuildings(); // Display buildings view by default
}

// --- Game Loop (Production Update) ---
setInterval(() => {
    const userData = getUserData();
    const production = userData.production;

    // Convert hourly production to per-second production
    const metalPerSecond = production.metal / 3600;
    const crystalPerSecond = production.crystal / 3600;
    const energyPerSecond = production.energy / 3600;
    const heliumPerSecond = production.helium / 3600;

    // Update resources for 1 second
    updateResources(metalPerSecond, crystalPerSecond, energyPerSecond, heliumPerSecond);
}, 1000);

// Global function to reset game (for console or reset button)
window.resetGame = resetGame;
