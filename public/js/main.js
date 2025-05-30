console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, loading HUD');
    await loadComponent('hud', 'hud-container');
    await loadComponent('tab-home');
    updateHUD();

    // Check if nickname is already set
    if (!gameState.player.nickname) {
        console.log('No nickname set, showing nickname modal');
        const nicknameModal = document.getElementById('nickname-modal');
        if (nicknameModal) {
            nicknameModal.style.display = 'flex';
        } else {
            console.error('Nickname modal not found');
        }
    } else {
        console.log('Nickname exists, showing race modal');
        const raceModal = document.getElementById('race-modal');
        if (raceModal) {
            raceModal.style.display = 'flex';
            initializeRaceSelection();
        } else {
            console.error('Race modal not found');
        }
    }

    const submitNickname = document.getElementById('submit-nickname');
    if (submitNickname) {
        submitNickname.onclick = () => {
            const nicknameInput = document.getElementById('nickname');
            const nickname = nicknameInput.value.trim();
            if (nickname.length > 0) {
                gameState.player.nickname = nickname;
                document.getElementById('nickname-modal').style.display = 'none';
                console.log('Nickname set, showing race modal');
                const raceModal = document.getElementById('race-modal');
                if (raceModal) {
                    raceModal.style.display = 'flex';
                    initializeRaceSelection();
                } else {
                    console.error('Race modal not found');
                }
            } else {
                showMessage('Introdu un nickname valid!', 'error');
            }
        };
    } else {
        console.error('Submit nickname button not found');
    }

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            document.querySelector('.menu-item.active').classList.remove('active');
            item.classList.add('active');
            const component = item.dataset.component;
            console.log('Loading component:', component);
            await loadComponent(component);
        });
    });
});
