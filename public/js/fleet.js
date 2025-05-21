// public/js/fleet.js - Logică pentru flota navală (în construcție)

/**
 * Randarează interfața flotei.
 */
export function renderFleet() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error("Elementul #main-content nu a fost găsit pentru randarea flotei.");
        return;
    }

    // Aici vei adăuga logica pentru a popula tab-fleet.html
    const fleetContainer = mainContent.querySelector('.fleet-container');
    if (fleetContainer) {
        fleetContainer.innerHTML = `
            <h2>Flota ta (În Construcție)</h2>
            <p>Construiește nave de luptă, transport sau explorare. Mai multe funcționalități vor fi adăugate curând!</p>
            <div class="fleet-units-list">
                <p>Navele tale:</p>
                <ul>
                    <li>Luptător Spartan: 0</li>
                    <li>Transportor Hercules: 0</li>
                </ul>
            </div>
        `;
    }
    console.log("Flota a fost randată.");
    // Aici vei adăuga logica specifică pentru flotă (ex: afișarea unităților, butoane de construcție)
}
