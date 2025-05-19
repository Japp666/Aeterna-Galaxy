export function updateHUD() {
  const user = window.user;
  if (!user) return;

  const res = user.resources;
  const prod = user.production;

  document.getElementById('metalAmount').textContent = res.metal.toFixed(0);
  document.getElementById('crystalAmount').textContent = res.crystal.toFixed(0);
  document.getElementById('energyAmount').textContent = res.energy.toFixed(0);

  document.getElementById('metalRate').textContent = prod.metal.toFixed(0);
  document.getElementById('crystalRate').textContent = prod.crystal.toFixed(0);
  document.getElementById('energyRate').textContent = prod.energy.toFixed(0);

  document.getElementById('userScore').textContent = `Puncte: ${user.score}`;
}
