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
        console.error('Coach modal not found');
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
            console.error('Input fields not found');
            showMessage('Eroare la procesarea formularului!', 'error');
            return;
        }

        const coachName = coachInput.value.trim();
        const clubName = clubInput.value.trim();
        if (coachName.length >= 2 && clubName.length >= 2) {
            gameState.coach.name = coachName;
            gameState.club.name = clubName;
            saveGame();
            coachModal.style.display = 'none';
            showMainInterface();
            loadComponent('tab-home');
            updateHUD();
            initializeTutorial();
        } else {
            showMessage('Numele trebuie să aibă cel puțin 2 caractere!', 'error');
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
            else if (component === 'tab-facilities') initializeBuildings();
            else if (component === 'tab-academy') initializeAcademy();
            else if (component === 'tab-scouting') initializeScouting();
            else if (component === 'tab-sponsors') initializeSponsors();
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
        'Bine ai venit! Gestionează-ți clubul în Liga Stelară!',
        'Antrenează jucătorii și setează tactici avansate.',
        'Simulează meciuri și cucerește competițiile galactice!'
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
