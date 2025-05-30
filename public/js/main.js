console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded');
    loadGame();
    updateHUD();

    if (!gameState.player.nickname) {
        console.log('Showing nickname modal');
        document.getElementById('nickname-modal').style.display = 'flex';
        startTutorial();
    } else {
        console.log('Nickname exists, showing race modal');
        document.getElementById('race-modal').style.display = 'flex';
        initializeRaceSelection();
    }

    const submitNickname = document.getElementById('submit-nickname');
    if (submitNickname) {
        submitNickname.onclick = () => {
            const nickname = document.getElementById('nickname').value.trim();
            if (nickname.length > 0) {
                gameState.player.nickname = nickname;
                document.getElementById('nickname-modal').style.display = 'none';
                document.getElementById('race-modal').style.display = 'flex';
                initializeRaceSelection();
                updateHUD();
                nextTutorial();
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
            if (component === 'tab-buildings') initializeBuildings();
            if (component === 'tab-research') initializeResearch();
            if (component === 'tab-fleet') initializeFleet();
            if (component === 'tab-map') initializeMap();
            updateHUD();
        });
    });
});

function startTutorial() {
    const steps = [
        'Bine ai venit în Galaxia Aeterna! Introdu un nickname pentru a începe aventura.',
        'Alege o rasă: fiecare are bonusuri unice. Solari excelează în energie!',
        'Construiește clădiri pentru a produce resurse. Începe cu o Mină de Metal.',
        'Cercetează tehnologii pentru a-ți îmbunătăți colonia.',
        'Construiește o flotă și explorează galaxia!'
    ];
    let step = 0;

    function showTutorialStep() {
        const modal = document.getElementById('tutorial-modal');
        const text = document.getElementById('tutorial-text');
        const button = document.getElementById('next-tutorial');
        text.textContent = steps[step];
        modal.style.display = 'flex';
        button.onclick = () => {
            step++;
            if (step < steps.length) {
                showTutorialStep();
            } else {
                modal.style.display = 'none';
            }
        };
    }

    showTutorialStep();
}

function nextTutorial() {
    const button = document.getElementById('next-tutorial');
    if (button) button.click();
}
