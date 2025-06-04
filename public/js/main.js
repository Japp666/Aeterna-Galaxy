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
    loadComponent('components/tab-home.html').then(() => {
        console.log('tab-home.html loaded, checking race and nickname');
        const raceSelect = document.getElementById('race-selection');
        const nicknameContainer = document.getElementById('nickname-container');
        if (!gameState.player.race && raceSelect) {
            initializeRaceSelection();
        } else if (gameState.player.race) {
            console.log('Race selected:', gameState.player.race);
        }
        if (nicknameContainer) {
            nicknameContainer.style.display = 'block'; // Ensure nickname container is visible
        }
    }).catch(err => console.error('Failed to load tab-home.html:', err));

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
            console.warn(`Nickname input or submit button not found (attempt ${attempts + 1}/${maxAttempts}):`, {
                nicknameInput: !!nicknameInput,
                nicknameSubmit: !!nicknameSubmit
            });
            setTimeout(() => initNicknameInput(attempts + 1, maxAttempts), 100);
        } else {
            console.error('Failed to find nickname input or submit button after max attempts');
        }
    }
    setTimeout(initNicknameInput, 100);
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
