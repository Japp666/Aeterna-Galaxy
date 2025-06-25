const GAME_STATE_KEY = 'footballManagerGameState';

export function getGameState() {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (savedState) {
    try {
      const gameState = JSON.parse(savedState);
      console.log("game-state.js: Stare joc încărcată din localStorage.");
      return {
        isGameStarted: gameState.isGameStarted || false,
        coach: gameState.coach || { nickname: 'Antrenor Nou' },
        club: gameState.club || { 
          name: 'Echipa Mea', 
          emblemUrl: 'https://i.postimg.cc/ncdOL6SD/08.png', 
          funds: 1000000, 
          energy: 100 
        },
        players: gameState.players || [],
        teamFormation: gameState.teamFormation || [],
        currentSeason: gameState.currentSeason || 1,
        currentDay: gameState.currentDay || 1,
        currentFormation: gameState.currentFormation || '4-4-2',
        currentMentality: gameState.currentMentality || 'normal',
      };
    } catch (e) {
      console.error("game-state.js: Eroare la parsarea stării salvate din localStorage:", e);
      return createInitialGameState();
    }
  }
  console.log("game-state.js: Nici o stare joc salvată, se creează una nouă.");
  return createInitialGameState();
}

function createInitialGameState() {
  return {
    isGameStarted: false,
    coach: { nickname: 'Antrenor Nou' },
    club: { 
      name: 'Echipa Mea', 
      emblemUrl: 'https://i.postimg.cc/ncdOL6SD/08.png', 
      funds: 1000000, 
      energy: 100 
    },
    players: [],
    teamFormation: [],
    currentSeason: 1,
    currentDay: 1,
    currentFormation: '4-4-2',
    currentMentality: 'normal',
  };
}

export function updateGameState(newState) {
  let currentState = getGameState();
  currentState = { ...currentState, ...newState };
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(currentState));
    console.log("game-state.js: Stare joc salvată cu succes!");
    console.log("game-state.js: Stare joc actualizată:", currentState);
  } catch (e) {
    console.error("game-state.js: Eroare la salvarea stării în localStorage:", e);
    alert("Eroare la salvarea jocului. Spațiul de stocare ar putea fi plin sau indisponibil.");
  }
}

export function initializeGameState() {
  return getGameState();
}

export function resetGameState() {
  localStorage.removeItem(GAME_STATE_KEY);
  console.warn("game-state.js: Starea jocului a fost resetată complet!");
  window.location.reload();
}
