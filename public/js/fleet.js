import { user } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js'; // Adăugăm import pentru updateHUD

const ships = {
  small: { name: 'Fregată', cost: { metal: 100, crystal: 50, energy: 30 }, speed: 100 },
  medium: { name: 'Cruiser', cost: { metal: 250, crystal: 200, energy: 100 }, speed: 75 },
  large: { name: 'Battleship', cost: { metal: 500, crystal: 400, energy: 300 }, speed: 50 }
};

export function showFleet() {
  const container = document.getElementById('fleetTab');
  container.innerHTML = `
    <h2>Flota Ta</h2>
    <div class="fleet-constructor">
      ${Object.entries(ships)
        .map(
          ([type, data]) => `
        <div class="ship-card">
          <h3>${data.name}</h3>
          <p>Cost: ${data.cost.metal} metal, ${data.cost.crystal} cristal, ${data.cost.energy} energie</p>
          <p>Deții: ${user.fleet[type]}</p>
          <button data-ship-type="${type}">Construiește</button>
        </div>
      `
        )
        .join('')}
    </div>
    <h3>Trimite flotă</h3>
    <div class="fleet-send">
      <label>Coordonate țintă (ex: 4,6):</label>
      <input id="targetCoords" type="text" placeholder="x,y">
      <label>Nave mici:</label><input id="sendSmall" type="number" min="0">
      <label>Nave medii:</label><input id="sendMedium" type="number" min="0">
      <label>Nave mari:</label><input id="sendLarge" type="number" min="0">
      <button id="sendFleetButton">Trimite</button>
    </div>
  `;

  document.querySelectorAll('#fleetTab button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.shipType) {
        buildShip(button.dataset.shipType);
      }
    });
  });

  const sendFleetButton = document.getElementById('sendFleetButton');
  if (sendFleetButton) {
    sendFleetButton.addEventListener('click', sendFleet);
  }
}

function buildShip(type) {
  const cost = ships[type].cost;
  if (
    user.resources.metal >= cost.metal &&
    user.resources.crystal >= cost.crystal &&
    user.resources.energy >= cost.energy
  ) {
    user.resources.metal -= cost.metal;
    user.resources.crystal -= cost.crystal;
    user.resources.energy -= cost.energy;
    user.fleet[type]++;
    showFleet();
    updateHUD(); // Actualizăm HUD după construirea navei
    showMessage(`${ships[type].name} construită!`);
  } else {
    showMessage('Resurse insuficiente!');
  }
}

function sendFleet() {
  const coords = document.getElementById('targetCoords').value.split(',');
  const x = parseInt(coords[0]);
  const y = parseInt(coords[1]);
  const d = Math.sqrt(x * x + y * y);
  const small = parseInt(document.getElementById('sendSmall').value || 0);
  const medium = parseInt(document.getElementById('sendMedium').value || 0);
  const large = parseInt(document.getElementById('sendLarge').value || 0);

  if (
    small > user.fleet.small ||
    medium > user.fleet.medium ||
    large > user.fleet.large
  ) {
    showMessage('Nu ai suficiente nave!');
    return;
  }

  const totalFuel =
    small * d * 1 + medium * d * 2 + large * d * 3;
  if (user.resources.energy < totalFuel) {
    showMessage(`Nu ai suficientă energie (necesar: ${Math.floor(totalFuel)})`);
    return;
  }

  user.resources.energy -= Math.floor(totalFuel);
  user.fleet.small -= small;
  user.fleet.medium -= medium;
  user.fleet.large -= large;
  showMessage(`Flota a fost trimisă către (${x},${y})! Consum energie: ${Math.floor(totalFuel)}`);
  showFleet();
  updateHUD(); // Actualizăm HUD după trimiterea flotei
}
