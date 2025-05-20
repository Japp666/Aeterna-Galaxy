import { user } from './user.js';
import { buildingData } from './buildings.js'; // Importăm buildingData

export function showHUD() {
  const hud = document.getElementById('hud');
  hud.innerHTML = `
    <div class="hud-bar">
      <div>Metal: <span id="metalAmount">${Math.floor(user.resources.metal)}</span> <small>(+<span id="metalRate">0</span>/min)</small></div>
      <div>Cristal: <span id="crystalAmount">${Math.floor(user.resources.crystal)}</span> <small>(+<span id="crystalRate">0</span>/min)</small></div>
      <div>Energie: <span id="energyAmount">${Math.floor(user.resources.energy)}</span> <small>(+<span id="energyRate">0</span>/min)</small></div>
      <div>Puncte: <span id="scoreAmount">${user.score}</span></div>
    </div>
    <div id="tutorial-box" class="tutorial-box"></div>
  `;

  updateProductionRates(); // Apel inițial pentru a afișa ratele de producție
  setInterval(updateHUD, 100); // Actualizează afișajul resurselor mai des
  setInterval(updateProduction, 60000); // Actualizează producția la fiecare minut (60 de secunde)
}

export function updateHUD() {
  document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);
  document.getElementById('scoreAmount').textContent = user.score;
  // Nu mai apelăm updateProductionRates aici, deoarece se face deja la interval de 60s
  // sau la un update manual, și ar putea crea bucle inutile
}

function updateProduction() {
  let metalProd = 0;
  let crystalProd = 0;
  let energyProd = 0;

  for (const category in buildingData) {
    buildingData[category].forEach(building => {
      const level = user.buildings[building.id] || 0;
      if (level > 0) {
        if (building.id === 'metalMine') {
          metalProd += building.baseProduction * level;
        } else if (building.id === 'crystalMine') {
          crystalProd += building.baseProduction * level;
        } else if (building.id === 'energyPlant') {
          energyProd += building.baseProduction * level;
        }
      }
    });
  }

  user.resources.metal += metalProd;
  user.resources.crystal += crystalProd;
  user.resources.energy += energyProd;

  // Actualizăm direct afișajul ratelor de producție după ce calculăm totalul
  document.getElementById('metalRate').textContent = metalProd;
  document.getElementById('crystalRate').textContent = crystalProd;
  document.getElementById('energyRate').textContent = energyProd;

  updateHUD(); // Forțăm o actualizare a valorilor resurselor după producție
}

export function updateProductionRates() {
    let metalProd = 0;
    let crystalProd = 0;
    let energyProd = 0;

    for (const category in buildingData) {
        buildingData[category].forEach(building => {
            const level = user.buildings[building.id] || 0;
            if (level > 0) {
                if (building.id === 'metalMine') {
                    metalProd += building.baseProduction * level;
                } else if (building.id === 'crystalMine') {
                    crystalProd += building.baseProduction * level;
                } else if (building.id === 'energyPlant') {
                    energyProd += building.baseProduction * level;
                }
            }
        });
    }
    // Verificăm dacă elementele există înainte de a încerca să le actualizăm
    if (document.getElementById('metalRate')) {
        document.getElementById('metalRate').textContent = metalProd;
    }
    if (document.getElementById('crystalRate')) {
        document.getElementById('crystalRate').textContent = crystalProd;
    }
    if (document.getElementById('energyRate')) {
        document.getElementById('energyRate').textContent = energyProd;
    }
}
