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
  if (!player || gameState.club.budget < player.price) return;

  gameState.club.budget -= player.price;
  gameState.players.push({ ...player, contractYears: 2 });
  gameState.transferMarket = gameState.transferMarket.filter(p => p.id !== playerId);
  saveGame();
  renderTransfers();
  showMessage(`Jucător cumpărat: ${player.name} pentru ${player.price.toLocaleString()} €`, 'success');
}

export function sellPlayer(playerId) {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return;

  const price = player.rating * 10000;
  gameState.club.budget += price;
  gameState.players = gameState.players.filter(p => p.id !== playerId);
  saveGame();
  renderTransfers();
  showMessage(`Jucător vândut: ${player.name} pentru ${price.toLocaleString()} €`, 'success');
}

function generateTransferMarket() {
  const positions = ['Portar', 'Fundaș', 'Mijlocaș', 'Atacant'];
  const names = [
    'Cosmo Vega', 'Stellar Rex', 'Nova Blitz', 'Astra Zoid', 'Orbit Kane',
    'Nebula Thorn', 'Galactic Rune', 'Star Quill', 'Lunar Shade', 'Comet Blaze',
  ];
  return Array.from({ length: 10 }, (_, i) => {
    const rating = Math.floor(Math.random() * 30) + 60;
    return {
      id: `market-${i + 1}`,
      name: names[i % names.length],
      position: positions[Math.floor(Math.random() * positions.length)],
      rating,
      price: rating * 15000,
      salary: rating * 200,
      stamina: Math.floor(Math.random() * 20) + 70,
      morale: Math.floor(Math.random() * 20) + 60,
    };
  });
}
