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
import { showMessage } from './utils.js'; // Asigură-te că acest fișier există!

// --- Race Data (Only Solari and Coming Soon with correct paths) ---
const races = [
    {
        id: "Solari",
        name: "Solari",
        description: "Experți în energie solară și colonizare rapidă. Bonusuri la producția de energie și expansiune.",
        image: "/public/img/solari/Emblema-Solari.png" // Calea corectă!
    },
    {
        id: "ComingSoon",
        name: "În curând...",
        description: "Noi rase vor fi disponibile în viitor!",
        image: "/public/img/coming_soon.png", // Calea corectă!
        disabled: true // Setat explicit ca inactiv
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
    loadGame(); // Încarcă datele salvate

    const userData = getUserData();

    // Debugging: Poți decomenta linia de mai jos pentru a forța resetarea la fiecare încărcare, util pentru testare
    // resetGame();

    if (!userData.playerName) {
        showNameModal(); // Arată ecranul de introducere nume dacă nu există
    } else if (!userData.playerRace) {
        showRaceSelectionScreen(); // Arată ecranul de selecție rasă dacă nu există rasă
    } else {
        startGame(); // Pornește jocul dacă ambele sunt setate
    }

    // Atașează event listeners pentru butoanele de navigare
    document.getElementById('nav-buildings').addEventListener('click', renderBuildings);
    document.getElementById('nav-research').addEventListener('click', renderResearch);
    document.getElementById('nav-map').addEventListener('click', renderMap);
    document.getElementById('nav-fleet').addEventListener('click', renderFleet);

    // Atașează event listener pentru butonul de resetare a jocului
    document.getElementById('reset-game-button').addEventListener('click', resetGame);
});


// --- Modal / Screen Functions ---

/**
 * Afișează modalul de introducere a numelui.
 */
function showNameModal() {
    // Ascunde toate celelalte ecrane principale
    gameContainer.style.display = 'none';
    raceSelectionScreen.style.display = 'none';
    nameModal.style.display = 'flex'; // Folosește flex pentru centrare

    saveNameButton.onclick = () => {
        const name = playerNameInput.value.trim();
        if (name) {
            setPlayerName(name); // Setează numele jucătorului
            nameModal.style.display = 'none'; // Ascunde modalul de nume
            showRaceSelectionScreen(); // Trece la ecranul de selecție a rasei
        } else {
            showMessage("Te rog introdu-ți numele.", "error");
        }
    };
}

/**
 * Afișează ecranul de selecție a rasei.
 */
function showRaceSelectionScreen() {
    // Ascunde toate celelalte ecrane principale
    gameContainer.style.display = 'none';
    nameModal.style.display = 'none';
    raceSelectionScreen.style.display = 'flex'; // Folosește flex pentru centrare

    renderRaceCards(); // Randează cardurile de rasă
}

/**
 * Randează cardurile de rasă în containerul lor.
 */
function renderRaceCards() {
    raceCardsContainer.innerHTML = ''; // Curăță cardurile anterioare

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = 'race-card';
        if (race.disabled) {
            card.classList.add('disabled'); // Adaugă clasa 'disabled' dacă rasa este inactivă
        } else {
            card.dataset.race = race.id; // Stochează ID-ul rasei ca atribut de date
        }

        // Folosește calea de imagine specificată și un fallback 'onerror'
        card.innerHTML = `
            <img src="${race.image}" alt="${race.name}" onerror="this.onerror=null;this.src='/public/img/placeholder.png';">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            ${race.disabled ?
                '<button class="select-race-button" disabled>În curând</button>' : // Buton inactiv
                '<button class="select-race-button">Selectează</button>' // Buton activ
            }
        `;
        raceCardsContainer.appendChild(card);

        if (!race.disabled) {
            // Adaugă event listener doar pentru cardurile active
            card.querySelector('.select-race-button').addEventListener('click', () => {
                selectRace(race.id);
            });
        }
    });
}

/**
 * Setează rasa selectată și pornește jocul.
 * @param {string} raceId ID-ul rasei selectate.
 */
function selectRace(raceId) {
    setPlayerRace(raceId); // Setează rasa jucătorului
    raceSelectionScreen.style.display = 'none'; // Ascunde ecranul de selecție a rasei
    startGame(); // Pornește jocul
    showMessage(`Ai ales rasa ${getPlayerName()}!`, "success"); // Afișează un mesaj
}

/**
 * Pornește jocul principal, afișând interfața de joc.
 */
function startGame() {
    // Afișează interfața principală a jocului
    gameContainer.style.display = 'flex'; // Afișează containerul principal (folosind flexbox)
    nameModal.style.display = 'none'; // Ascunde modalul de nume
    raceSelectionScreen.style.display = 'none'; // Ascunde ecranul de selecție rasă

    updateHUD(); // Actualizează HUD-ul cu numele și rasa jucătorului
    renderBuildings(); // Afișează vizualizarea clădirilor implicit
}

// --- Game Loop (Actualizare Producție) ---
// Actualizează resursele în fiecare secundă pe baza producției orare
setInterval(() => {
    const userData = getUserData();
    const production = userData.production;

    // Convertim producția orară în producție pe secundă
    const metalPerSecond = production.metal / 3600;
    const crystalPerSecond = production.crystal / 3600;
    const energyPerSecond = production.energy / 3600;
    const heliumPerSecond = production.helium / 3600;

    // Actualizează resursele pentru 1 secundă
    updateResources(metalPerSecond, crystalPerSecond, energyPerSecond, heliumPerSecond);
}, 1000);

// Expune funcția resetGame la nivel global pentru a fi apelabilă din consolă
window.resetGame = resetGame;
