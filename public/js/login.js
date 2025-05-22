import { showMessage } from './utils.js';
import { setPlayerName, loadPlayerData } from './user.js';

export function showNicknameModal() {
    return new Promise((resolve) => {
        const nicknameModal = document.getElementById('nickname-modal');
        const nicknameInput = document.getElementById('nickname-input');
        const saveNicknameButton = document.getElementById('save-nickname-button');
        const errorElement = document.getElementById('nickname-error');

        if (!nicknameModal || !nicknameInput || !saveNicknameButton || !errorElement) {
            console.error("Elementele modalului pentru nickname nu au fost găsite.");
            resolve();
            return;
        }

        nicknameModal.style.display = 'flex';
        nicknameInput.value = '';

        const handleSaveNickname = async () => {
            const nickname = nicknameInput.value.trim();
            if (!nickname) {
                errorElement.textContent = 'Te rugăm să introduci un nickname.';
                errorElement.style.display = 'block';
                return;
            }

            try {
                const docRef = firebase.firestore().collection('players').doc(nickname);
                const docSnap = await docRef.get();
                if (docSnap.exists()) {
                    errorElement.textContent = 'Acest nickname este deja folosit. Alege altul.';
                    errorElement.style.display = 'block';
                    return;
                }

                await setPlayerName(nickname);
                await loadPlayerData(nickname);
                nicknameModal.style.display = 'none';
                showMessage(`Bun venit, ${nickname}!`, 'success');
                errorElement.style.display = 'none';
                saveNicknameButton.removeEventListener('click', handleSaveNickname);
                resolve();
            } catch (error) {
                console.error('Eroare la verificarea nickname-ului:', error);
                errorElement.textContent = 'Eroare la salvarea nickname-ului. Încearcă din nou.';
                errorElement.style.display = 'block';
            }
        };

        saveNicknameButton.addEventListener('click', handleSaveNickname);
    });
}
