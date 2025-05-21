// js/utils.js

// Funcție pentru afișarea tab-urilor
export function showTab(tabId) {
    // Ascunde toate tab-urile
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Afișează tab-ul dorit
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Funcție pentru afișarea mesajelor de notificare
export function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        console.warn("Message container not found!");
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type); // Adaugă clasa de tip (info, success, error)
    messageElement.textContent = message;

    messageContainer.appendChild(messageElement);

    // Fade out and remove after a few seconds
    setTimeout(() => {
        messageElement.classList.add('hide');
        messageElement.addEventListener('transitionend', () => messageElement.remove());
    }, 3000); // Mesajul dispare după 3 secunde
}
