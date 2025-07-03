// js/dashboard-renderer.js
import { gameState } from './game-state.js';

/**
 * Randează conținutul tab-ului Dashboard.
 * @param {HTMLElement} dashboardRootElement - Elementul rădăcină al dashboard-ului (ex: div#dashboard-content).
 */
export function renderDashboard(dashboardRootElement) {
    console.log("dashboard-renderer.js: Se randează dashboard-ul.");

    // Verifică dacă elementul rădăcină a fost trecut corect
    if (!dashboardRootElement) {
        console.error("dashboard-renderer.js: Elementul rădăcină al dashboard-ului nu a fost furnizat.");
        return;
    }

    // Aici vei actualiza elementele HTML din dashboard.html
    // folosind datele din gameState.

    const userTeam = gameState.getUserTeam();
    const userDivision = gameState.getUserDivision();

    // Actualizează informațiile din header-ul dashboard-ului
    const coachNameElem = dashboardRootElement.querySelector('#dashboard-coach-name');
    if (coachNameElem) coachNameElem.textContent = gameState.coachName;

    const clubNameElem = dashboardRootElement.querySelector('#dashboard-club-name');
    if (clubNameElem) clubNameElem.textContent = gameState.clubName;

    const currentDivisionElem = dashboardRootElement.querySelector('#dashboard-current-division');
    if (currentDivisionElem && userDivision) currentDivisionElem.textContent = userDivision.name;

    // Actualizează secțiunea "Finanțe"
    const currentBudgetElem = dashboardRootElement.querySelector('#current-budget');
    if (currentBudgetElem) currentBudgetElem.textContent = `$${gameState.currentBudget.toLocaleString()}`;

    // TODO: Implementează logica pentru a calcula salariile săptămânale și veniturile estimate
    const weeklyWageElem = dashboardRootElement.querySelector('#weekly-wage');
    if (weeklyWageElem) weeklyWageElem.textContent = `$0`; // Placeholder
    
    const nextIncomeElem = dashboardRootElement.querySelector('#next-income');
    if (nextIncomeElem) nextIncomeElem.textContent = `$0`; // Placeholder

    // Actualizează secțiunea "Statistici Echipă" (Folosim statistici placeholder pentru moment)
    const teamWinsElem = dashboardRootElement.querySelector('#team-wins');
    if (teamWinsElem && userTeam) teamWinsElem.textContent = userTeam.stats.wins;
    
    const teamDrawsElem = dashboardRootElement.querySelector('#team-draws');
    if (teamDrawsElem && userTeam) teamDrawsElem.textContent = userTeam.stats.draws;

    const teamLossesElem = dashboardRootElement.querySelector('#team-losses');
    if (teamLossesElem && userTeam) teamLossesElem.textContent = userTeam.stats.losses;

    const teamPointsElem = dashboardRootElement.querySelector('#team-points');
    if (teamPointsElem && userTeam) teamPointsElem.textContent = userTeam.stats.points;

    const teamPositionElem = dashboardRootElement.querySelector('#team-position');
    if (teamPositionElem) teamPositionElem.textContent = "N/A"; // Va fi actualizat după implementarea clasamentului

    // Actualizează secțiunea "Jucători Cheie" (Placeholder)
    const topScorerElem = dashboardRootElement.querySelector('#top-scorer');
    if (topScorerElem) topScorerElem.textContent = "N/A";
    
    const bestAssisterElem = dashboardRootElement.querySelector('#best-assister');
    if (bestAssisterElem) bestAssisterElem.textContent = "N/A";

    const highestOvrPlayerElem = dashboardRootElement.querySelector('#highest-ovr-player');
    if (highestOvrPlayerElem && userTeam && userTeam.players.length > 0) {
        // Găsește jucătorul cu cel mai mare OVR
        const highestOvrPlayer = userTeam.players.reduce((prev, current) => 
            (prev.overallRating > current.overallRating) ? prev : current
        );
        highestOvrPlayerElem.textContent = `${highestOvrPlayer.lastName} (OVR: ${highestOvrPlayer.overallRating})`;
    } else if (highestOvrPlayerElem) {
        highestOvrPlayerElem.textContent = "N/A";
    }

    // Actualizează informațiile despre următorul meci (Placeholder)
    const nextMatchOpponentElem = dashboardRootElement.querySelector('#next-match-opponent');
    if (nextMatchOpponentElem) nextMatchOpponentElem.textContent = "TBD";

    const nextMatchDateElem = dashboardRootElement.querySelector('#next-match-date');
    if (nextMatchDateElem) nextMatchDateElem.textContent = "TBD";

    // Adaugă event listener pentru butonul de simulare meci (dacă există)
    const simulateMatchBtn = dashboardRootElement.querySelector('#simulate-match-btn');
    if (simulateMatchBtn) {
        simulateMatchBtn.onclick = () => {
            console.log("dashboard-renderer.js: Buton Simulează Meci apăsat!");
            gameState.advanceDay(); // Apelăm funcția de avansare a zilei
            // Aici ar trebui să se declanșeze simularea meciurilor pentru ziua curentă
            // și actualizarea UI-ului
            alert("Meciul simulat! (logica de simulare urmează)");
            // Actualizează header-ul după simulare
            const currentDateElem = document.getElementById('header-current-date');
            if (currentDateElem) currentDateElem.textContent = `Ziua ${gameState.currentDay}, Sezonul ${gameState.currentSeason}`;
        };
    }
}
