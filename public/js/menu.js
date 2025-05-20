import { showBuildings } from './buildings.js';
import { showResearch } from './research.js';
import { initMap } from './map.js';
import { showFleet } from './fleet.js';

export function showMenu() {
  const menu = document.getElementById('menu');
  menu.innerHTML = `
    <button id="buildingsBtn">Clădiri</button>
    <button id="researchBtn">Cercetare</button>
    <button id="mapBtn">Hartă</button>
    <button id="fleetBtn">Flotă</button>
  `;

  document.getElementById('buildingsBtn').addEventListener('click', () => {
    hideAllTabs();
    showBuildings();
    document.getElementById('buildingsTab').classList.remove('hidden');
  });

  document.getElementById('researchBtn').addEventListener('click', () => {
    hideAllTabs();
    showResearch();
    document.getElementById('researchTab').classList.remove('hidden');
  });

  document.getElementById('mapBtn').addEventListener('click', () => {
    hideAllTabs();
    initMap();
    document.getElementById('mapTab').classList.remove('hidden');
  });

  document.getElementById('fleetBtn').addEventListener('click', () => {
    hideAllTabs();
    showFleet();
    document.getElementById('fleetTab').classList.remove('hidden');
  });
}

function hideAllTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.add('hidden'));
}

// Apelăm showMenu la încărcarea paginii pentru a afișa meniul inițial
document.addEventListener('DOMContentLoaded', showMenu);
