console.log('main.js loaded');

let gameState = {
    resources: { metal: 2500, crystal: 4000, helium: 0, energy: 100, research: 0 },
    buildings: {},
    researches: {},
    fleet: {},
    player: { nickname: '', race: null, coords: null },
    players: [],
    raceBonus: {},
    isResearching: false,
    isBuilding: false
};

function initializeGame() {
    console.log('DOM loaded, initializing game');
    loadGame();
    updateHUD();
    loadComponent('components/tab-home.html');

    const raceSelect = document.getElementById('race-selection');
    if (!gameState.player.race && raceSelect) {
        initializeRaceSelection();
    } else if (gameState.player.race) {
        console.log('Race selected:', gameState.player.race);
    }

    document.getElementById('home-btn').addEventListener('click', () => loadComponent('components/tab-home.html'));
    document.getElementById('buildings-btn').addEventListener('click', () => {
        loadComponent('components/tab-buildings.html').then(() => {
            console.log('Initializing buildings');
            initializeBuildings();
        });
    });
    document.getElementById('research-btn').addEventListener('click', () => {
        loadComponent('components/tab-research.html').then(() => {
            console.log('Initializing research');
            initializeResearch();
        });
    });
    document.getElementById('fleet-btn').addEventListener('click', () => loadComponent('components/tab-fleet.html'));
    document.getElementById('map-btn').addEventListener('click', () => {
        loadComponent('components/tab-map.html').then(() => {
            console.log('Initializing map');
            if (typeof initializeMap === 'function') {
                initializeMap();
            } else {
                console.error('initializeMap is not defined');
            }
        });
    });
    document.getElementById('reset-btn').addEventListener('click', () => {
        localStorage.removeItem('galaxiaAeterna');
        location.reload();
    });

    const nicknameInput = document.getElementById('nickname-input');
    const nicknameSubmit = document.getElementById('nickname-submit');
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
    }
}

function loadComponent(url) {
    console.log('Loading component:', url);
    return fetchComponent(url).then(html => {
        document.getElementById('content').innerHTML = html;
        console.log('Loaded', url, 'into #content');
        updateHUD();
        saveGame();
    }).catch(err => console.error('Failed to load component:', url, err));
}

document.addEventListener('DOMContentLoaded', initializeGame);
