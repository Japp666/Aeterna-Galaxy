console.log('main.js loaded');

async function loadComponent(component) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('Content div not found');
        return;
    }
    try {
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`Failed to load ${component}.html`);
        contentDiv.innerHTML = await response.text();
        if (component === 'tab-buildings') initializeBuildings();
        if (component === 'race-select') initializeRaceSelection();
        if (component === 'hud') updateHUD();
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nicknameModal = document.getElementById('nickname-modal');
    const submitNickname = document.getElementById('submit-nickname');
    const nicknameInput = document.getElementById('nickname-input');

    if (!nicknameModal || !submitNickname || !nicknameInput) {
        console.error('Nickname modal elements not found');
        return;
    }

    nicknameModal.style.display = 'block';

    submitNickname.onclick = () => {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            gameState.player.name = nickname;
            nicknameModal.style.display = 'none';
            loadComponent('race-select');
            updateHUD();
        } else {
            showMessage('Introdu un nume valid!', 'error');
        }
    };

    document.querySelectorAll('#menu-container a').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const component = link.dataset.content;
            loadComponent(component);
        };
    });

    loadComponent('tab-home');
});
