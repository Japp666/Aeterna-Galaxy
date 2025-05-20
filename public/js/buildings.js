// ... (restul importurilor și a buildingData rămân la fel)
import { updateHUD, updateProductionRates } from './hud.js'; // Importăm și updateProductionRates

// ... (restul funcției showBuildings rămâne la fel)

function upgradeBuilding(id) {
  const building = Object.values(buildingData)
    .flat()
    .find(b => b.id === id);
  const level = user.buildings[id] || 0;

  if (level >= building.maxLevel) {
    showMessage(`Clădirea ${building.name} a atins nivelul maxim.`);
    return;
  }

  const cost = calculateCost(building, level + 1);

  if (!canAfford(cost)) {
    showMessage('Nu ai suficiente resurse.');
    return;
  }

  deductResources(cost);
  updateHUD(); // Actualizăm HUD imediat după deducerea resurselor

  const progressBar = document.getElementById(`${id}-bar`);
  const text = document.getElementById(`${id}-text`);
  let seconds = calculateTime(level + 1);
  progressBar.style.width = '0%';
  let elapsed = 0;

  const interval = setInterval(() => {
    elapsed++;
    const percent = Math.min((elapsed / seconds) * 100, 100);
    progressBar.style.width = `${percent}%`;
    text.textContent = `${seconds - elapsed}s`;

    if (elapsed >= seconds) {
      clearInterval(interval);
      user.buildings[id] = level + 1;
      user.score += (level + 1) * 10;
      showBuildings();
      updateHUD(); // Re-actualizăm HUD la finalizarea construcției
      updateProductionRates(); // <--- NOU: Actualizăm ratele de producție după finalizarea construcției
    }
  }, 1000);
}

// ... (restul funcțiilor exportate rămân la fel)
