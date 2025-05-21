// js/map.js
import { getUserData, getPlayerName, getPlayerRace, setUserBuildingLevel, updateScore } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

const mapGrid = document.getElementById('map-grid');
const mapTooltip = document.getElementById('map-tooltip');

const MAP_SIZE = 20; // Harta 20x10 pentru 200 de jucători (200 de celule)
const MAP_ROWS = 10;
const MAP_COLS = 20;


// Funcție pentru a crea gridul hărții
export function createMapGrid() {
    if (!mapGrid) return;
    mapGrid.innerHTML = '';
    mapGrid.style.gridTemplateColumns = `repeat(${MAP_COLS}, 1fr)`; // Setează numărul de coloane

    for (let i = 0; i < MAP_ROWS; i++) {
        for (let j = 0; j < MAP_COLS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('map-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            // Nu mai afișăm coordonatele în textul celulei direct

            // Exemplu: Marcați celula jucătorului
            if (i === 4 && j === 4) { // Poziția de start a jucătorului
                cell.classList.add('player-base'); // Clasa pentru baza jucătorului
                cell.textContent = getPlayerName() ? getPlayerName().substring(0, 3).toUpperCase() : 'YOU';
            } else if (i === 1 && j === 7) {
                cell.classList.add('occupied');
                cell.textContent = 'ENC'; // Enemy Control
            } else if (i === 8 && j === 12) { // Am ajustat pentru o hartă mai mare
                cell.classList.add('resource-node');
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

    if (cell.classList.contains('player-base')) {
        content += `<strong>Baza Ta</strong><br>Rasa: ${getPlayerRace()}`;
    } else if (cell.classList.contains('occupied')) {
        content += `Sector Ocupat: Inamic (Nivel 5)`; // Exemplu
    } else if (cell.classList.contains('resource-node')) {
        content += `Nod de Resurse: Heliu-2025`; // Exemplu
    } else {
        content += `Sector Necunoscut`;
    }

    mapTooltip.innerHTML = content;
    mapTooltip.style.left = `${event.clientX + 15}px`; // Ajustează poziția
    mapTooltip.style.top = `${event.clientY + 15}px`;
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
    if (cell.classList.contains('player-base')) {
        showMessage(`Acesta este sectorul bazei tale.`, 'info');
    } else if (cell.classList.contains('occupied')) {
        showMessage(`Sectorul [${row}, ${col}] este controlat de inamic. Atacă pentru a-l cuceri!`, 'warning');
    } else if (cell.classList.contains('resource-node')) {
        showMessage(`Sectorul [${row}, ${col}] conține un nod de resurse Heliu-2025. Trimite o flotă pentru a-l securiza!`, 'success');
    } else {
        showMessage(`Ai explorat sectorul [${row}, ${col}]!`, 'info');
        // updateScore(10); // Exemplu: dai puncte pentru explorare
        // updateHUD();
        // cell.classList.add('explored'); // Marcați ca explorat
    }
}
