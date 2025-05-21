// public/js/research.js - Logică pentru cercetare (în construcție)

/**
 * Randarează interfața de cercetare.
 */
export function renderResearch() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error("Elementul #main-content nu a fost găsit pentru randarea cercetării.");
        return;
    }

    // Aici vei adăuga logica pentru a popula tab-research.html
    const researchContainer = mainContent.querySelector('.research-container');
    if (researchContainer) {
        researchContainer.innerHTML = `
            <h2>Cercetare (În Construcție)</h2>
            <p>Dezvoltă noi tehnologii pentru a-ți îmbunătăți producția, flota și apărarea.</p>
            <div class="research-tree">
                <p>Tehnologii disponibile:</p>
                <ul>
                    <li>Tehnologie Energetică: Nivel 0</li>
                    <li>Tehnologie de Blindaj: Nivel 0</li>
                </ul>
            </div>
        `;
    }
    console.log("Cercetarea a fost randată.");
    // Aici vei adăuga logica specifică pentru cercetare (ex: afișarea tehnologiilor, butoane de cercetare, bare de progres)
}
