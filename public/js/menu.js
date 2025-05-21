// public/js/menu.js

// Importăm funcția loadComponent din main.js pentru a putea schimba tab-urile
import { loadComponent } from './main.js';
import { renderBuildings } from './buildings.js';
// Asigură-te că importezi și funcțiile de randare pentru celelalte tab-uri când le implementezi
// import { renderFleet } from './fleet.js';
// import { renderResearch } from './research.js';
// import { renderMap } from './map.js';
// import { renderShipyard } from './shipyard.js'; // Dacă ai o funcție pentru shipyard

/**
 * Randarează meniul principal și adaugă event listener-ii necesari.
 * Această funcție este apelată după ce menu.html este încărcat în #main-menu.
 */
export function renderMenu() {
    const mainMenu = document.getElementById('main-menu');
    if (!mainMenu) {
        console.error("Elementul #main-menu nu a fost găsit pentru randarea meniului.");
        return;
    }

    // Asumăm că menu.html are butoane cu id-uri precum 'btn-buildings', 'btn-fleet' etc.
    // Daca nu ai inca aceste id-uri in menu.html, va trebui sa le adaugi.
    // Exemplu: <button id="btn-buildings">Clădiri</button>

    const btnBuildings = mainMenu.querySelector('#btn-buildings');
    if (btnBuildings) {
        btnBuildings.addEventListener('click', async () => {
            await loadComponent('tab-buildings', 'main-content');
            renderBuildings(); // Apelează funcția de randare a clădirilor
        });
    }

    // Adaugă event listeners pentru celelalte butoane de meniu
    // Exemplu pentru Flotă (unde vei avea nevoie de fleet.html și renderFleet()):
    // const btnFleet = mainMenu.querySelector('#btn-fleet');
    // if (btnFleet) {
    //     btnFleet.addEventListener('click', async () => {
    //         await loadComponent('tab-fleet', 'main-content');
    //         renderFleet();
    //     });
    // }

    // Repetă pentru Research, Map, Shipyard etc.
    // const btnResearch = mainMenu.querySelector('#btn-research');
    // if (btnResearch) {
    //     btnResearch.addEventListener('click', async () => {
    //         await loadComponent('tab-research', 'main-content');
    //         renderResearch();
    //     });
    // }
    // ...și așa mai departe pentru toate tab-urile...
}
