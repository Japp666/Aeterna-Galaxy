// js/game-ui.js

/**
 * Încarcă conținutul unui tab HTML dintr-un fișier și îl inserează în containerul principal al jocului.
 * Apoi, apelează o funcție de inițializare specifică tab-ului, dacă este furnizată.
 * @param {string} tabName - Numele tab-ului (ex: 'dashboard', 'roster').
 * @param {HTMLElement} gameContent - Elementul DOM unde va fi încărcat conținutul tab-ului.
 * @param {string} htmlFileName - Numele fișierului HTML din directorul 'components/'.
 * @param {Function} [initializer] - O funcție de inițializare opțională care va fi apelată după încărcarea HTML-ului.
 * @param {string} [rootElementId] - ID-ul elementului rădăcină din HTML-ul tab-ului, care va fi pasat inițializatorului.
 */
export async function showTab(tabName, gameContent, htmlFileName, initializer, rootElementId) {
    console.log(`game-ui.js: Se încearcă afișarea tab-ului: ${tabName} din components/${htmlFileName}`);
    try {
        // Actualizează clasa "active-tab" în meniu
        document.querySelectorAll('.game-menu ul li a').forEach(link => {
            if (link.dataset.tab === tabName) {
                link.classList.add('active-tab');
            } else {
                link.classList.remove('active-tab');
            }
        });

        // Încarcă conținutul HTML al tab-ului
        const response = await fetch(`components/${htmlFileName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        gameContent.innerHTML = htmlContent;
        console.log(`game-ui.js: Tab-ul "${tabName}" a fost încărcat în DOM din components/${htmlFileName}.`);
 
        if (initializer && rootElementId) {
            const tabRootElement = gameContent.querySelector(`#${rootElementId}`);
            if (tabRootElement) {
                console.log(`game-ui.js: Se inițializează logica pentru tab-ul ${tabName}, trecând elementul rădăcină (${rootElementId})...`);
                // Apelăm direct initializer, care va conține logica de găsire a elementelor intern
                initializer(tabRootElement); 
                console.log(`game-ui.js: Logica pentru tab-ul ${tabName} inițializată.`);
            } else {
                console.error(`game-ui.js: Eroare: Elementul rădăcină #${rootElementId} nu a fost găsit după încărcarea tab-ului ${tabName}.`);
                gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}": Elementul principal nu a fost găsit.</p>`;
            }
        }
    } catch (error) {
        console.error(`game-ui.js: Eroare la afișarea tab-ului '${tabName}' din components/${htmlFileName}:`, error);
        gameContent.innerHTML = `<p class="error-message">Eroare la încărcarea tab-ului "${tabName}". Te rog să verifici consola pentru mai multe detalii.</p>`;
    }
}
