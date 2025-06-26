// public/js/dashboard-renderer.js

import { getGameState } from './game-state.js';

export async function loadDashboardTabContent() {
    console.log("dashboard-renderer.js: loadDashboardTabContent() - Se încarcă conținutul HTML pentru dashboard.");
    try {
        const response = await fetch('components/dashboard.html'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("dashboard-renderer.js: Conținutul HTML pentru dashboard a fost încărcat.");
        return html;
    } catch (error) {
        console.error("dashboard-renderer.js: Eroare la încărcarea conținutului dashboard.html:", error);
        return `<p class="error-message">Eroare la încărcarea Dashboard-ului: ${error.message}</p>`;
    }
}

export function initDashboardTab(dashboardContentElement) { 
    console.log("dashboard-renderer.js: initDashboardTab() - Inițializarea logicii dashboard-ului.");
    
    if (!dashboardContentElement) {
        console.error("dashboard-renderer.js: Elementul rădăcină al tab-ului Dashboard (dashboardContentElement) nu a fost furnizat.");
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Dashboard-ului: Elementul principal nu a fost găsit. Vă rugăm să reîncărcați pagina.</p>`;
        }
        return;
    }

    const gameState = getGameState();
    const dashboardDetailsContainer = dashboardContentElement.querySelector('.dashboard-details'); 
    
    if (!dashboardDetailsContainer) {
        console.error("dashboard-renderer.js: Elementul cu clasa 'dashboard-details' nu a fost găsit în dashboardContentElement.");
        dashboardContentElement.innerHTML = `<p class="error-message">Eroare la inițializarea Dashboard-ului: Elementul de detalii nu a fost găsit.</p>`;
        return;
    }

    // Informații despre club și antrenor, fără redundanță cu header-ul
    dashboardDetailsContainer.innerHTML = `
        <div class="club-info-summary">
            <img id="dashboard-club-emblem" src="${gameState.club?.emblemUrl || ''}" alt="Emblemă Club" class="club-emblem">
            <h3 class="club-name">${gameState.club?.name || 'N/A'}</h3>
            <p>Antrenor: <strong>${gameState.coach?.nickname || 'N/A'}</strong></p>
        </div>
        <p>Jucători în lot: <strong>${gameState.players.length || 0}</strong></p>
        <p>Buget: <strong>${(gameState.club?.funds ?? 0).toLocaleString('ro-RO')} Euro</strong></p>
        
        <div class="dashboard-metrics">
            <div class="metric-card">
                <h4>Reputație Club</h4>
                <p class="value">${gameState.club?.reputation || 0}</p>
            </div>
            <div class="metric-card">
                <h4>Nivel Facilități</h4>
                <p class="value">${gameState.club?.facilitiesLevel || 0}</p>
            </div>
             <div class="metric-card">
                <h4>Reputație Antrenor</h4>
                <p class="value">${gameState.coach?.reputation || 0}</p>
            </div>
            <div class="metric-card">
                <h4>Experiență Antrenor</h4>
                <p class="value">${gameState.coach?.experience || 0}</p>
            </div>
        </div>
    `;

    console.log("dashboard-renderer.js: Informații dashboard actualizate.");
}
