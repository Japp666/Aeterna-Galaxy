// js/map.js
import { getUserData, getPlayerName, getPlayerRace, setUserBuildingLevel, updateScore } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

const mapGrid = document.getElementById('map-grid');
const mapTooltip = document.getElementById('map-tooltip');

const MAP_SIZE = 10; // 10x10 grid

// Funcție pentru a crea gridul hărții
export function createMapGrid() {
    if (!mapGrid) return; // Asigură-te că elementul există
    mapGrid.innerHTML = ''; // Curăță gridul existent

    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('map-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.textContent = `${i},${j}`; // Coordonate pentru test

            // Exemplu: Marcați celula jucătorului (doar pentru vizualizare)
            // În jocul real, poziția jucătorului ar fi stocată în userData
            if (i === 4 && j === 4) { // Poziția de start a jucătorului
                cell.classList.add('player');
                cell.textContent = getPlayerName() ? getPlayerName().substring(0, 3).toUpperCase() : 'YOU';
            } else if (i === 1 && j === 7) {
                cell.classList.add('occupied');
                cell.textContent = 'ENC'; // Enemy Control
            } else if (i === 8 && j === 2) {
                cell.classList.add('occupied');
                cell.textContent = 'RES'; // Resource Node
            }

            // Adaugă event listener pentru hover
            cell.addEventListener('mouseover', handleCellHover);
            cell.addEventListener('mouseout', handleCellOut);
            cell.addEventListener('click', handleCellClick);

            mapGrid.appendChild(cell);
        }
    }
}

function handleCellHover(event) {
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    let content = `Sector: [${row}, ${col}]<br>`;

    if (cell.classList.contains('player')) {
        content += `<strong>Baza Ta</strong><br>Rasa: ${getPlayerRace()}`;
    } else if (cell.classList.contains('occupied')) {
        content += `Sector Ocupat: Inamic (Nivel 5)`; // Exemplu
    } else {
        content += `Sector Necunoscut`;
    }

    mapTooltip.innerHTML = content;
    mapTooltip.style.left = `${event.clientX + 10}px`;
    mapTooltip.style.top = `${event.clientY + 10}px`;
    mapTooltip.classList.add('active');
}

function handleCellOut() {
    mapTooltip.classList.remove('active');
}

function handleCellClick(event) {
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    // Logică pentru click pe celulă
    if (!cell.classList.contains('player')) {
        showMessage(`Ai explorat sectorul [${row}, ${col}]!`, 'info');
        // Aici poți adăuga logică pentru a "cuceri" sectorul, a găsi resurse etc.
        // updateScore(10); // Exemplu: dai puncte pentru explorare
        // updateHUD();
        // cell.classList.add('explored'); // Marcați ca explorat
    } else {
        showMessage(`Acesta este sectorul bazei tale.`, 'info');
    }
}

// Funcția pentru a re-reda harta la schimbări (dacă e cazul, de ex. după cuceriri)
// export function refreshMap() {
//     createMapGrid();
// }
