// js/game-ui.js - Gestionarea interfeței utilizator a jocului (meniu, tab-uri)

import { loadComponent } from './utils.js'; // Pentru a încărca fișiere HTML din components/

const gameContent = document.getElementById('game-content');
const mainMenu = document.querySelector('.main-menu');

// Definim structura meniului (nume afișat și fișier component HTML asociat)
const menuItems = [
    { id: 'dashboard', text: 'Dashboard', component: 'dashboard' },
    { id: 'team', text: 'Echipă', component: 'team' },
    { id: 'matches', text: 'Meciuri', component: 'matches' },
    { id: 'standings', text: 'Clasament', component: 'standings' },
    { id: 'transfers', text: 'Transferuri', component: 'transfers' },
    { id: 'training', text: 'Antrenament', component: 'training' }, // Nou, vom crea components/training.html
    { id: 'finance', text: 'Finanțe', component: 'finance' },     // Nou, vom crea components/finance.html
    { id: 'offseason', text: 'Pauză Comp.', component: 'offseason' }
];

/**
 * Generează meniul principal de navigație.
 */
function renderMainMenu() {
    mainMenu.innerHTML = ''; // Curăță meniul existent
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.id = `menu-btn-${item.id}`;
        button.classList.add('menu-btn');
        button.textContent = item.text;
        button.dataset.component = item.component; // Stocăm numele componentei în data-attribute

        button.addEventListener('click', () => {
            displayTab(item.id);
        });
        mainMenu.appendChild(button);
    });
}

/**
 * Afișează conținutul unui anumit tab.
 * @param {string} tabId - ID-ul tab-ului de afișat (ex: 'dashboard', 'team').
 */
export async function displayTab(tabId) {
    // Elimină clasa 'active' de la toate butoanele de meniu
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Adaugă clasa 'active' butonului selectat
    const activeButton = document.getElementById(`menu-btn-${tabId}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Găsește item-ul de meniu corespunzător
    const selectedItem = menuItems.find(item => item.id === tabId);
    if (selectedItem && selectedItem.component) {
        // Încarcă conținutul HTML al componentei
        const componentHtml = await loadComponent(selectedItem.component);
        gameContent.innerHTML = componentHtml;

        // Aici vei putea apela funcții de inițializare specifice fiecărui tab, dacă este necesar
        // ex: if (tabId === 'team') initTeamTab();
        // ex: if (tabId === 'matches') initMatchesTab();
        console.log(`Tab-ul "${selectedItem.text}" a fost încărcat.`);
    } else {
        gameContent.innerHTML = `<p>Conținut pentru ${tabId} nu este disponibil încă.</p>`;
        console.warn(`Componenta pentru tab-ul ${tabId} nu a fost găsită.`);
    }
}

/**
 * Inițializează UI-ul principal al jocului.
 */
export function initGameUI() {
    renderMainMenu();
}
