import { getGameState } from './game-state.js';

export async function renderDashboard() {
  console.log("dashboard-renderer.js: Se inițializează randarea dashboard-ului...");
  const dashboardElement = document.getElementById('dashboard-content');
  if (!dashboardElement) {
    console.error("dashboard-renderer.js: Elementul 'dashboard-content' nu a fost găsit în DOM.");
    return;
  }

  try {
    const response = await fetch('./components/dashboard-tab.html');
    if (!response.ok) {
      throw new Error(`Eroare la încărcarea dashboard-tab.html: ${response.status} ${response.statusText}`);
    }
    const dashboardContent = await response.text();
    dashboardElement.innerHTML = dashboardContent;
    console.log("dashboard-renderer.js: Conținut dashboard încărcat cu succes.");

    const gameState = getGameState();
    updateDashboardContent(gameState);
  } catch (error) {
    console.error("dashboard-renderer.js: Eroare la randarea dashboard-ului:", error);
    dashboardElement.innerHTML = '<p>Eroare la încărcarea dashboard-ului. Te rugăm să încerci din nou.</p>';
  }
}

function updateDashboardContent(gameState) {
  console.log("dashboard-renderer.js: Actualizez conținutul dashboard-ului cu starea jocului:", gameState);

  const clubNameElement = document.getElementById('club-name');
  const coachNameElement = document.getElementById('coach-name');
  const fundsElement = document.getElementById('club-funds');
  const energyElement = document.getElementById('club-energy');

  if (clubNameElement) {
    clubNameElement.textContent = gameState.club.name || 'Echipa Mea';
  }
  if (coachNameElement) {
    coachNameElement.textContent = gameState.coach.nickname || 'Antrenor Nou';
  }
  if (fundsElement) {
    fundsElement.textContent = `${gameState.club.funds || 1000000} €`;
  }
  if (energyElement) {
    energyElement.textContent = `${gameState.club.energy || 100}%`;
  }

  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      console.log(`dashboard-renderer.js: Tab selectat: ${tab.dataset.tab}`);
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTabContent(tab.dataset.tab);
    });
  });

  console.log("dashboard-renderer.js: Dashboard actualizat cu succes!");
}

function renderTabContent(tabName) {
  const dashboardContent = document.getElementById('dashboard-content');
  if (!dashboardContent) {
    console.error("dashboard-renderer.js: Elementul 'dashboard-content' nu a fost găsit pentru randarea tab-ului.");
    return;
  }

  console.log(`dashboard-renderer.js: Randez conținut pentru tab-ul: ${tabName}`);
  dashboardContent.innerHTML = `<p>Tab-ul "${tabName}" este în construcție.</p>`;
}
