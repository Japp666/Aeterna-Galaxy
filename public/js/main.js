console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, loading HUD');
    await loadComponent('hud', 'hud-container');
    updateHUD();

    // Reset game state if needed
    if (!gameState.player) {
        gameState.player = {};
    }

    // Show nickname modal if no nickname
    if (!gameState.player.nickname) {
        console.log('Showing nickname modal');
        document.getElementById('nickname-modal').style.display = 'flex';
    } else {
        console.log('Nickname exists, showing race modal');
        document.getElementById('race-modal').style.display = 'flex';
        initializeRaceSelection();
    }

    const submitNickname = document.getElementById('submit-nickname');
    if (submitNickname) {
        submitNickname.onclick = () => {
            const nicknameInput = document.getElementById('nickname');
            const nickname = nicknameInput.value.trim();
            if (nickname.length > 0) {
                gameState.player.nickname = nickname;
                document.getElementById('nickname-modal').style.display = 'none';
                console.log('Showing race modal');
                document.getElementById('race-modal').style.display = 'flex';
                initializeRaceSelection();
            } else {
                showMessage('Introdu un nickname valid!', 'error');
            }
        };
    }

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            document.querySelector('.menu-item.active')?.classList.remove('active');
            item.classList.add('active');
            const component = item.dataset.component;
            console.log('Loading component:', component);
            await loadComponent(component);
        });
    });
});
