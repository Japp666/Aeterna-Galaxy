console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game');
    loadGame();
    initializeGame();
});

function initializeGame() {
    const coachModal = document.getElementById('coach-modal');
    const submitCoach = document.getElementById('submit-coach');
    const resetButton = document.getElementById('reset-game');
    const menuItems = document.querySelectorAll('.menu-item');

    if (!coachModal || !submitCoach) {
        console.error('Coach modal or submit button not found');
        showMessage('Eroare la inițializarea jocului!', 'error');
        return;
    }

    if (!gameState.coach.name || !gameState.club.name) {
        coachModal.style.display = 'flex';
    } else {
        showMainInterface();
        loadComponent('tab-home');
        updateHUD();
    }

    submitCoach.addEventListener('click', () => {
        const coachInput = document.getElementById('coach-name');
        const clubInput = document.getElementById('club-name');
        if (!coachInput || !clubInput) {
            console.error('Coach or club input not found');
            showMessage('Eroare la procesarea formularului!', 'error');
            return;
        }

        const coachName = coachInput.value ? coachInput.value.trim() : '';
        const clubName = clubInput.value ? clubInput.value.trim() : '';
        if (coachName && clubName) {
            gameState.coach.name = coachName;
            gameState.club.name = clubName;
            saveGame();
            coachModal.style.display = 'none';
            showMainInterface();
            loadComponent('tab-home');
            updateHUD();
            initializeTutorial();
        } else {
            showMessage('Introdu un nume valid pentru antrenor și club!', 'error');
        }
    });

    resetButton.addEventListener('click', () => {
        if (confirm('Ești sigur că vrei să resetezi jocul?')) {
            resetGame();
            location.reload();
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const component = item.getAttribute('data-component');
            console.log(`Loading component: ${component}`);
            loadComponent(component);
            if (component === 'tab-team') initializeTeam();
            else if (component === 'tab-transfers') initializeTransfers();
            else if (component === 'tab-tactics') initializeTactics();
            else if (component === 'tab-matches') initializeMatches();
            else if (component === 'tab-facilities') initializeFacilities();
            else if (component === 'tab-academy') initializeAcademy();
        });
    });

    loadComponent('hud', 'hud');
}

function showMainInterface() {
    document.querySelector('header').style.display = 'flex';
    document.querySelector('.sidebar-menu').style.display = 'flex';
    document.getElementById('hud').style.display = 'block';
    document.getElementById('content').style.display = 'block';
    document.getElementById('reset-game').style.display = 'block';
}

function initializeTutorial() {
    const tutorialModal = document.getElementById('tutorial-modal');
    const tutorialText = document.getElementById('tutorial-text');
    const nextTutorial = document.getElementById('next-tutorial');
    if (!tutorialModal || !tutorialText || !nextTutorial) {
        console.error('Tutorial modal elements not found');
        return;
    }

    let step = 0;
    const steps = [
        'Bine ai venit! Gestionează-ți clubul, fă transferuri și setează tactici.',
        'În tab-ul Echipă, antrenează jucătorii pentru a le crește moralul.',
        'Simulează meciuri în tab-ul Meciuri și urcă în clasament!'
    ];

    tutorialModal.style.display = 'flex';
    tutorialText.textContent = steps[step];

    nextTutorial.addEventListener('click', () => {
        step++;
        if (step < steps.length) {
            tutorialText.textContent = steps[step];
        } else {
            tutorialModal.style.display = 'none';
        }
    });
}
