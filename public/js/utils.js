export function generateEmblemParams(clubName, division) {
  return {
    name: clubName,
    division,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  };
}

export function generateEmblemFromParams(params) {
  // Simulăm o emblemă ca URL (într-un joc real, ar fi o imagine generată)
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><circle cx="25" cy="25" r="20" fill="${params.color}"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#fff" font-size="12">${params.name[0]}</text></svg>`;
}

export function generateRandomName() {
  const prefixes = ['Astra', 'Cosmo', 'Galactic', 'Nebula', 'Stellar', 'Orbit', 'Nova'];
  const suffixes = ['United', 'FC', 'Rovers', 'Stars', 'Wanderers', 'City', 'Athletic'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

export function calculateMatchOutcome(team1Rating, team2Rating) {
  const diff = team1Rating - team2Rating;
  const rand = Math.random() * 100;
  if (diff > 20) return rand < 80 ? 'win' : rand < 95 ? 'draw' : 'loss';
  if (diff < -20) return rand < 80 ? 'loss' : rand < 95 ? 'draw' : 'win';
  return rand < 40 ? 'win' : rand < 80 ? 'draw' : 'loss';
}
