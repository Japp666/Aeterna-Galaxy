console.log('main.js loaded');

async function loadComponent(component, targetId = 'content') {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) {
        console.error(`Target div #${targetId} not found`);
        return;
    }
    try {
        const response = await fetch(`components/${component}.html`);
        if (!response.ok) throw new Error(`Failed to load ${component}.html: ${response.status}`);
        targetDiv.innerHTML = await response.text();
        console.log(`Loaded ${component}.html into #${targetId}`);
        if (component === 'tab-buildings') initializeBuildings();
    } catch (error) {
        console.error(`Error loading ${component}.html:`, error);
        targetDiv.innerHTML = `<p>Eroare la încărcarea ${component}. Verifică consola.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, loading HUD');
    await loadComponent('hud', 'hud-container');
    await loadComponent('tab-home');

    const nicknameModal = document.getElementById('nickname-modal');
    const submitNickname = document.getElementById('submit-nickname');
    const nicknameInput = document.getElementById('nickname-input');
    const raceModal = document.getElementById('race-modal');

    if (!nicknameModal || !submitNickname || !nicknameInput || !raceModal) {
        console.error('Modal elements not found');
        return;
    }

    nicknameModal.style.display = 'block';

    submitNickname.onclick = () => {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            gameState.player.name = nickname;
            nicknameModal.style.display = 'none';
            console.log('Showing race modal');
            raceModal.style.display = 'flex';
            initializeRaceSelection();
        } else {
            showMessage('Introdu un nume valid!', 'error');
        }
    };

    document.querySelectorAll('#menu-container a').forEach(link => {
        link.onclick = async (e) => {
            e.preventDefault();
            const component = link.dataset.content;
            console.log(`Menu clicked: ${component}`);
            // Remove active class from all links
            document.querySelectorAll('#menu-container a').forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
            await loadComponent(component);
        };
    });

    // Set initial active menu
    const homeLink = document.querySelector('#menu-container a[data-content="tab-home"]');
    if (homeLink) homeLink.classList.add('active');
});
