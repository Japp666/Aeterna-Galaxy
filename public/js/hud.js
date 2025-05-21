// js/hud.js
import { getPlayerName, getPlayerRace, getResource, getProduction, getScore, updateResources, updateProduction, updateScore } from './user.js';
import { showMessage } from './utils.js';

let lastUpdateTimestamp = Date.now(); // Ultima dată când resursele au fost actualizate

export function updateHUD() {
    const now = Date.now();
    const timeElapsed = (now - lastUpdateTimestamp) / (1000 * 60 * 60); // Timpul în ore

    // Acumulează resursele bazate pe producție și timpul trecut
    const metalProduction = getProduction('metal') * timeElapsed;
    const crystalProduction = getProduction('crystal') * timeElapsed;
    const energyProduction = getProduction('energy') * timeElapsed; // Energie netă (producție - consum)

    // Aici trebuie să calculezi consumul total al clădirilor pentru a determina producția netă de energie
    // Această logică ar trebui să fie în `buildings.js` sau `user.js` într-o funcție care returnează consumul total.
    // Deocamdată, presupunem că `getProduction('energy')` returnează deja energia netă.
    // Dacă nu, trebuie să ajustezi funcția getProduction sau să adaugi o funcție getEnergyBalance.

    updateResources(metalProduction, crystalProduction, energyProduction);

    // Update the HUD elements
    document.getElementById('player-name').textContent = `Comandant: ${getPlayerName()}`;
    document.getElementById('player-race').textContent = `Rasa: ${getPlayerRace()}`;
    document.getElementById('metal').textContent = Math.floor(getResource('metal'));
    document.getElementById('crystal').textContent = Math.floor(getResource('crystal'));
    document.getElementById('energy').textContent = Math.floor(getResource('energy'));
    document.getElementById('score').textContent = Math.floor(getScore());

    document.getElementById('prod-metal').textContent = getProduction('metal');
    document.getElementById('prod-crystal').textContent = getProduction('crystal');
    document.getElementById('prod-energy').textContent = getProduction('energy'); // Aici ar trebui să fie producția netă
    // Aici e o problemă potențială: `getProduction('energy')` ar trebui să fie PRODUCȚIA NETĂ (producție - consum).
    // Dacă funcția `getProduction` din `user.js` nu face asta, va trebui să o ajustezi sau să calculezi aici.

    lastUpdateTimestamp = now;

    // Poți adăuga un setInterval aici pentru a actualiza HUD-ul la fiecare secundă sau mai des
    // Dar pentru acumularea resurselor pe oră, apelarea `updateHUD()` la fiecare x milisecunde e suficientă.
    // Pentru o actualizare vizuală lină a resurselor care cresc incremental (nu doar la oră),
    // vei avea nevoie de o logică de acumulare per secundă sau mai puțin.
    // Deocamdată, las ca în exemplul anterior, care e mai mult un update la încărcare/eveniment.
    // Pentru o actualizare vizuală continuă a resurselor pe HUD, ai nevoie de un setInterval.
}

// Funcție pentru actualizarea continuă a resurselor pe HUD (opțional, dar recomandat pentru jocuri)
// Acesta va fi apelat la un interval fix (ex: 1 secundă) pentru a arăta o creștere lină
let resourceInterval;

export function startResourceUpdater() {
    if (resourceInterval) clearInterval(resourceInterval); // Clear any existing interval

    resourceInterval = setInterval(() => {
        // Calculate production per second
        const metalPerSecond = getProduction('metal') / 3600;
        const crystalPerSecond = getProduction('crystal') / 3600;
        const energyPerSecond = getProduction('energy') / 3600; // Assuming this is net energy

        updateResources(metalPerSecond, crystalPerSecond, energyPerSecond); // Update user data

        // Directly update display for smooth animation
        document.getElementById('metal').textContent = Math.floor(getResource('metal'));
        document.getElementById('crystal').textContent = Math.floor(getResource('crystal'));
        document.getElementById('energy').textContent = Math.floor(getResource('energy'));

    }, 1000); // Update every 1 second
}

// Asigură-te că `startResourceUpdater()` este apelat o dată după inițializarea jocului în `main.js`.
