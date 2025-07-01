// public/js/roster-renderer.js

import { getGameState } from './game-state.js';
import { getRarity, getStars } from './player-generator.js'; // Importăm getRarity și getStars
import { POSITION_MAP } from './tactics-data.js'; 

// Funcția pentru a încărca conținutul HTML al tab-ului Roster
export async function loadRosterTabContent() {
    console.log("roster-renderer.js: loadRosterTabContent() - Se încarcă conținutul HTML pentru roster.");
    try {
        const response = await fetch('components/roster-tab.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("roster-renderer.js: Conținutul HTML pentru roster a fost încărcat.");
        return html;
    } catch (error) {
        console.error("roster-renderer.js: Eroare la încărcarea conținutului roster-tab.html:", error);
        return `<p class="error-message">Eroare la încărcarea Lotului de Jucători: ${error.message}</p>`;
    }
}

// Funcția pentru a inițializa logica tab-ului Roster și a afișa jucătorii
export function initRosterTab() {
    console.log("roster-renderer.js: initRosterTab() - Inițializarea logicii roster-ului.");
    const gameState = getGameState();
    const rosterTableBody = document.getElementById('roster-table-body'); 
    const playerDetailsModal = document.getElementById('player-details-modal');
    const modalCloseButton = document.getElementById('player-details-close-btn');

    if (!rosterTableBody) {
        console.error("roster-renderer.js: Elementul '#roster-table-body' nu a fost găsit în DOM.");
        const gameContent = document.getElementById('game-content');
        if(gameContent) {
            gameContent.innerHTML = `<p class="error-message">Eroare la inițializarea Lotului: Elementul principal (tabel) nu a fost găsit.</p>`;
        }
        return;
    }
    // Asigură-te că modalul există și că-l poți închide
    if (playerDetailsModal && modalCloseButton) {
        modalCloseButton.addEventListener('click', () => {
            playerDetailsModal.style.display = 'none';
            playerDetailsModal.setAttribute('aria-hidden', 'true');
        });
        // Închide modalul la click în afara lui
        playerDetailsModal.addEventListener('click', (event) => {
            if (event.target === playerDetailsModal) {
                playerDetailsModal.style.display = 'none';
                playerDetailsModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    rosterTableBody.innerHTML = ''; 

    // Sortăm jucătorii după poziția principală și apoi după Overall descrescător
    const sortedPlayers = [...gameState.players].sort((a, b) => {
        const posOrder = { 'GK': 1, 'DF': 2, 'MF': 3, 'AT': 4 };
        if (posOrder[a.position] !== posOrder[b.position]) { 
            return posOrder[a.position] - posOrder[b.position];
        }
        return b.overall - a.overall; 
    });


    if (sortedPlayers.length === 0) {
        const noPlayersRow = document.createElement('tr');
        noPlayersRow.innerHTML = `<td colspan="6" class="no-players-message">Nu există jucători în lot.</td>`;
        rosterTableBody.appendChild(noPlayersRow);
        return;
    }

    sortedPlayers.forEach(player => {
        const playerRow = document.createElement('tr');
        playerRow.classList.add(`rarity-${player.rarity.toLowerCase()}`); 
        playerRow.dataset.playerId = player.id;
        playerRow.setAttribute('role', 'button');
        playerRow.setAttribute('tabindex', '0');

        playerRow.addEventListener('click', () => showPlayerDetails(player));

        // Afișează pozițiile jucabile, convertind la nume complete
        const playablePositionsText = player.playablePositions
            .map(pos => POSITION_MAP[pos] || pos) 
            .join(', ');

        // Calculează steluțele pentru afișare în tabel
        const stars = getStars(player.overall);
        let starHtml = '';
        for (let i = 0; i < 6; i++) {
            if (i < stars) {
                starHtml += '<i class="fas fa-star filled-star"></i>'; // Stelută plină
            } else {
                starHtml += '<i class="far fa-star empty-star"></i>'; // Stelută goală (contur)
            }
        }


        playerRow.innerHTML = `
            <td>
                <div class="player-initials-circle-roster-table">
                    <span class="player-initials-roster">${player.initials}</span>
                    <span class="player-pos-initial-roster">${player.position}</span>
                </div>
            </td>
            <td>${player.name}</td>
            <td>${playablePositionsText}</td> 
            <td><span class="ovr-value">${Math.round(player.overall)}</span></td> 
            <td><div class="player-stars-table">${starHtml}</div></td> <!-- NOU: Afișează steluțele aici -->
            <td><span class="player-rarity-tag rarity-${player.rarity.toLowerCase()}">${player.rarity.toUpperCase()}</span></td>
            <td><span class="player-potential-tag rarity-${player.potential.toLowerCase()}">${player.potential.toUpperCase()}</span></td>
        `;
        rosterTableBody.appendChild(playerRow);
    });

    console.log("roster-renderer.js: Lotul de jucători a fost afișat în tabel.");
}

/**
 * Afișează un modal cu detaliile complete ale jucătorului.
 * @param {object} player - Obiectul jucător de afișat.
 */
function showPlayerDetails(player) {
    const modal = document.getElementById('player-details-modal');
    if (!modal) {
        console.error("roster-renderer.js: Elementul modalului nu a fost găsit.");
        return;
    }

    // Populează elementele din modal
    document.getElementById('modal-player-name').textContent = player.name;
    document.getElementById('modal-player-age').textContent = Math.round(player.age);
    document.getElementById('modal-player-position').textContent = player.position; // Poziția principală
    document.getElementById('modal-player-team').textContent = getGameState().teamName; // Numele echipei
    
    const rarityTag = document.getElementById('modal-player-rarity');
    rarityTag.textContent = player.rarity.toUpperCase();
    rarityTag.className = `player-rarity-tag rarity-${player.rarity.toLowerCase()}`;

    const potentialTag = document.getElementById('modal-player-potential');
    potentialTag.textContent = player.potential.toUpperCase();
    potentialTag.className = `player-potential-tag rarity-${player.potential.toLowerCase()}`;

    // Populează OVR și inițialele în imaginea de profil
    document.querySelector('.player-modal-initials').textContent = player.initials;
    document.querySelector('.player-modal-ovr').textContent = `OVR ${Math.round(player.overall)}`;

    // Generează și afișează steluțele
    const starsContainer = modal.querySelector('.player-stars-rating');
    starsContainer.innerHTML = ''; // Curăță steluțele anterioare
    const numStars = getStars(player.overall);
    for (let i = 0; i < 6; i++) {
        const starIcon = document.createElement('i');
        starIcon.classList.add('fa-star');
        if (i < numStars) {
            starIcon.classList.add('fas', 'filled-star'); // Stelută plină
        } else {
            starIcon.classList.add('far', 'empty-star'); // Stelută goală (contur)
        }
        starsContainer.appendChild(starIcon);
    }

    // Populează atributele detaliate
    if (player.attributes) {
        // DEFENSIV
        document.getElementById('attr-deposedare').textContent = Math.round(player.attributes.defensiv.deposedare);
        document.getElementById('attr-marcaj').textContent = Math.round(player.attributes.defensiv.marcaj);
        document.getElementById('attr-pozitionare').textContent = Math.round(player.attributes.defensiv.pozitionare);
        document.getElementById('attr-lovitura_de_cap').textContent = Math.round(player.attributes.defensiv.lovitura_de_cap);
        document.getElementById('attr-curaj').textContent = Math.round(player.attributes.defensiv.curaj);

        // OFENSIV
        document.getElementById('attr-pase').textContent = Math.round(player.attributes.ofensiv.pase);
        document.getElementById('attr-dribling').textContent = Math.round(player.attributes.ofensiv.dribling);
        document.getElementById('attr-centrari').textContent = Math.round(player.attributes.ofensiv.centrari);
        document.getElementById('attr-sutare').textContent = Math.round(player.attributes.ofensiv.sutare);
        document.getElementById('attr-finalizare').textContent = Math.round(player.attributes.ofensiv.finalizare);
        document.getElementById('attr-creativitate').textContent = Math.round(player.attributes.ofensiv.creativitate);

        // FIZIC
        document.getElementById('attr-vigoare').textContent = Math.round(player.attributes.fizic.vigoare);
        document.getElementById('attr-forta').textContent = Math.round(player.attributes.fizic.forta);
        document.getElementById('attr-agresivitate').textContent = Math.round(player.attributes.fizic.agresivitate);
        document.getElementById('attr-viteza').textContent = Math.round(player.attributes.fizic.viteza);
    } else {
        console.warn("roster-renderer.js: Jucătorul nu are atribute detaliate. Asigură-te că player-generator.js este actualizat.");
        // Poți afișa N/A sau 0 pentru atribute dacă lipsesc
        const attrSpans = modal.querySelectorAll('.attribute-list span');
        attrSpans.forEach(span => span.textContent = 'N/A');
    }

    modal.style.display = 'flex'; 
    modal.setAttribute('aria-hidden', 'false');
    modal.focus(); 
}
