console.log('main.js loaded');

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

    if (!nicknameModal || !raceModal || !submitNickname || !nicknameInput) {
        console.error('Critical elements missing');
        return;
    }

    // Show nickname modal
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
        
        // Hide nickname modal, show race modal
        nicknameModal.style.display = 'none';
        raceModal.style.display = 'flex';
        initializeRaceSelection();
    });

    // Handle race selection
    window.onRaceSelected = (race) => {
        gameState.player.race = race;
        console.log('Race selected:', race);
        saveGame();
        
        // Show game UI
        raceModal.style.display = 'none';
        header.style.display = 'block';
        nav.style.display = 'flex';
        hud.style.display = 'flex';
        content.style.display = 'block';
        resetButton.style.display = 'block';
        
        // Load initial component
        loadComponent('tab-home');
        updateHUD();
    };

    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const component = item.getAttribute('data-component');
            console.log('Loading component:', component);
            loadComponent(component);
        });
    });

    // Reset game
    document.getElementById('reset-game').addEventListener('click', () => {
        console.log('Resetting game');
        resetGame();
    });
});
