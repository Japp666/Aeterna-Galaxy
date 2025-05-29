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
        console.log(`Loaded ${component}.html`);
        if (component === 'tab-buildings') initializeBuildings();
        if (component === 'race-select') initializeRaceSelection();
        if (component === 'hud') updateHUD();
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error);
        contentDiv.innerHTML = `<p>Eroare la încărcarea ${component}. Verifică consola.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const nicknameModal = document.getElementById('nickname-modal');
    const submitNickname = document.getElementById('submit-nickname');
    const nicknameInput = document.getElementById('nickname-input');

    if (!nicknameModal || !submitNickname || !nicknameInput) {
        console.error('Nickname modal elements not found');
        return;
    }

    nicknameModal.style.display = 'block';

    submitNickname.onclick = async () => {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            gameState.player.name = nickname;
            nicknameModal.style.display = 'none';
            await loadComponent('hud'); // Încarcă HUD mai întâi
            await loadComponent('race-select');
            updateHUD();
        } else {
            showMessage('Introdu un nume valid!', 'error');
        }
    };

    document.querySelectorAll('#menu-container a').forEach(link => {
        link.onclick = async (e) => {
            e.preventDefault();
            const component = link.dataset.content;
            await loadComponent(component);
        };
    });

    await loadComponent('tab-home');
});
