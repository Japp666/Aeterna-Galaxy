// js/roster-renderer.js - Modul pentru randarea lotului de jucători (tabel)

import { getRarityByOverall } from './player-generator.js';

/**
 * Randarea lotului de jucători într-un tabel (bancă de rezerve).
 * @param {Array<object>} players - Lista de jucători din gameState.
 */
export function renderRoster(players) {
    const rosterTbody = document.getElementById('roster-tbody');
    const emptyMessage = document.getElementById('empty-roster-message');
    const rosterContainer = document.querySelector('.roster-table-container');

    if (!rosterTbody || !emptyMessage || !rosterContainer) {
        console.error("Elementele tabelului lotului nu au fost găsite în DOM pentru roster-renderer.");
        return;
    }
    rosterTbody.innerHTML = '';

    const playersInRoster = players.filter(p => !p.isOnPitch);

    if (playersInRoster.length === 0) {
        emptyMessage.style.display = 'block';
        rosterTbody.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        rosterTbody.style.display = 'table-row-group';
        playersInRoster.forEach(player => {
            const row = document.createElement('tr');
            row.classList.add('roster-table-row', `rarity-${getRarityByOverall(player.overall)}`);
            row.setAttribute('draggable', 'true');
            row.dataset.playerId = player.id;

            row.innerHTML = `
                <td class="player-name">${player.name}</td>
                <td>${player.position}</td>
                <td>${player.overall}</td>
                <td>${player.age}</td>
                <td>${player.salary.toLocaleString('ro-RO')} €</td>
                <td>${player.energy}%</td>
                <td>${getRarityByOverall(player.overall).charAt(0).toUpperCase() + getRarityByOverall(player.overall).slice(1).replace('-', ' ')}</td>
            `;
            rosterTbody.appendChild(row);
        });
    }
}
