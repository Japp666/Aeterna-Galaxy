export function simulateWeek(plan) {
  // TODO: Simulare activități de training pe o săptămână
  return { status: "simulated", plan };
}

export function getFacilities() {
  // TODO: Returnează facilități de antrenament
  return [{ id: 1, name: "Stadion" }];
}

export function getTrainingInbox() {
  // TODO: Returnează notificări legate de training
  return [{ id: 1, message: "Nou antrenament disponibil" }];
}
