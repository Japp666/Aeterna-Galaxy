// public/js/team.js

import { getGameState, updateGameState } from './game-state.js';
import { updateHeaderInfo } from './game-ui.js';

/**
 * Initializes the logic for the "Team" tab.
 * @param {HTMLElement} rootElement - The DOM element containing the tab content.
 * @param {object} gameState - The current game state.
 */
export function initTeamTab(rootElement, gameState) {
    console.log("team.js: Initializing 'Team' tab.");

    if (!rootElement) {
        console.error("team.js: Root element for 'Team' tab not found.");
        return;
    }

    if (!gameState || !gameState.club || !gameState.coach) {
        rootElement.innerHTML = '<p class="error-message">Error: Game state is not available for the Team tab.</p>';
        return;
    }

    renderTeamDetails(rootElement, gameState);
    addEventListeners(rootElement);

    console.log("team.js: 'Team' tab initialized.");
}

/**
 * Renders the team and coach details.
 * @param {HTMLElement} rootElement - The DOM element containing the tab content.
 * @param {object} gameState - The current game state.
 */
function renderTeamDetails(rootElement, gameState) {
    const club = gameState.club;
    const coach = gameState.coach;

    const teamDetailsContainer = rootElement.querySelector('.team-details');
    if (!teamDetailsContainer) {
        console.error("team.js: '.team-details' container not found in Team tab.");
        return;
    }

    teamDetailsContainer.innerHTML = `
        <div class="card team-section">
            <h3><i class="fas fa-futbol"></i> Informații Club</h3>
            <p><strong>Nume:</strong> ${club.name}</p>
            <p><strong>Fonduri:</strong> ${club.funds.toLocaleString('ro-RO')} €</p>
            <p><strong>Reputație:</strong> ${club.reputation} <i class="fas fa-star"></i></p>
            <div class="facilities-section">
                <h4>Facilități:</h4>
                <p><strong>Teren de Antrenament:</strong> Nivel ${club.facilities.trainingGround} <button class="btn upgrade-btn" data-facility="trainingGround">Upgrade</button></p>
                <p><strong>Academie de Tineret:</strong> Nivel ${club.facilities.youthAcademy} <button class="btn upgrade-btn" data-facility="youthAcademy">Upgrade</button></p>
                <p><strong>Centru Medical:</strong> Nivel ${club.facilities.medicalCenter} <button class="btn upgrade-btn" data-facility="medicalCenter">Upgrade</button></p>
            </div>
        </div>

        <div class="card team-section">
            <h3><i class="fas fa-user-tie"></i> Informații Manager</h3>
            <p><strong>Nume:</strong> ${coach.name}</p>
            <p><strong>Abilități:</strong></p>
            <ul>
                <li>Tactici: ${coach.tacticalSkill}</li>
                <li>Motivație: ${coach.motivationalSkill}</li>
                <li>Negociere: ${coach.negotiationSkill}</li>
            </ul>
            <button class="btn primary-btn change-coach-btn">Schimbă Manager</button>
        </div>
    `;
    console.log("team.js: Team and coach details rendered.");
}

/**
 * Adds event listeners for buttons in the Team tab.
 * @param {HTMLElement} rootElement - The DOM element containing the tab content.
 */
function addEventListeners(rootElement) {
    rootElement.querySelectorAll('.upgrade-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const facility = event.target.dataset.facility;
            handleFacilityUpgrade(facility);
        });
    });

    const changeCoachBtn = rootElement.querySelector('.change-coach-btn');
    if (changeCoachBtn) {
        changeCoachBtn.addEventListener('click', () => {
            handleChangeCoach();
        });
    }
    console.log("team.js: Event listeners added for Team tab.");
}

/**
 * Handles the logic for upgrading a facility.
 * @param {string} facilityName - The name of the facility to upgrade (e.g., 'trainingGround').
 */
function handleFacilityUpgrade(facilityName) {
    console.log(`team.js: Attempting upgrade for ${facilityName}.`);
    let gameState = getGameState();
    const club = gameState.club;

    const currentLevel = club.facilities[facilityName];
    const upgradeCost = (currentLevel + 1) * 500000;
    const maxLevel = 5;

    if (currentLevel >= maxLevel) {
        alert(`Facility ${facilityName} is already at maximum level (${maxLevel}).`);
        return;
    }

    if (club.funds >= upgradeCost) {
        if (window.confirm(`Are you sure you want to upgrade ${facilityName} to level ${currentLevel + 1} for ${upgradeCost.toLocaleString('ro-RO')} €?`)) {
            club.funds -= upgradeCost;
            club.facilities[facilityName]++;
            updateGameState(gameState);
            renderTeamDetails(document.getElementById('team-content'), getGameState());
            updateHeaderInfo();
            alert(`Upgrade successful! ${facilityName} is now at level ${club.facilities[facilityName]}.`);
            console.log(`team.js: ${facilityName} upgraded to level ${club.facilities[facilityName]}. Funds remaining: ${club.funds}.`);
        }
    } else {
        alert(`Insufficient funds! You need ${upgradeCost.toLocaleString('ro-RO')} € to upgrade ${facilityName}.`);
        console.warn(`team.js: Insufficient funds for ${facilityName} upgrade. Needed: ${upgradeCost}, Available: ${club.funds}.`);
    }
}

/**
 * Handles the logic for changing the coach.
 */
function handleChangeCoach() {
    console.log("team.js: Attempting to change coach.");
    alert("Coach change functionality will be implemented later!");
}
