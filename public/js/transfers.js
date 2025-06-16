import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';

export function initializeMarket() {
  if (!gameState.transferMarket || gameState.transferMarket.length === 0) {
    gameState.transferMarket = generateTransferMarket();
  }
  saveGame();
}

export function renderTransfers() {
  const content = document.getElementById('transfers-content');
  if (!content) return;
  content.innerHTML = `
    <h2>Piața de transferuri</h2>
    <div class="transfers-list">
      ${gameState.transferMarket.map(player => `
        <div class="transfer-card">
          <p>Nume: ${player.name}</p>
          <p>Poziție: ${player.position}</p>
          <p>Rating: ${player.rating}</p>
          <p>Preț: ${player.price.toLocaleString()} €</p>
          <p>Salariu: ${player.salary.toLocaleString()} €</p>
          <button id="buy-player-${player.id}" class="button" ${gameState.club.budget < player.price ? 'disabled' : ''}>Cumpără</button>
        </div>
      `).join('')}
    </div>
    <h2>Jucători de vânzare</h2>
    <div class="sell-list">
      ${gameState.players.map(player => `
        <div class="transfer-card">
          <p>Nume: ${player.name}</p>
          <p>Poziție: ${player.position}</p>
          <p>Rating: ${player.rating}</p>
          <p>Preț estimat: ${(player.rating * 10000).toLocaleString()} €</p>
          <button id="sell-player-${player.id}" class="button">Vinde</button>
        </div>
      `).join('')}
    </div>
  `;
  gameState.transferMarket.forEach(player => {
    const button = document.getElementById(`buy-player-${player.id}`);
    button?.addEventListener('click', () => buyPlayer(player.id));
  });
  gameState.players.forEach(player => {
    const button = document.getElementById(`sell-player-${player.id}`);
    button?.addEventListener('click', () => sellPlayer(player.id));
  });
}

export function buyPlayer(playerId) {
  const player = gameState.transferMarket.find(p => p.id === playerId);
  if (!player || game
