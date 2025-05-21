// public/js/map.js - Logică pentru harta galactică (în construcție)

/**
 * Randarează interfața hărții galactice.
 */
export function renderMap() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error("Elementul #main-content nu a fost găsit pentru randarea hărții.");
        return;
    }

    // Aici vei adăuga logica pentru a popula tab-map.html
    const mapContainer = mainContent.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <h2>Harta Galactică (În Construcție)</h2>
            <p>Explorează universul, descoperă planete noi și extinde-ți imperiul.</p>
            <div class="galaxy-view">
                <p>Hartă: (imagine sau element interactiv)</p>
                <img src="https://i.imgur.com/your-map-placeholder.png" alt="Hartă galactică placeholder" style="max-width: 100%; height: auto; border: 1px solid #00ffcc;"/>
            </div>
        `;
    }
    console.log("Harta a fost randată.");
    // Aici vei adăuga logica specifică pentru hartă (ex: generarea sistemelor, mișcarea flotei)
}
