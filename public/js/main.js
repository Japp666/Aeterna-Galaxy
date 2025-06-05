console.log('main.js loaded');

const componentCache = {};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game');
    loadGame();
    
    const nicknameModal = document.getElementById('nickname-modal');
    const raceModal = document.getElementById('race-modal');
    const submitNickname = document.getElementById('submit-nickname');
    const nicknameInput = document.getElementById('nickname');
    const header = document.querySelector('header');
    const nav = document.querySelector('.sidebar-menu');
    const hud = document.getElementById('hud');
    const content = document.getElementById('content');
    const resetButton = document.getElementById('reset-game');

    if (!nicknameModal || !raceModal || !submitNickname || !nicknameInput || !nav || !hud || !content) {
        console.error('Critical elements missing');
        return;
    }

    nicknameModal.style.display = 'flex';
    raceModal.style.display = 'none';
    
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

    window.onRaceSelected = (race) => {
        gameState.player.race = race;
        console.log('Race selected:', race);
        saveGame();
        
        raceModal.style.display = 'none';
        header.style.display = 'block';
        nav.style.display = 'flex';
        hud.style.display = 'flex';
        content.style.display = 'block';
        resetButton.style.display = 'block';
        
        loadComponent('tab-home');
        updateHUD();
    };

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async e => {
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
            }
        });
    });

    resetButton.addEventListener('click', () => {
        console.log('Resetting game');
        resetGame();
    });
});

async function loadComponent(component, targetId = 'content') {
    if (componentCache[component]) {
        const targetDiv = document.getElementById(targetId);
        targetDiv.innerHTML = componentCache[component];
        console.log(`Loaded ${component} from cache`);
        return;
    }
    await loadComponent(component, targetId);
    componentCache[component] = document.getElementById(targetId).innerHTML;
}
