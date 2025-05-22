// public/js/tutorial.js
export function initTutorialPage() {
    console.log("Tutorial page initialized.");
    // Logica pentru tutorialul jocului
    const content = document.getElementById('main-content');
    if (content) {
        content.innerHTML = `
            <h2>Tutorial Galactic Tycoon</h2>
            <p>Învață cum să-ți construiești și să-ți gestionezi imperiul galactic.</p>
            <div class="tutorial-steps">
                <h3>Pasul 1: Construiește o Centrală Energetică</h3>
                <p>Energia este vitală. Mergi la secțiunea "Clădiri" și construiește o Centrală Energetică.</p>
                </div>
            <button>Marchează ca Finalizat</button>
        `;
    }
}
