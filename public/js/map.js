// public/js/map.js
export function initMapPage() {
    console.log("Map page initialized.");
    // Logica pentru harta galaxiei (planete, sisteme, explorare)
    const content = document.getElementById('main-content');
    if (content) {
        content.innerHTML = `
            <h2>Harta Galactică</h2>
            <p>Explorează galaxia și descoperă noi sisteme.</p>
            <div class="galaxy-map">
                <p>O reprezentare vizuală a galaxiei.</p>
                <button>Explorează Sistem Nou</button>
            </div>
        `;
    }
}
