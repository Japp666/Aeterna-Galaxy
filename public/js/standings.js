import { gameState } from './game-state.js';

export function renderStandings() {
  const content = document.getElementById('standings-content');
  if (!content) return;

  const standings = [...gameState.season.standings].sort((a, b) => b.points - a.points);

  content.innerHTML = `
    <h2>Clasament Divizia ${gameState.club.division}</h2>
    <table class="standings-table">
      <thead>
        <tr>
          <th>Echipă</th>
          <th>Meciuri</th>
          <th>Victorii</th>
          <th>Egaluri</th>
          <th>Înfrângeri</th>
          <th>Puncte</th>
        </tr>
      </thead>
      <tbody>
        ${standings.map(team => `
          <tr>
            <td>${team.name}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.points}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
