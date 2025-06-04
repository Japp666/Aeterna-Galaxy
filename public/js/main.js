console.log('main.js loaded');

window.gameState = window.gameState || {
    resources: { metal: 2500, crystal: 4000, helium: 0, energy: 100, research: 0 },
    buildings: {},
    researches: {},
    fleet: {},
    player: { nickname: '', race: null, coords: [10, 10] },
    players: [{ id: 'ally', coords: [12, 11] }, { id: 'enemy', coords: [8, 9] }],
    raceBonus: {},
    isResearching: false,
    isBuilding: false
};

function initializeGame() {
    console.log('DOM loaded, initializing game');
    loadGame();
    updateHUD();
    loadComponent('components/tab-home.html').then(() => {
        console.log('tab-home.html loaded');
        const raceSelect = document.getElementById('race-selection');
        const nicknameContainer = document.getElementById('nickname-container');
        if (raceSelect && !gameState.player.race) {
            console.log('Initializing race selection');
            initializeRaceSelection();
        } else if (gameState.player.race) {
            console.log('Race selected:', gameState.player.race);
        }
        if (nicknameContainer) {
            nicknameContainer.style.display = 'flex';
            console.log('Nickname container visible');
        } else {
            console.error('Nickname container missing');
        }
    }).catch(err => console.error('Failed to load tab-home.html:', err));

    const buttons = [
        { id: 'home-btn', url: 'components/tab-home.html' },
        { id: 'buildings-btn', url: 'components/tab-buildings.html', init: initializeBuildings },
        { id: 'research-btn', url: 'components/tab-research.html', init: initializeResearch },
        { id: 'fleet-btn', url: 'components/tab-fleet.html' },
        { id: 'map-btn', url: 'components/tab-map.html', init: () => {
            console.log('Initializing map');
            if (typeof initializeMap === 'function') {
                initializeMap();
            } else {
                console.error('initializeMap not defined');
            }
        }},
        { id: 'reset-btn', action: () => {
            localStorage.removeItem('galaxiaAeterna');
            location.reload();
        }}
    ];

    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element) {
            element.addEventListener('click', () => {
                console.log(`Clicked ${btn.id}`);
                if (btn.action) {
                    btn.action();
                } else {
                    loadComponent(btn.url).then(() => {
                        if (btn.init) btn.init();
                    }).catch(err => console.error(`Failed to load ${btn.url}:`, err));
                }
            });
        } else {
            console.warn(`Button #${btn.id} not found`);
        }
    });

    function initNicknameInput(attempts = 0, maxAttempts = 10) {
        const nicknameInput = document.getElementById('nickname-input');
        const nicknameSubmit = document.getElementById('nickname-submit-btn');
        if (nicknameInput && nicknameSubmit) {
            nicknameSubmit.addEventListener('click', () => {
                const nickname = nicknameInput.value.trim();
                if (nickname) {
                    gameState.player.nickname = nickname;
                    console.log('Nickname set:', nickname);
                    saveGame();
                    loadComponent('components/tab-home.html');
                }
            });
            console.log('Nickname input initialized');
        } else if (attempts < maxAttempts) {
            console.warn(`Nickname elements not found (attempt ${attempts + 1})`);
            setTimeout(() => initNicknameInput(attempts + 1), 100);
        } else {
            console.error('Failed to initialize nickname input');
        }
    }
    setTimeout(initNicknameInput, 100);
}

function loadComponent(url) {
    console.log('Loading:', url);
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
    }).then(html => {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = html;
            console.log('Loaded:', url);
            updateHUD();
            saveGame();
            return html;
        }
        throw new Error('Content element missing');
    }).catch(err => console.error('Load failed:', url, err));
}

document.addEventListener('DOMContentLoaded', initializeGame);
