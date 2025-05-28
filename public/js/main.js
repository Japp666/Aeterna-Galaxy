console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('menu-container', 'components/menu.html', initializeMenu);
    loadComponent('hud-container', 'components/hud.html');
    loadComponent('nickname-modal', 'components/login-nickname.html', initializeNicknameModal);
    loadComponent('tab-content', 'components/tab-home.html');
});

function loadComponent(containerId, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}

function initializeMenu() {
    document.querySelectorAll('#menu-container a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            loadComponent('tab-content', `components/tab-${tab}.html`, () => {
                if (tab === 'buildings') initializeBuildings();
            });
        });
    });
}

function initializeNicknameModal() {
    const nicknameModal = document.getElementById('nickname-modal');
    nicknameModal.className = 'modal';
    nicknameModal.style.display = 'block';
    document.getElementById('submit-nickname').addEventListener('click', () => {
        const nickname = document.getElementById('nickname-input').value.trim();
        if (nickname) {
            gameState.player.name = nickname;
            nicknameModal.style.display = 'none';
            loadComponent('race-modal', 'components/race-select.html', initializeRaceSelection);
            updateHUD();
        } else {
            showMessage('Introdu un nickname valid!', 'error');
        }
    });
}
