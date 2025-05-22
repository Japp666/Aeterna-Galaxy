document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app-container');

  // Funcția loadScreen se ocupă de curățarea containerului și de injectarea template-ului ales.
  function loadScreen(templateId) {
    console.log("Se încarcă template-ul:", templateId);
    appContainer.innerHTML = ""; // Curățăm containerul pentru a elimina eventualele duplicări
    const template = document.getElementById(templateId);
    if (template) {
      const clone = template.content.cloneNode(true);
      appContainer.appendChild(clone);
    }
  }

  // Configurează evenimentul pentru ecranul de login.
  function setupLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    // Folosim un atribut custom pentru a ne asigura că listener-ul e atașat o singură dată.
    if (!loginForm.dataset.listenerAdded) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // După login, se trece la ecranul de selecție a rasei.
        loadScreen('race-select-template');
        setupRaceSelect();
      });
      loginForm.dataset.listenerAdded = "true";
    }
  }

  // Configurează evenimentele pentru ecranul de selecție a rasei.
  function setupRaceSelect() {
    const raceButtons = document.querySelectorAll('.race-btn');
    raceButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const race = btn.getAttribute('data-race');
        console.log("Rasa selectată:", race);
        // După selecția rasei, se încarcă ecranul de joc.
        loadScreen('game-template');
        setupGame();
      });
    });
  }

  // Configurează evenimentele pentru ecranul de joc (membrul de meniu și conținutul pentru tab-uri).
  function setupGame() {
    // Legăm butonul pentru Clădiri dacă funcția este definită.
    const btnBuildings = document.getElementById('btn-buildings');
    if (btnBuildings && gameTabs && typeof gameTabs.loadBuildings === 'function') {
      btnBuildings.addEventListener('click', gameTabs.loadBuildings);
    }

    // Legăm butonul pentru Flotă.
    const btnFleet = document.getElementById('btn-fleet');
    if (btnFleet && gameTabs && typeof gameTabs.loadFleet === 'function') {
      btnFleet.addEventListener('click', gameTabs.loadFleet);
    }

    // Legăm butonul pentru Hartă.
    const btnMap = document.getElementById('btn-map');
    if (btnMap && gameTabs && typeof gameTabs.loadMap === 'function') {
      btnMap.addEventListener('click', gameTabs.loadMap);
    }

    // Legăm butonul pentru Cercetare.
    const btnResearch = document.getElementById('btn-research');
    if (btnResearch && gameTabs && typeof gameTabs.loadResearch === 'function') {
      btnResearch.addEventListener('click', gameTabs.loadResearch);
    }

    // Legăm butonul pentru Construcții Nave.
    const btnShipyard = document.getElementById('btn-shipyard');
    if (btnShipyard && gameTabs && typeof gameTabs.loadShipyard === 'function') {
      btnShipyard.addEventListener('click', gameTabs.loadShipyard);
    }

    // (Opțional) Încărcăm implicit conținutul pentru Clădiri.
    if (gameTabs && typeof gameTabs.loadBuildings === 'function') {
      gameTabs.loadBuildings();
    }
  }

  // Inițializare: se încarcă ecranul de login o singură dată.
  loadScreen('login-template');
  setupLogin();
});
