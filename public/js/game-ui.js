/* public/js/game-ui.js */

import { saveGameState, loadGameState } from './game-state.js';

// Elementele UI principale
const gameContent = document.getElementById('gameContent');
const menuLinks = document.querySelectorAll('.menu-item a');
const headerClubName = document.getElementById('header-club-name');
const headerClubEmblem = document.getElementById('header-club-emblem');

// Obiect pentru a ține evidența inițializatorilor pentru fiecare tab
const tabInitializers = {};

// Funcție pentru a înregistra inițializatori de tab-uri
export function registerTabInitializer(tabName, initializer, rootElementId) {
    tabInitializers[tabName] = { initializer, rootElementId };
    console.log(`game-ui.js: Inițializator înregistrat pentru tab-ul: ${tabName}`);
}

// Funcție pentru actualizarea numelui clubului în header
export function updateHeaderClubName(name) {
    if (headerClubName) {
        headerClubName.textContent = name;
        console.log(`game-ui.js: Numele clubului în header actualizat: ${name}`);
    } else {
        console.warn('game-ui.js: Elementul header-club-name nu a fost găsit.');
    }
}

// Funcție pentru actualizarea emblemei clubului în header
export function updateHeaderClubEmblem(emblemId) {
    if (headerClubEmblem) {
        const emblemPath = `../img/emblema${String(emblemId).padStart(2, '0')}.png`; // CALEA CORECTATĂ
        headerClubEmblem.src = emblemPath;
        console.log(`game-ui.js: Emblema clubului în header actualizată la: ${emblemPath}`);
    } else {
        console.warn('game-ui.js: Elementul header-club-emblem nu a fost găsit.');
    }
}

// Funcție asincronă pentru a afișa conținutul unui tab
export async function showTab(tabName, htmlFileName) {
    console.log(`game-ui.js: Se încearcă afișarea tab-ului: ${tabName} din components/${htmlFileName}`);
    
    // Anulează selecția tuturor link-urilor din meniu
    menuLinks.forEach(link => link.classList.remove('active'));
    
    // Adaugă clasa 'active' link-ului curent
    const currentLink = document.querySelector(`.menu-item a[data-tab="${tabName}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }

    try {
        const response = await fetch(`components/${htmlFileName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM din components/${htmlFileName}.`);
 
        // Verifică dacă există un inițializator înregistrat pentru acest tab
        const { initializer, rootElementId } = tabInitializers[tabName] || {};
        if (initializer && rootElementId) {
            const tabRootElement = gameContent.querySelector(`#${rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${rootElementId})...`);
                // Apelăm direct initializer, care va conține logica de găsire a elementelor intern
                initializer(tabRootElement); 
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            } else {
                console.error(`game-ui.js: Eroare: Elementul rădăcină #${rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit.</p>`;
            }
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": ${error.message}</p>`;
    }
}

// Adaugă event listener pentru navigarea în meniu
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        const htmlFileName = link.dataset.html; // Presupunem că adăugăm un data-html="dashboard.html" pe link-uri
        if (tabName && htmlFileName) {
            showTab(tabName, htmlFileName);
        } else {
            console.error('game-ui.js: Atribute data-tab sau data-html lipsesc pe link-ul meniului.', link);
        }
    });
});

// Inițializare UI la încărcarea paginii
document.addEventListener('DOMContentLoaded', () => {
    const gameState = loadGameState();
    if (gameState) {
        updateHeaderClubName(gameState.team.name);
        updateHeaderClubEmblem(gameState.team.emblemId);
        // Dacă există un joc salvat, încarcă dashboard-ul implicit
        showTab('dashboard', 'dashboard.html'); 
    } else {
        // Dacă nu există un joc salvat, afișează ecranul de setup
        showTab('setup', 'setup.html');
    }
});
