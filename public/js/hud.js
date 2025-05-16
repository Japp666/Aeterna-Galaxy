export function updateHUD() {
  document.getElementById('metalAmount').textContent = Math.floor(user.resources.metal);
  document.getElementById('crystalAmount').textContent = Math.floor(user.resources.crystal);
  document.getElementById('energyAmount').textContent = Math.floor(user.resources.energy);

  document.getElementById('metalRate').textContent = `+${user.production.metal}/min`;
  document.getElementById('crystalRate').textContent = `+${user.production.crystal}/min`;
  document.getElementById('energyRate').textContent = `+${user.production.energy}/min`;

  document.getElementById('userName').textContent = user.name || 'Comandant';
  document.getElementById('userScore').textContent = `Puncte: ${user.score || 0}`;
}
