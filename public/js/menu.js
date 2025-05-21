// js/menu.js
// Probabil va trebui să importăm și funcțiile de randare pentru celelalte tab-uri
// import { renderFleet } from './fleet.js';
// import { renderResearch } from './research.js';
// ...

// Această funcție va fi apelată după ce menu.html este încărcat în #main-menu
export function renderMenu() {
    const mainMenu = document.getElementById('main-menu');
    if (!mainMenu) {
        console.error("Elementul #main-menu nu a fost găsit.");
        return;
    }

    // Presupunem că menu.html conține butoane cu id-uri precum 'btn-buildings', 'btn-fleet' etc.
    // Dacă nu, va trebui să modifici menu.html sau să adaugi o structură de bază aici.

    const btnBuildings = mainMenu.querySelector('#btn-buildings'); // Ex: <button id="btn-buildings">Clădiri</button>
    if (btnBuildings) {
        btnBuildings.addEventListener('click', async () => {
            await loadComponent('tab-buildings', 'main-content');
            renderBuildings(); // Apelează funcția de randare a clădirilor
        });
    }

    // Repetă logica similară pentru celelalte butoane de meniu (fleet, research, map, shipyard)
    // Exemplu pentru flotă:
    // const btnFleet = mainMenu.querySelector('#btn-fleet');
    // if (btnFleet) {
    //     btnFleet.addEventListener('click', async () => {
    //         await loadComponent('tab-fleet', 'main-content');
    //         renderFleet(); // Asigură-te că ai o funcție renderFleet în fleet.js
    //     });
    // }
}
