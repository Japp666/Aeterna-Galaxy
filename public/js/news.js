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
 * Afișează o știre aleatorie în elementul specificat cu animație de fade.
 * @param {HTMLElement} newsElement - Elementul DOM în care va fi afișată știrea (paragraful).
 */
export function displayRandomNews(newsElement) {
    if (!newsElement) {
        console.error("Elementul pentru știri nu a fost găsit.");
        return;
    }

    // Adaugă clasa pentru fade-out
    newsElement.classList.add('fade-out');

    // După ce animația de fade-out este gata, schimbă textul și fa-l să apară
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * newsHeadlines.length);
        newsElement.textContent = newsHeadlines[randomIndex];
        newsElement.classList.remove('fade-out'); // Elimină clasa pentru fade-in
    }, 500); // Durata timeout-ului ar trebui să se potrivească cu durata tranziției CSS (0.5s)
}

/**
 * Inițializează sistemul de știri.
 * @param {HTMLElement} newsElement - Elementul DOM în care va fi afișată știrea.
 * @param {number} intervalMs - Intervalul în milisecunde pentru schimbarea știrilor (opțional).
 */
export function initNewsSystem(newsElement, intervalMs = 15000) {
    // Apelăm o dată la inițializare fără fade-out inițial (sau o poți adăuga dacă vrei)
    const randomIndex = Math.floor(Math.random() * newsHeadlines.length);
    newsElement.textContent = newsHeadlines[randomIndex];

    if (intervalMs > 0) {
        // Schimbăm știrile la interval, folosind funcția cu fade-out
        setInterval(() => displayRandomNews(newsElement), intervalMs);
    }
}
