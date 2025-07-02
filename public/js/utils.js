// public/js/utils.js - Funcții utilitare generale

/**
 * Încarcă un component HTML dintr-o cale specificată.
 * @param {string} componentPath - Calea completă către fișierul HTML al componentei (ex: 'components/dashboard.html').
 * @returns {Promise<string>} Un Promise care se rezolvă cu conținutul HTML al componentei.
 */
export async function loadComponent(componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Nu s-a putut încărca componenta: ${componentPath}. Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Eroare la încărcarea componentei ${componentPath}:`, error);
        return `<p style="color: red;">Eroare la încărcarea conținutului.</p>`;
    }
}
