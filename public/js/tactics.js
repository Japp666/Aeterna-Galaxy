console.log('tactics.js loaded');

function initializeTactics() {
    const tacticsForm = document.getElementById('tactics-form');
    if (!tacticsForm) {
        console.error('Tactics form not found');
        return;
    }

    const formationSelect = document.getElementById('formation-select');
    const styleSelect = document.getElementById('style-select');
    const saveButton = document.getElementById('save-tactics');

    formationSelect.value = gameState.tactics.formation;
    styleSelect.value = gameState.tactics.style;

    saveButton.addEventListener('click', () => {
        gameState.tactics.formation = formationSelect.value;
        gameState.tactics.style = styleSelect.value;
        saveGame();
        showMessage('Tactică salvată!', 'success');
    });
}
