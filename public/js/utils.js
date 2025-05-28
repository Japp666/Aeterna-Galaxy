console.log('utils.js loaded successfully');

function showMessage(message, type) {
    console.log(`Message [${type}]: ${message}`);
    const container = document.createElement('div');
    container.className = `message message-${type}`;
    container.textContent = message;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.padding = '10px';
    container.style.backgroundColor = type === 'error' ? '#ff4444' : '#44ff44';
    container.style.color = '#fff';
    container.style.zIndex = '10000';
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
}

window.showMessage = showMessage;
