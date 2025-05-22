import { setPlayerName, setPlayerRace } from './user.js';

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
  messageContainer.className = `message-container ${type}`;
  messageContainer.style.display = 'block';
  messageContainer.style.opacity = '1';
  // Ascunde mesajul după 3 secunde
  setTimeout(() => {
    messageContainer.style.opacity = '0';
    setTimeout(() => {
      messageContainer.style.display = 'none';
      messageContainer.textContent = '';
      messageContainer.className = 'message-container';
    }, 500);
  }, 3000);
}

/**
 * Afișează modalul pentru introducerea numelui jucătorului.
 * Returnează o promisiune care se rezolvă când numele este salvat.
 */
export function showNameModal() {
  return new Promise((resolve) => {
    const nameModal = document.getElementById('name-modal');
    if (!nameModal) {
      console.error("Elementul #name-modal nu a fost găsit.");
      resolve(); // Rezolvă imediat dacă modalul nu există
      return;
    }
    nameModal.style.display = 'flex'; // Asigură-te că modalul este afișat ca flex
    // Referințele sunt acum la versiunile cu ID-uri unice
    const saveNameButton = document.getElementById('save-name-button-unique');
    const playerNameInput = document.getElementById('player-name-input-unique');
    if (!saveNameButton || !playerNameInput) {
      console.error("Butonul sau input-ul pentru nume nu a fost găsit în modal.");
      resolve();
      return;
    }
    playerNameInput.value = ''; // Curăță inputul la fiecare afișare
    // Elimină orice listener anterior pentru a preveni duplicarea
    const handleSaveName = (event) => {
      const name = playerNameInput.value.trim();
      if (name) {
        setPlayerName(name); // Salvează numele prin user.js
        nameModal.style.display = 'none';
        showMessage(`Bun venit, Comandante ${name}!`, "success");
        saveNameButton.removeEventListener('click', handleSaveName);
        resolve(); // Rezolvă promisiunea
      } else {
        showMessage("Numele nu poate fi gol!", "error");
      }
    };
    saveNameButton.addEventListener('click', handleSaveName);
  });
}

/**
 * Afișează ecranul de selecție a rasei.
 * Returnează o promisiune care se rezolvă când rasa este selectată.
 */
export function showRaceSelectionScreen() {
  return new Promise((resolve) => {
    const raceSelectionScreen = document.getElementById('race-selection-screen');
    if (!raceSelectionScreen) {
      console.error("Elementul #race-selection-screen nu a fost găsit.");
      resolve();
      return;
    }
    raceSelectionScreen.style.display = 'flex'; // Asigură-te că modalul este afișat ca flex
    const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');
    if (!raceCardsContainer) {
      console.error("Elementul .race-cards-container nu a fost găsit în modalul de selecție rasă.");
      resolve();
      return;
    }
    raceCardsContainer.innerHTML = ''; // Curăță conținutul existent
    // Definiția raselor - DOAR Solari și Coming Soon
    const races = [
      { id: 'Solari', name: 'Solari', description: 'Maestri ai energiei, cu bonusuri la producția de energie.', image: 'https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png', bonus: 'Producție Energie +20%' },
      { id: 'ComingSoon', name: 'Curând', description: 'O nouă rasă misterioasă va fi disponibilă în viitor!', image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png', bonus: '???', disabled: true }
    ];
    races.forEach(race => {
      const raceCard = document.createElement('div');
      raceCard.className = `race-card ${race.disabled ? 'disabled' : ''}`;
      raceCard.innerHTML = `
        <img src="${race.image}" alt="${race.name}" class="card-image" onerror="this.onerror=null;this.src='https://i.imgur.com/Z4YhZ1Y.png';">
        <h3 class="card-title">${race.name}</h3>
        <p class="card-description">${race.description}</p>
        <p>Bonus: ${race.bonus}</p>
        <button class="select-race-button" data-race-id="${race.id}" ${race.disabled ? 'disabled' : ''}>
          ${race.disabled ? 'Curând' : 'Selectează'}
        </button>
      `;
      raceCardsContainer.appendChild(raceCard);
    });
    // Adaugă event listeners pentru butoane
    const selectButtons = raceCardsContainer.querySelectorAll('.select-race-button');
    if (selectButtons.length === 0) {
      console.warn("Niciun buton de selecție rasă găsit după generare.");
      resolve();
      return;
    }
    const handleSelectRace = (event) => {
      const selectedRaceId = event.target.dataset.raceId;
      if (event.target.disabled) {
        return;
      }
      setPlayerRace(selectedRaceId);
      raceSelectionScreen.style.display = 'none';
      showMessage(`Ai ales rasa ${selectedRaceId}!`, "success");
      // Elimină toți listenerii după selecție pentru a preveni multiple apeluri
      selectButtons.forEach(btn => {
        btn.removeEventListener('click', handleSelectRace);
      });
      resolve();
    };
    selectButtons.forEach(button => {
      button.addEventListener('click', handleSelectRace);
    });
  });
}
