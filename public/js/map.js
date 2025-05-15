const mapSize = 10;
const mapContainer = document.getElementById('map-section');

function renderMap() {
  mapContainer.innerHTML = '<h2>Harta Galaxiei</h2>';

  const table = document.createElement('table');
  table.classList.add('map-grid');

  for (let y = 0; y < mapSize; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < mapSize; x++) {
      const cell = document.createElement('td');
      cell.dataset.coords = `${x},${y}`;
      cell.classList.add('map-cell');

      const coordsDiv = document.createElement('div');
      coordsDiv.className = 'coords';
      coordsDiv.textContent = `${x},${y}`;
      cell.appendChild(coordsDiv);

      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  mapContainer.appendChild(table);

  placePlayer();
  placeBot();
}

function placePlayer() {
  const coords = [2, 3]; // Poziția jucătorului (exemplu fixă)
  const cell = document.querySelector(`[data-coords="${coords.join(',')}"]`);
  if (cell) {
    cell.innerHTML += `<div class="map-dot player" title="${window.user?.name || 'Tu'}"></div>`;
  }
}

function placeBot() {
  const coords = [5, 5]; // Poziția botului
  const cell = document.querySelector(`[data-coords="${coords.join(',')}"]`);
  if (cell) {
    cell.innerHTML += `<div class="map-dot bot" title="Comandant Zeta (Bot)"></div>`;
  }
}

export { renderMap };
