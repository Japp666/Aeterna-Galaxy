// js/news.js - Gestionarea știrilor din joc

const newsHeadlines = [
    "Descoperire galactică! Noi talente au apărut pe piața de transferuri.",
    "Tensiuni în Divizia Alfa! Cluburile se luptă pentru supremație.",
    "Fenomen meteorologic rar afectează planetele cu stadioane. Meciuri amânate?",
    "Fanii sunt în extaz după ultima victorie a echipei!",
    "Sezonul se apropie de final. Cine va fi campionul Ligii Stelare?",
    "Zvonuri de transfer: un jucător legendar ar putea schimba echipa!",
    "Noi reguli propuse de Federația Galactică de Fotbal. Ce impact vor avea?",
    "Antrenamentul intensiv dă roade! Jucătorii sunt în formă maximă.",
    "Cupa Galactică începe în curând! Echipele se pregătesc intens.",
    "O nouă generație de nave de transport pentru fani a fost lansată.",
    "Mercenarii spațiului anunță o creștere a taxelor pentru transportul de jucători.",
    "Consiliul Galactic de Sport investighează acuzațiile de fair-play financiar."
];

/**
 * Afișează o știre aleatorie în elementul specificat.
 * @param {HTMLElement} newsElement - Elementul DOM în care va fi afișată știrea.
 */
export function displayRandomNews(newsElement) {
    if (!newsElement) {
        console.error("Elementul pentru știri nu a fost găsit.");
        return;
    }
    const randomIndex = Math.floor(Math.random() * newsHeadlines.length);
    newsElement.textContent = newsHeadlines[randomIndex];
    // Dacă vrei să readuci animația, aici ar trebui să o resetezi
    // newsElement.style.animation = 'none';
    // void newsElement.offsetWidth; // Trigger a reflow
    // newsElement.style.animation = null;
}

/**
 * Inițializează sistemul de știri.
 * @param {HTMLElement} newsElement - Elementul DOM în care va fi afișată știrea.
 * @param {number} intervalMs - Intervalul în milisecunde pentru schimbarea știrilor (opțional).
 */
export function initNewsSystem(newsElement, intervalMs = 15000) {
    displayRandomNews(newsElement); // Afișează o știre la inițializare
    if (intervalMs > 0) {
        setInterval(() => displayRandomNews(newsElement), intervalMs);
    }
}
