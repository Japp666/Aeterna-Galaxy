import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { generatePlayer } from './utils.js';

export function initializeMarket() {
  gameState.transferMarket = Array.from({ length: 40 }, () => generatePlayer(gameState.club.division));
  saveGame();
}

export function renderTransfers() {
  const market = document.getElementById('transfer-market');
  market.innerHTML = gameState.transferMarket.map(p => `
    <div class="table-row">
      <span>${p.name}</span>
      <span>${p.position}</span>
      <span>Rating: ${p.rating}</span>
      <span>Preț: ${p.price.toLocaleString()} €</span>
      <button onclick="buyPlayer(${p.id})">Cumpără</button>
    </div>
  `).join('');
}

export function buyPlayer(playerId) {
  const player = gameState.transferMarket.find(p => p.id === playerId);
  if (!player) return;
  if (gameState.club.budget >= player.price && gameState.club.energy >= 50) {
    gameState.club.budget -= player.price;
    gameState.club.energy -= 50;
    gameState.players.push({ ...player, isGenerated: false });
    gameState.transferMarket = gameState.transferMarket.filter(p => p.id !== playerId);
    if (gameState.transferMarket.filter(p => p.isGenerated).length < 10) {
      gameState.transferMarket.push(generatePlayer(gameState.club.division));
    }
    saveGame();
    showMessage(`Ai cumpărat ${player.name} pentru ${player.price.toLocaleString()} €!`, 'success');
    renderTransfers();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}

export function sellPlayer() {
  if (gameState.players.length <= 11) {
    showMessage('Nu poți avea mai puțin de 11 jucători!', 'error');
    return;
  }
  const player = gameState.players[Math.floor(Math.random() * gameState.players.length)];
  if (gameState.club.energy >= 50) {
    gameState.club.budget += player.price;
    gameState.club.energy -= 50;
    gameState.players = gameState.players.filter(p => p.id !== player.id);
    gameState.transferMarket.unshift({ ...player, isGenerated: false });
    const generatedPlayer = gameState.transferMarket.find(p => p.isGenerated);
    if (generatedPlayer) {
      gameState.transferMarket = gameState.transferMarket.filter(p => p.id !== generatedPlayer.id);
    }
    saveGame();
    showMessage(`Ai vândut ${player.name} pentru ${player.price.toLocaleString()} €!`, 'success');
    renderTransfers();
  } else {
    showMessage('Energie insuficientă!', 'error');
  }
}

export function scoutPlayers() {
  if (gameState.club.energy >= 300 && gameState.season.activitiesUsed < 6) {
    gameState.club.energy -= 300;
    const numPlayers = Math.floor(Math.random() * 6) + 7;
    const ratingBoost = gameState.season.phase === 'offseason' ? 10 : 5;
    const scouted = Array.from({ length: numPlayers }, () => {
      const p = generatePlayer(gameState.club.division);
      p.rating = Math.min(p.rating + ratingBoost, 90);
      p.price *= 3;
      return p;
    });
    gameState.transferMarket.push(...scouted);
    gameState.transferMarket = gameState.transferMarket.slice(-40);
    if (gameState.season.phase === 'offseason') {
      gameState.season.activitiesUsed += 1;
    }
    saveGame();
    showMessage(`Ai găsit ${numPlayers} jucători de valoare!`, 'success');
    renderTransfers();
  } else {
    showMessage('Energie insuficientă sau limită activități atinsă!', 'error');
  }
}

export function refreshMarket() {
  gameState.transferMarket = gameState.transferMarket.filter(p => !p.isGenerated);
  const numGenerated = Math.min(40 - gameState.transferMarket.length, Math.floor(Math.random() * 11) + 10);
  gameState.transferMarket.push(...Array.from({ length: numGenerated }, () => generatePlayer(gameState.club.division)));
  saveGame();
}

window.buyPlayer = buyPlayer;
window.sellPlayer = sellPlayer;
window.scoutPlayers = scoutPlayers;
