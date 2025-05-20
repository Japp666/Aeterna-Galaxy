// js/utils.js
export function showMessage(message, type = 'info', duration = 3000) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        console.warn('Elementul #message-container nu a fost găsit.');
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;

    messageContainer.appendChild(messageElement);
    messageContainer.style.display = 'block'; // Asigură că containerul este vizibil

    setTimeout(() => {
        messageElement.remove();
        if (messageContainer.children.length === 0) {
            messageContainer.style.display = 'none'; // Ascunde containerul dacă nu mai sunt mesaje
        }
    }, duration);
}
