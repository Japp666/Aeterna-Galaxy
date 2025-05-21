// js/utils.js

import { setPlayerName, setPlayerRace } from './user.js';
import { updateHUD } from './hud.js';

/**
 * Afișează un mesaj temporar utilizatorului.
 * @param {string} message Textul mesajului.
 * @param {string} type Tipul mesajului (e.g., 'success', 'error', 'info').
 */
export function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        console.warn("Elementul #message-container nu a fost găsit.");
        return;
    }

    messageContainer.textContent = message;
    messageContainer.className = `message-container ${type}`; // Adaugă clasa pentru stilizare
    messageContainer.style.display = 'block'; // Afișează containerul

    // Ascunde mesajul după 3 secunde
    setTimeout(() => {
        messageContainer.style.display = 'none';
        messageContainer.textContent = ''; // Curăță textul
        messageContainer.className = 'message-container'; // Resetează clasele
    }, 3000);
}

/**
 * Afișează modalul pentru introducerea numelui jucătorului.
 * Returnează o Promisiune care se rezolvă când numele este salvat.
 */
export function showNameModal() {
    return new Promise((resolve) => {
        const nameModal = document.getElementById('name-modal');
        nameModal.style.display = 'flex'; // Folosește flex pentru centrare

        const saveNameButton = document.getElementById('save-name-button');
        const playerNameInput = document.getElementById('player-name-input');

        playerNameInput.value = ''; // Curăță inputul la fiecare afișare

        const handleSaveName = () => {
            const name = playerNameInput.value.trim();
            if (name) {
                setPlayerName(name); // Salvează numele prin user.js
                nameModal.style.display = 'none';
                showMessage(`Bun venit, Comandante ${name}!`, "success");
                // Remove the event listener to prevent multiple calls
                saveNameButton.removeEventListener('click', handleSaveName);
                resolve(); // Rezolvă promisiunea
            } else {
                showMessage("Numele nu poate fi gol!", "error");
            }
        };

        // Make sure event listener is added only once
        // (This check is more robust if the modal isn't fully recreated)
        // For now, removing it after use in handleSaveName is sufficient.
        saveNameButton.addEventListener('click', handleSaveName);
    });
}

/**
 * Afișează ecranul de selecție a rasei.
 * Returnează o Promisiune care se rezolvă când rasa este selectată.
 */
export function showRaceSelectionScreen() {
    return new Promise((resolve) => {
        const raceSelectionScreen = document.getElementById('race-selection-screen');
        raceSelectionScreen.style.display = 'flex'; // Folosește flex pentru centrare

        const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');
        raceCardsContainer.innerHTML = ''; // Curăță conținutul existent

        // Definiția raselor
        const races = [
            { id: 'Solari', name: 'Solari', description: 'Maestri ai energiei, cu bonusuri la producția de energie.', image: 'https://i.postimg.cc/tJnQ1F5J/solari.jpg', bonus: 'Producție Energie +20%' },
            { id: 'Xylos', name: 'Xylos', description: 'Specializați în minerit, cu bonusuri la extracția de metal și cristal.', image: 'https://i.postimg.cc/Nj0v2g38/Xylos.jpg', bonus: 'Producție Metal/Cristal +15%' }
            // Am eliminat celelalte 2 rase (Aetheri și orice "Coming Soon")
            // Dacă ai mai multe imagini pentru rase, asigură-te că URL-urile sunt corecte.
            // Exemplu pentru "Coming Soon" dacă vrei să o incluzi dar inactivă:
            // { id: 'ComingSoon', name: 'Coming Soon', description: 'O nouă rasă misterioasă va fi disponibilă în viitor!', image: 'https://i.postimg.cc/k47tXh8g/coming-soon-race.jpg', bonus: '???', disabled: true }
        ];

        races.forEach(race => {
            const raceCard = document.createElement('div');
            // Adaugă clasa 'disabled' dacă rasa este marcată ca atare
            raceCard.className = `race-card ${race.disabled ? 'disabled' : ''}`;
            raceCard.innerHTML = `
                <img src="${race.image}" alt="${race.name}" class="card-image" onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
                <h3 class="card-title">${race.name}</h3>
                <p class="card-description">${race.description}</p>
                <p>Bonus: ${race.bonus}</p>
                <button class="select-race-button" data-race-id="${race.id}" ${race.disabled ? 'disabled' : ''}>${race.disabled ? 'Curând' : 'Selectează'}</button>
            `;
            raceCardsContainer.appendChild(raceCard);
        });

        raceCardsContainer.querySelectorAll('.select-race-button').forEach(button => {
            // Nu adăuga listener pe butoanele disabled
            if (button.disabled) {
                return;
            }

            const handleSelectRace = (event) => {
                const selectedRaceId = event.target.dataset.raceId;
                setPlayerRace(selectedRaceId); // Setează rasa prin user.js
                raceSelectionScreen.style.display = 'none';
                showMessage(`Ai ales rasa ${selectedRaceId}!`, "success");
                // Elimină toți listenerii după selecție pentru a preveni multiple apeluri
                raceCardsContainer.querySelectorAll('.select-race-button').forEach(btn => {
                    btn.removeEventListener('click', handleSelectRace);
                });
                resolve(); // Rezolvă promisiunea
            };
            button.addEventListener('click', handleSelectRace);
        });
    });
}
