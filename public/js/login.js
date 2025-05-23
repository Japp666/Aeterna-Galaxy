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
            showMessage('Eroare internă: Elementele UI lipsesc.', 'error');
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

            // Validare lungime nickname
            if (nickname.length < 3 || nickname.length > 20) {
                errorElement.textContent = 'Nickname-ul trebuie să aibă între 3 și 20 de caractere.';
                errorElement.style.display = 'block';
                return;
            }

            // Validare caractere (doar litere, cifre, și _)
            if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
                errorElement.textContent = 'Nickname-ul poate conține doar litere, cifre și _.';
                errorElement.style.display = 'block';
                return;
            }

            try {
                // Verificăm dacă Firestore este inițializat
                if (!firebase.firestore) {
                    throw new Error('Firestore nu este inițializat. Verifică configurația Firebase.');
                }

                const db = firebase.firestore();
                const docRef = db.collection('players').doc(nickname);
                const docSnap = await docRef.get();

                if (docSnap.exists) {
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
                console.error('Eroare detaliată la salvarea nickname-ului:', error);
                let errorMessage = 'Eroare la salvarea nickname-ului. Încearcă din nou.';
                if (error.code === 'permission-denied') {
                    errorMessage = 'Acces refuzat: Verifică regulile Firestore.';
                } else if (error.message.includes('Firestore nu este inițializat')) {
                    errorMessage = 'Eroare de configurare: Firestore nu este disponibil.';
                } else if (error.code === 'unavailable') {
                    errorMessage = 'Firestore este indisponibil. Verifică conexiunea la internet.';
                }
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        };

        saveNicknameButton.addEventListener('click', handleSaveNickname);
    });
}
