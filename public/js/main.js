console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing game');
    loadGame();
    
    const nicknameModal = document.getElementById('nickname-modal');
    const raceModal = document.getElementById('race-modal');
    const tutorialModal = document.getElementById('tutorial-modal');
    const submitNickname = document.getElementById('submit-nickname');
    const nicknameInput = document.getElementById('nickname');
    const header = document.querySelector('header');
    const nav = document.querySelector('.sidebar-menu');
    const hud = document.getElementById('hud');
    const content = document.getElementById('content');
    const resetButton = document.getElementById('reset-game');

    if (!nicknameModal || !raceModal || !tutorialModal || !submitNickname || !nicknameInput || !nav || !hud || !content) {
        console.error('Critical elements missing');
        showMessage('Eroare la inițializarea jocului! Verifică consola.', 'error');
        return;
    }

    // Inițializează starea UI
    nicknameModal.style.display = 'none';
    raceModal.style.display = 'none';
    tutorialModal.style.display = 'none';
    header.style.display = 'none';
    nav.style.display = 'none';
    hud.style.display = 'none';
    content.style.display = 'none';
    resetButton.style.display = 'none';

    // Încarcă HUD-ul mai întâi
    await loadComponent('hud', 'hud');
    hud.style.display = 'flex';

    // Verifică starea jocului
    if (gameState.player.nickname && gameState.player.race && gameState.player.nickname.length >= 3 && gameState.player.race !== '') {
        // Jucătorul are nickname și rasă valide, afișăm interfața principală
        header.style.display = 'block';
        nav.style.display = 'flex';
        content.style.display = 'block';
        resetButton.style.display = 'block';
        await loadComponent('tab-home');
        updateHUD();
    } else {
        // Forțează afișarea nickname-modal dacă starea este incompletă
        nicknameModal.style.display = 'flex';
    }

    submitNickname.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        if (nickname.length < 3) {
            showMessage('Nickname-ul trebuie să aibă minim 3 caractere!', 'error');
            console.warn('Invalid nickname:', nickname);
            return;
        }
        gameState.player.nickname = nickname;
        console.log('Nickname set:', nickname);
        saveGame();
        
        nicknameModal.style.display = 'none';
        raceModal.style.display = 'flex';
        initializeRaceSelection();
    });

    window.onRaceSelected = async (race) => {
        gameState.player.race = race;
        console.log('Race selected:', race);
        saveGame();
        
        raceModal.style.display = 'none';
        header.style.display = 'block';
        nav.style.display = 'flex';
        content.style.display = 'block';
        resetButton.style.display = 'block';
        
        await loadComponent('tab-home');
        updateHUD();
    };

    nav.addEventListener('click', async (e) => {
        const item = e.target.closest('.menu-item');
        if (!item) return;
        e.preventDefault();
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const component = item.getAttribute('data-component');
        console.log('Loading component:', component);
        await loadComponent(component);
        if (component === 'tab-buildings') {
            console.log('Initializing buildings');
            setTimeout(() => initializeBuildings(), 100);
        } else if (component === 'tab-map') {
            console.log('Initializing map');
            setTimeout(() => initializeMap(), 100);
        } else if (component === 'tab-research') {
            console.log('Initializing research');
            setTimeout(() => initializeResearch(), 100);
        } else if (component === 'tab-fleet') {
            console.log('Initializing fleet');
            setTimeout(() => initializeFleet(), 100);
        } else if (component === 'tab-tutorial') {
            console.log('Initializing tutorial');
            tutorialModal.style.display = 'flex';
            document.getElementById('tutorial-text-content').innerHTML = document.querySelector('.tab-content').innerHTML;
        }
    });

    resetButton.addEventListener('click', () => {
        console.log('Resetting game');
        resetGame();
    });

    document.getElementById('next-tutorial').addEventListener('click', async () => {
        tutorialModal.style.display = 'none';
        await loadComponent('tab-home');
        document.querySelector('.menu-item[data-component="tab-home"]').classList.add('active');
    });
});
