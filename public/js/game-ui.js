// js/game-ui.js - Gestionarea interfeței utilizator a jocului (meniu, tab-uri)

import { getGameState } from './game-state.js';
import { initTeamTab } from './team.js'; // Importă funcția principală de inițializare a tab-ului "Echipă"
import { initNewsSystem } from './news.js'; // Importă sistemul de știri
import { initSetupScreen } from './setup.js'; // Importă pentru funcționalitatea de reset

const menuItems = [
    { id: 'dashboard', text: 'Dashboard', component: 'components/dashboard.html' },
    { id: 'team', text: 'Echipă', component: 'components/team.html' },
    { id: 'matches', text: 'Meciuri', component: 'components/matches.html' },
    { id: 'transfers', text: 'Transferuri', component: 'components/transfers.html' },
    { id: 'standings', text: 'Clasament', component: 'components/standings.html' },
    { id: 'offseason', text: 'Pauză Competițională', component: 'components/offseason.html' }
];

const gameContent = document.getElementById('game-content');
const mainMenu = document.getElementById('main-menu'); // Asigură-te că index.html are id="main-menu" pe nav
const resetGameBtn = document.getElementById('reset-game-btn'); // Butonul de reset
const currentNewsElement = document.getElementById('current-news'); // Elementul pentru știri

/**
 * Încarcă un fișier component HTML.
 * @param {string} componentPath - Calea către fișierul HTML al componentei.
 * @returns {Promise<string>} Conținutul HTML al componentei.
 */
async function loadComponent(componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Eroare la încărcarea componentei: ${response.statusText} (${response.status})`);
        }
        return await response.text();
    } catch (error) {
        console.error('Nu s-a putut încărca componenta:', error);
        return `<p style="color: red;">Eroare la încărcarea conținutului: ${componentPath}. Verifică calea și disponibilitatea fișierului.</p>`;
    }
}

/**
 * Afișează un anumit tab și încarcă conținutul componentei asociate.
 * @param {string} tabId - ID-ul tab-ului de afișat (ex: 'team', 'dashboard').
 */
export async function displayTab(tabId) {
    if (!gameContent) {
        console.error("Elementul '#game-content' nu a fost găsit în DOM.");
        return;
    }

    const selectedItem = menuItems.find(item => item.id === tabId);
    if (selectedItem && selectedItem.component) {
        try {
            const componentHtml = await loadComponent(selectedItem.component);
            gameContent.innerHTML = componentHtml;
            console.log(`Tab-ul "${selectedItem.text}" a fost încărcat în DOM.`);

            // IMPORTANT: Apelăm funcția de inițializare specifică tab-ului cu un delay de 0 milisecunde.
            // Acest lucru permite browserului să finalizeze randarea HTML-ului nou inserat
            // înainte ca JavaScript-ul să încerce să acceseze elementele din el.
            setTimeout(() => {
                if (tabId === 'team') {
                    console.log("Inițializăm logica pentru tab-ul Echipă...");
                    initTeamTab();
                }
                // else if (tabId === 'dashboard') {
                //     console.log("Inițializăm logica pentru tab-ul Dashboard...");
                //     initDashboard(); // Dacă ai un fișier dashboard.js cu o funcție initDashboard
                // }
                // Adaugă aici inițializări pentru alte tab-uri dacă este necesar
            }, 0); // Delay de 0 milisecunde

            updateActiveMenuItem(tabId); // Marchează item-ul curent din meniu
        } catch (error) {
            console.error(`Eroare la încărcarea sau afișarea tab-ului "${tabId}":`, error);
        }
    } else {
        console.warn(`Tab-ul cu ID-ul "${tabId}" nu a fost găsit sau nu are o componentă asociată.`);
    }
}

/**
 * Actualizează clasa CSS a elementului de meniu activ.
 * @param {string} activeTabId - ID-ul tab-ului activ.
 */
function updateActiveMenuItem(activeTabId) {
    if (mainMenu) {
        // Asigură-te că mainMenu este o listă (<ul>) și menuItemElement sunt elemente de listă (<li>)
        mainMenu.querySelectorAll('.menu-item').forEach(item => {
            if (item.dataset.tabId === activeTabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

/**
 * Inițializează meniul principal și adaugă event listeners.
 */
function initMainMenu() {
    if (mainMenu) {
        mainMenu.innerHTML = ''; // Curăță meniul existent

        menuItems.forEach(item => {
            const menuItemElement = document.createElement('li'); // Folosim <li> pentru itemii de meniu
            menuItemElement.classList.add('menu-item');
            menuItemElement.dataset.tabId = item.id; // Stocăm ID-ul tab-ului
            menuItemElement.textContent = item.text;
            menuItemElement.addEventListener('click', () => displayTab(item.id));
            mainMenu.appendChild(menuItemElement);
        });

        // Inițial, afișează tab-ul "Dashboard"
        displayTab('dashboard');
    }
}

/**
 * Inițializează interfața utilizatorului după încărcarea jocului.
 * Această funcție este exportată pentru a fi apelată din main.js
 */
export function initUI() { // CORECTAT: Aceasta este funcția exportată și apelată de main.js
    initMainMenu(); // Inițializează meniul
    // Inițializează și sistemul de știri
    if (currentNewsElement) {
        initNewsSystem(currentNewsElement, 15000); // Ex: actualizare la fiecare 15 secunde
    }

    // Adaugă event listener pentru butonul de reset
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', () => {
            if (confirm('Ești sigur că vrei să resetezi jocul? Progresul va fi pierdut!')) {
                localStorage.removeItem('fmStellarLeagueGameState'); // Șterge starea salvată
                window.location.reload(); // Reîncarcă pagina
            }
        });
    }
}
