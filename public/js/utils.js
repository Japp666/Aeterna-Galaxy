import { setPlayerName, setPlayerRace } from './user.js';
import { updateHUD } from './hud.js';

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

    setTimeout(() => {
        messageContainer.style.opacity = '0';
        setTimeout(() => {
            messageContainer.style.display = 'none';
            messageContainer.textContent = '';
            messageContainer.className = 'message-container';
        }, 500);
    }, 3000);
}

export function showNicknameModal() {
    return new Promise((resolve) => {
        const nicknameModal = document.getElementById('nickname-modal');
        if (!nicknameModal) {
            console.error("Elementul #nickname-modal nu a fost găsit.");
            resolve();
            return;
        }
        nicknameModal.style.display = 'flex';

        const saveNicknameButton = document.getElementById('save-nickname-button');
        const nicknameInput = document.getElementById('nickname-input');

        if (!saveNicknameButton || !nicknameInput) {
            console.error("Butonul sau input-ul pentru nickname nu a fost găsit în modal.");
            resolve();
            return;
        }

        nicknameInput.value = '';

        const handleSaveNickname = async (event) => {
            const nickname = nicknameInput.value.trim();
            if (nickname) {
                const docRef = firebase.firestore().collection('players').doc(nickname);
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    showMessage('Acest nickname este deja folosit. Alege altul.', 'error');
                    return;
                }
                await setPlayerName(nickname);
                await loadPlayerData(nickname);
                nicknameModal.style.display = 'none';
                showMessage(`Bun venit, Comandante ${nickname}!`, "success");
                updateHUD();
                saveNicknameButton.removeEventListener('click', handleSaveNickname);
                resolve();
            } else {
                showMessage("Nickname-ul nu poate fi gol!", "error");
            }
        };
        saveNicknameButton.addEventListener('click', handleSaveNickname);
    });
}

export function showRaceSelectionScreen() {
    return new Promise((resolve) => {
        const raceSelectionScreen = document.getElementById('race-selection-screen');
        if (!raceSelectionScreen) {
            console.error("Elementul #race-selection-screen nu a fost găsit.");
            resolve();
            return;
        }
        raceSelectionScreen.style.display = 'flex';

        const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');
        if (!raceCardsContainer) {
            console.error("Elementul .race-cards-container nu a fost găsit.");
            resolve();
            return;
        }
        raceCardsContainer.innerHTML = '';

        const races = [
            { 
                id: 'Solari', 
                name: 'Solari', 
                description: 'Maeștri ai energiei, cu bonusuri la producția de energie.', 
                image: 'https://i.postimg.cc/d07m01yM/fundal-joc.png', // Imagine temporară
                bonus: 'Producție Energie +20%' 
            },
            { 
                id: 'ComingSoon', 
                name: 'Curând', 
                description: 'O nouă rasă misterioasă va fi disponibilă în viitor!', 
                image: 'https://i.postimg.cc/ydLx2C1L/coming-soon.png', 
                bonus: '???', 
                disabled: true 
            }
        ];

        races.forEach(race => {
            const raceCard = document.createElement('div');
            raceCard.className = `race-card ${race.disabled ? 'disabled' : ''}`;
            raceCard.innerHTML = `
                <img src="${race.image}" alt="${race.name}" class="card-image" onerror="this.src='https://i.postimg.cc/d07m01yM/fundal-joc.png';">
                <h3 class="card-title">${race.name}</h3>
                <p class="card-description">${race.description}</p>
                <p>Bonus: ${race.bonus}</p>
                <button class="select-race-button" data-race-id="${race.id}" ${race.disabled ? 'disabled' : ''}>${race.disabled ? 'Curând' : 'Selectează'}</button>
            `;
            raceCardsContainer.appendChild(raceCard);
        });

        const selectButtons = raceCardsContainer.querySelectorAll('.select-race-button');
        if (selectButtons.length === 0) {
            console.warn("Niciun buton de selecție rasă găsit.");
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
            updateHUD();
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
