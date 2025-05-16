document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app-container');

  // Funcție pentru a încărca un "screen" din template-ul specificat
  function loadScreen(templateId) {
    appContainer.innerHTML = ''; // Curățăm containerul
    const template = document.getElementById(templateId);
    if (template) {
      const clone = template.content.cloneNode(true);
      appContainer.appendChild(clone);
    }
  }
  
  // Setează funcționalitatea pentru ecranul de login
  function setupLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Poți valida sau salva username-ul aici
      loadScreen('race-select-template');
      setupRaceSelect();
    });
  }
  
  // Setează funcționalitatea pentru ecranul de selecție a rasei
  function setupRaceSelect() {
    const raceButtons = document.querySelectorAll('.race-btn');
    raceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const race = btn.getAttribute('data-race');
        console.log("Rasa selectată:", race);
        // Poți salva rasa selectată (de exemplu, în localStorage sau o variabilă globală)
        loadScreen('game-template');
        setupGame();
      });
    });
  }
  
  // Setează funcționalitatea pentru ecranul de joc
  function setupGame() {
    const gameContent = document.getElementById('game-content');

    const btnBuildings = document.getElementById('btn-buildings');
    if (btnBuildings) {
      btnBuildings.addEventListener('click', () => {
        gameContent.innerHTML = '<h3>Clădiri</h3><p>Informații despre clădiri...</p>';
      });
    }
    
    const btnFleet = document.getElementById('btn-fleet');
    if (btnFleet) {
      btnFleet.addEventListener('click', () => {
        gameContent.innerHTML = '<h3>Flotă</h3><p>Informații despre flotă...</p>';
      });
    }
    
    const btnMap = document.getElementById('btn-map');
    if (btnMap) {
      btnMap.addEventListener('click', () => {
        gameContent.innerHTML = '<h3>Hartă</h3><p>Informații despre hartă...</p>';
      });
    }
    
    const btnResearch = document.getElementById('btn-research');
    if (btnResearch) {
      btnResearch.addEventListener('click', () => {
        gameContent.innerHTML = '<h3>Cercetare</h3><p>Informații despre cercetare...</p>';
      });
    }
    
    const btnShipyard = document.getElementById('btn-shipyard');
    if (btnShipyard) {
      btnShipyard.addEventListener('click', () => {
        gameContent.innerHTML = '<h3>Construcții Nave</h3><p>Informații despre construcții nave...</p>';
      });
    }
  }
  
  // Inițializează aplicația afișând ecranul de login
  loadScreen('login-template');
  setupLogin();
});
