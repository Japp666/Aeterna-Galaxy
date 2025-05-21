// js/utils.js

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
 */
export function showNameModal() { // <-- Adăugat 'export' aici
    const nameModal = document.getElementById('name-modal');
    nameModal.style.display = 'flex'; // Folosește flex pentru centrare

    const saveNameButton = document.getElementById('save-name-button');
    const playerNameInput = document.getElementById('player-name-input');

    // Asigură-te că event listener-ul este adăugat o singură dată
    if (!saveNameButton.dataset.listenerAdded) {
        saveNameButton.dataset.listenerAdded = 'true';
        saveNameButton.addEventListener('click', () => {
            const name = playerNameInput.value.trim();
            if (name) {
                // Aici ar trebui să chemi o funcție din user.js pentru a salva numele
                // Deocamdată, doar îl logăm și ascundem modalul
                console.log(`Nume salvat: ${name}`);
                nameModal.style.display = 'none';
                // Probabil vei vrea să randezi ecranul de selecție a rasei după salvarea numelui
                // Sau să actualizezi HUD-ul cu noul nume
            } else {
                showMessage("Numele nu poate fi gol!", "error");
            }
        });
    }
}

/**
 * Afișează ecranul de selecție a rasei.
 * Se presupune că player name este deja setat.
 */
export function showRaceSelectionScreen() { // <-- Adăugat 'export' și aici (pentru siguranță)
    const raceSelectionScreen = document.getElementById('race-selection-screen');
    raceSelectionScreen.style.display = 'flex'; // Folosește flex pentru centrare

    const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');
    raceCardsContainer.innerHTML = ''; // Curăță conținutul existent

    // Definiția raselor (ar putea veni dintr-un fișier separat mai târziu)
    const races = [
        { id: 'Solari', name: 'Solari', description: 'Maestri ai energiei, cu bonusuri la producția de energie.', image: 'https://i.postimg.cc/tJnQ1F5J/solari.jpg', bonus: 'Producție Energie +20%' },
        { id: 'Xylos', name: 'Xylos', description: 'Specializați în minerit, cu bonusuri la extracția de metal și cristal.', image: 'https://i.postimg.cc/Nj0v2g38/Xylos.jpg', bonus: 'Producție Metal/Cristal +15%' },
        { id: 'Aetheri', name: 'Aetheri', description: 'Cercetători avansați, cu bonusuri la viteza de cercetare.', image: 'https://i.postimg.cc/X751pZ6k/Aetheri.jpg', bonus: 'Viteză Cercetare +10%' }
    ];

    races.forEach(race => {
        const raceCard = document.createElement('div');
        raceCard.className = 'race-card';
        raceCard.innerHTML = `
            <img src="${race.image}" alt="${race.name}" onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
            <h3>${race.name}</h3>
            <p>${race.description}</p>
            <p>Bonus: ${race.bonus}</p>
            <button class="select-race-button" data-race-id="${race.id}">Selectează</button>
        `;
        raceCardsContainer.appendChild(raceCard);
    });

    raceCardsContainer.querySelectorAll('.select-race-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedRaceId = event.target.dataset.raceId;
            // Aici ar trebui să chemi o funcție din user.js pentru a seta rasa
            // Deocamdată, doar o logăm și ascundem modalul
            console.log(`Rasa selectată: ${selectedRaceId}`);
            raceSelectionScreen.style.display = 'none';
            // După selecția rasei, vei vrea să inițiezi jocul cu conținutul principal
            // (e.g., randarea clădirilor sau a hărții)
        });
    });
}
