// public/js/research.js
export function initResearchPage() {
    console.log("Research page initialized.");
    // Logica pentru cercetare (tehnologii, upgrade-uri)
    const content = document.getElementById('main-content');
    if (content) {
        content.innerHTML = `
            <h2>Centru de Cercetare</h2>
            <p>Cercetează noi tehnologii pentru a-ți avansa imperiul.</p>
            <div class="research-tree">
                <p>Tehnologii disponibile:</p>
                <ul>
                    <li>Energie Avansată</li>
                    <li>Minerit Eficient</li>
                    <li>Arme Laser</li>
                </ul>
            </div>
            <button>Începe Cercetarea</button>
        `;
    }
}
