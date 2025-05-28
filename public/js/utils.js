console.log('utils.js loaded');

function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    document.getElementById('message-container').appendChild(message);
    setTimeout(() => message.remove(), 3000);
}
