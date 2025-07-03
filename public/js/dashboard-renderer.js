/* public/js/dashboard-renderer.js */

// import { gameState } from './game-state.js'; // A fost eliminat acest import incorect
import { loadGameState } from './game-state.js'; // Păstrează acest import

const dashboardContentElement = document.querySelector('#dashboard-content .dashboard-details'); // Selectează div-ul specific de conținut

/**
 * Inițializează și randează dashboard-ul.
 * Aceasta este funcția apelată din game-ui.js
 */
export function initDashboardRenderer() {
    console.log("dashboard-renderer.js: Inițializare și randare dashboard.");
    renderDashboard();
}

/**
 * Randează conținutul dashboard-ului pe baza stării jocului.
 */
function renderDashboard() {
    // Verificăm dacă dashboardContentElement este disponibil
    if (!dashboardContentElement) {
        console.error("dashboard-renderer.js: Elementul #dashboard-content .dashboard-details nu a fost găsit.");
        return;
    }

    // Încărcăm starea jocului
    const currentGameState = loadGameState(); // Încarcă corect starea jocului

    if (!currentGameState) {
        dashboardContentElement.innerHTML = '<p class="error-message">Nu s-a putut încărca starea jocului pentru dashboard.</p>';
        console.error("dashboard-renderer.js: Starea jocului nu a fost găsită pentru randarea dashboard-ului.");
        return;
    }

    const { club, coach, currentSeason, currentDay } = currentGameState;

    dashboardContentElement.innerHTML = `
        <div class="card-section">
            <h3>Informații Club</h3>
            <p><strong>Nume Club:</strong> ${club.name}</p>
            <p><strong>Emblemă:</strong> <img src="${club.emblem}" alt="Emblema Clubului" class="dashboard-emblem"></p>
            <p><strong>Buget:</strong> ${club.funds.toLocaleString()} Cr</p>
        </div>
        <div class="card-section">
            <h3>Informații Manager</h3>
            <p><strong>Poreclă:</strong> ${coach.nickname}</p>
        </div>
        <div class="card-section">
            <h3>Progres Sezon</h3>
            <p><strong>Sezon:</strong> ${currentSeason}</p>
            <p><strong>Ziua:</strong> ${currentDay}</p>
        </div>
    `;
    console.log("dashboard-renderer.js: Dashboard-ul a fost randat cu succes.");
}
