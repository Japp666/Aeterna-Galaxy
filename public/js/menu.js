export async function loadTabContent(targetId, tabName) {
  try {
    const response = await fetch(`html/tab-${tabName}.html`);
    if (!response.ok) throw new Error("Eroare la încărcarea fișierului HTML");

    const html = await response.text();
    document.getElementById(targetId).innerHTML = html;
    console.log(`Conținutul pentru ${tabName} încărcat în #${targetId}.`);

    // Dacă tab-ul are script asociat, îl importăm dinamic
    if (tabName === 'buildings') {
      const module = await import('./buildings.js');
      module.initBuildingsPage();
    } else if (tabName === 'fleet') {
      const module = await import('./fleet.js');
      module.initFleetPage?.();
    } else if (tabName === 'map') {
      const module = await import('./map.js');
      module.initMapPage?.();
    } else if (tabName === 'research') {
      const module = await import('./research.js');
      module.initResearchPage?.();
    } else if (tabName === 'tutorial') {
      const module = await import('./tutorial.js');
      module.initTutorialPage?.();
    }

  } catch (error) {
    console.error(`Eroare la încărcarea tab-ului ${tabName}:`, error);
    document.getElementById(targetId).innerHTML = `<p>Nu s-a putut încărca conținutul.</p>`;
  }
}
