// dashboard-renderer.js
import { getGameState } from './game-state.js';

export function initializeDashboard(dashboardRootElement) {
    console.log("dashboard-renderer.js: Inițializare dashboard...");

    const gameState = getGameState();

    const clubNameElement = dashboardRootElement.querySelector('#dashboard-club-name');
    const coachNicknameElement = dashboardRootElement.querySelector('#dashboard-coach-nickname');
    const clubFundsElement = dashboardRootElement.querySelector('#dashboard-club-funds');
    const currentDayElement = dashboardRootElement.querySelector('#dashboard-current-day');
    const currentSeasonElement = dashboardRootElement.querySelector('#dashboard-current-season');

    if (clubNameElement) clubNameElement.textContent = gameState.clubName || 'Nume Club';
    if (coachNicknameElement) coachNicknameElement.textContent = gameState.coachNickname || 'Nume Antrenor';
    if (clubFundsElement) clubFundsElement.textContent = `${gameState.clubFunds.toLocaleString('ro-RO')} €` || '0 €';
    if (currentDayElement) currentDayElement.textContent = `Ziua ${gameState.currentDay}`;
    if (currentSeasonElement) currentSeasonElement.textContent = `Sezonul ${gameState.currentSeason}`;
}
