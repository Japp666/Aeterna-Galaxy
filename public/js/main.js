// console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM loaded, initializing game');
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
        if (typeof updateTabHomeDisplay === 'function') updateTabHomeDisplay();
        updateHUD();
    }

    submitCoach.addEventListener('click', () => {
        const coachInput = document.getElementById('coach-name');
        const clubInput = document.getElementById('club-name');
        const errorP = document.getElementById('coach-modal-error');

        if (coachInput && errorP) {
            coachInput.addEventListener('input', () => {
                errorP.textContent = '';
            });
        }
        if (clubInput && errorP) {
            clubInput.addEventListener('input', () => {
                errorP.textContent = '';
            });
        }

        if (!coachInput || !clubInput) {
            console.error('Input fields not found');
            // Consider setting errorP.textContent here too if appropriate
            showMessage('Eroare la procesarea formularului!', 'error');
            return;
        }

        const coachName = coachInput.value.trim();
        const clubName = clubInput.value.trim();
        if (coachName.length >= 2 && clubName.length >= 2) {
            if (errorP) errorP.textContent = '';
            gameState.coach.name = coachName;
            gameState.club.name = clubName;
            saveGame();
            coachModal.style.display = 'none';
            showMainInterface();
            loadComponent('tab-home');
            if (typeof updateTabHomeDisplay === 'function') updateTabHomeDisplay();
            updateHUD();
            initializeTutorial();
        } else {
            if (errorP) errorP.textContent = 'Numele antrenorului și numele clubului trebuie să aibă cel puțin 2 caractere!';
            // showMessage('Numele trebuie să aibă cel puțin 2 caractere!', 'error');
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
            // console.log(`Loading component: ${component}`);
            loadComponent(component);
            if (component === 'tab-home' && typeof updateTabHomeDisplay === 'function') {
                updateTabHomeDisplay();
            } else if (component === 'tab-team') initializeTeam();
            else if (component === 'tab-transfers') initializeTransfers();
            else if (component === 'tab-tactics') initializeTactics();
            else if (component === 'tab-matches') initializeMatches();
            else if (component === 'tab-facilities') initializeBuildings();
            else if (component === 'tab-academy') initializeAcademy();
        });
    });

    loadComponent('hud', 'hud');
}

function updateTabHomeDisplay() {
    const coachNameEl = document.getElementById('home-coach-name');
    if (coachNameEl) coachNameEl.textContent = gameState.coach.name || 'Antrenor';

    const clubNameEl = document.getElementById('home-club-name');
    if (clubNameEl) clubNameEl.textContent = gameState.club.name || 'Necunoscut';

    const leaguePositionEl = document.getElementById('home-league-position');
    if (leaguePositionEl) {
        const standing = gameState.league.standings.find(s => s.team === gameState.club.name);
        leaguePositionEl.textContent = standing?.position || 'N/A';
    }

    const budgetEl = document.getElementById('home-budget');
    if (budgetEl) budgetEl.textContent = Math.floor(gameState.club.budget).toLocaleString();

    const energyEl = document.getElementById('home-energy');
    if (energyEl) energyEl.textContent = Math.floor(gameState.club.energy);

    const currentWeekEl = document.getElementById('home-current-week');
    if (currentWeekEl) currentWeekEl.textContent = gameState.league.currentWeek;
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
