console.log('main.js loaded');

// Initialize gameState only if not already defined
window.gameState = window.gameState || {
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

    // Initialize navigation buttons
    const buttons = [
        { id: 'home-btn', url: 'components/tab-home.html' },
        { id: 'buildings-btn', url: 'components/tab-buildings.html', init: initializeBuildings },
        { id: 'research-btn', url: 'components/tab-research.html', init: initializeResearch },
        { id: 'fleet-btn', url: 'components/tab-fleet.html' },
        { id: 'map-btn', url: 'components/tab-map.html', init: initializeMap },
        { id: 'reset-btn', action: () => {
            localStorage.removeItem('galaxiaAeterna');
            location.reload();
        }}
    ];

    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element) {
            element.addEventListener('click', () => {
                if (btn.action) {
                    btn.action();
                } else {
                    loadComponent(btn.url).then(() => {
                        if (btn.init && typeof btn.init === 'function') {
                            console.log(`Initializing ${btn.id}`);
                            btn.init();
                        }
                    }).catch(err => console.error(`Failed to initialize ${btn.id}:`, err));
                }
            });
        } else {
            console.warn(`Button #${btn.id} not found`);
        }
    });

    // Initialize nickname input with retry
    function initNicknameInput() {
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
        } else {
            console.warn('Nickname input or submit button not found, retrying in 100ms:', {
                nicknameInput: !!nicknameInput,
                nicknameSubmit: !!nicknameSubmit
            });
            setTimeout(initNicknameInput, 100);
        }
    }
    initNicknameInput();
}

function loadComponent(url) {
    console.log('Loading component:', url);
    return fetchComponent(url).then(html => {
        document.getElementById('content').innerHTML = html;
        console.log('Loaded', url, 'into #content');
        updateHUD();
        saveGame();
        return html;
    }).catch(err => console.error('Failed to load component:', url, err));
}

document.addEventListener('DOMContentLoaded', initializeGame);
