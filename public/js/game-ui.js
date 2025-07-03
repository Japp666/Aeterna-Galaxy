// public/js/game-ui.js - Gestionează interfața utilizatorului și interacțiunile DOM

import { getGameState, updateGameState } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js';
import { renderPlayerList, renderPlayerDetails } from './player-management.js';

// Variabilă pentru a ține evidența jucătorului selectat
let selectedPlayerId = null;

/**
 * Încarcă un component HTML dintr-o cale specificată și îl inserează în #content-area.
 * @param {string} componentPath - Calea completă către fișierul HTML al componentei (ex: 'components/dashboard.html').
 * @param {string} tabId - ID-ul tab-ului care a fost activat (ex: 'dashboard', 'players').
 */
export async function loadAndRenderComponent(componentPath, tabId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Nu s-a putut încărca componenta: ${componentPath}. Status: ${response.status}`);
        }
        const htmlContent = await response.text();
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = htmlContent;
            console.log(`Componenta ${componentPath} a fost încărcată.`);

            // Randează conținutul specific tab-ului
            switch (tabId) {
                case 'dashboard':
                    renderDashboard();
                    break;
                case 'players':
                    initializePlayersTab();
                    break;
                case 'finance':
                    // Logica pentru tab-ul de finanțe, dacă este necesar
                    console.log("Tab-ul Finanțe a fost încărcat.");
                    break;
                case 'matches':
                    // Logica pentru tab-ul de meciuri
                    console.log("Tab-ul Meciuri a fost încărcat.");
                    break;
                case 'offseason':
                    // Logica pentru tab-ul de pauză competițională
                    console.log("Tab-ul Pauză Competițională a fost încărcat.");
                    break;
                default:
                    console.log(`Tab-ul ${tabId} a fost încărcat, dar nu are logică de randare specifică.`);
            }
        } else {
            console.error("Elementul #content-area nu a fost găsit.");
        }
    } catch (error) {
        console.error(`Eroare la încărcarea componentei ${componentPath}:`, error);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `<p class="text-red-500">Eroare la încărcarea conținutului: ${error.message}</p>`;
        }
    }
}

/**
 * Inițializează tab-ul de jucători, randând lista și detaliile.
 */
function initializePlayersTab() {
    console.log("game-ui.js: initializePlayersTab() - Se inițializează tab-ul de jucători.");
    const gameState = getGameState();
    const playerListContainer = document.getElementById('player-list');
    const playerDetailsContainer = document.getElementById('player-details');

    if (playerListContainer && playerDetailsContainer) {
        // Funcție callback pentru selectarea unui jucător
        const handlePlayerSelect = (playerId) => {
            selectedPlayerId = playerId;
            const player = gameState.players.find(p => p.id === playerId);
            renderPlayerDetails(playerDetailsContainer, player);
            // Re-randăm lista pentru a actualiza clasa 'selected'
            renderPlayerList(playerListContainer, gameState.players, selectedPlayerId, handlePlayerSelect);
        };

        // Randăm lista inițială de jucători
        renderPlayerList(playerListContainer, gameState.players, selectedPlayerId, handlePlayerSelect);

        // Randăm detaliile jucătorului selectat (dacă există unul deja selectat)
        if (selectedPlayerId) {
            const player = gameState.players.find(p => p.id === selectedPlayerId);
            renderPlayerDetails(playerDetailsContainer, player);
        } else {
            // Asigură-te că mesajul inițial este afișat dacă nu e niciun jucător selectat
            playerDetailsContainer.innerHTML = '<p class="select-player-message">Selectează un jucător din listă pentru a vedea detaliile și opțiunile de antrenament.</p>';
        }

        console.log("game-ui.js: Tab-ul de jucători a fost inițializat.");
    } else {
        console.error("game-ui.js: Containerele pentru lista sau detaliile jucătorilor nu au fost găsite.");
    }
}


/**
 * Actualizează elementele UI cu starea curentă a jocului.
 */
export function updateUI() {
    const gameState = getGameState();
    document.getElementById('club-name').textContent = gameState.club.name;
    document.getElementById('manager-name').textContent = gameState.club.managerName;
    document.getElementById('current-date').textContent = gameState.currentDate;
    document.getElementById('club-balance').textContent = `${gameState.club.finances.balance.toLocaleString('en-US')} Credite`;

    // Dacă tab-ul de jucători este activ, re-randăm lista și detaliile
    const contentArea = document.getElementById('content-area');
    if (contentArea && contentArea.querySelector('#players-content')) {
        initializePlayersTab(); // Re-inițializează tab-ul de jucători pentru a actualiza datele
    }

    console.log("UI actualizat.");
}

/**
 * Inițializează evenimentele pentru navigarea principală.
 */
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = event.target.dataset.target;
            const componentPath = `components/${target}.html`;

            // Elimină clasa 'active' de la toate link-urile
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            // Adaugă clasa 'active' la link-ul curent
            event.target.classList.add('active');

            loadAndRenderComponent(componentPath, target);
        });
    });

    // Setează tab-ul Dashboard ca activ la pornire
    const dashboardLink = document.querySelector('.nav-link[data-target="dashboard"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active');
        loadAndRenderComponent('components/dashboard.html', 'dashboard');
    }
}

// Funcția setupNextDayButton a fost eliminată conform cerinței utilizatorului.

// Inițializarea aplicației
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM complet încărcat.");
    loadGameState(); // Încărcăm starea jocului la pornire
    setupNavigation();
    // setupNextDayButton(); // Apelul a fost eliminat
    updateUI(); // Actualizăm UI-ul inițial
});

