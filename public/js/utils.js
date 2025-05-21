// js/utils.js

/**
 * Afișează un mesaj temporar utilizatorului.
 * @param {string} message Textul mesajului.
 * @param {string} type Tipul mesajului ('success', 'error', 'info').
 */
export function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        console.warn("Elementul #message-container nu a fost găsit în DOM.");
        return;
    }

    const msgElement = document.createElement('div');
    msgElement.textContent = message;
    msgElement.className = `message ${type}`; // Adaugă clasa de tip pentru stilizare (ex: message success)

    messageContainer.appendChild(msgElement);
    messageContainer.style.display = 'block'; // Asigură-te că containerul e vizibil

    // Ascunde mesajul după 3 secunde
    setTimeout(() => {
        msgElement.remove();
        if (messageContainer.children.length === 0) {
            messageContainer.style.display = 'none'; // Ascunde containerul dacă nu mai sunt mesaje
        }
    }, 3000);
}
