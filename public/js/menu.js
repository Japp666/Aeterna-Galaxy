// public/js/menu.js
import { updateHUD } from './hud.js';
import { getPlayer } from './user.js';
import { showMessage } from './utils.js';
import { initBuildingsPage } from './buildings.js';
import { initFleetPage } from './fleet.js';
import { initMapPage } from './map.js';
import { initResearchPage } from './research.js';
import { initTutorialPage } from './tutorial.js';
import { initLoginPage } from './login.js';

export async function loadTabContent(tabId, targetElementId = 'main-content') {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
        console.error(`Elementul cu ID-ul "${targetElementId}" nu a fost găsit.`);
        return;
    }

    try {
        let filePath = '';
        switch (tabId) {
            case 'home':
                filePath = 'html/tab-home.html';
                break;
            case 'buildings':
                filePath = 'html/tab-buildings.html';
                break;
            case 'fleet':
                filePath = 'html/tab-fleet.html';
                break;
            case 'map':
                filePath = 'html/tab-map.html';
                break;
            case 'research':
                filePath = 'html/tab-research.html';
                break;
            case 'tutorial':
                filePath = 'html/tab-tutorial.html';
                break;
            case 'hud':
                filePath = 'html/hud.html';
                break;
            case 'login':
                filePath = 'html/login.html';
                break;
            default:
                console.warn(`Tab ID necunoscut: ${tabId}`);
                targetElement.innerHTML = `<h2>Conținut pentru ${tabId} (în lucru)</h2><p>Acest tab este în construcție. Te rugăm să revii mai târziu.</p>`;
                return;
        }

        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Nu s-a putut încărca ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        targetElement.innerHTML = html;
        console.log(`Conținutul pentru ${tabId} încărcat în #${targetElementId}.`);

        switch (tabId) {
            case 'buildings':
                initBuildingsPage();
                break;
            case 'fleet':
                initFleetPage();
                break;
            case 'map':
                initMapPage();
                break;
            case 'research':
                initResearchPage();
                break;
            case 'tutorial':
                initTutorialPage();
                break;
            case 'login':
                initLoginPage();
                break;
        }
    } catch (error) {
        console.error("Eroare la încărcarea conținutului tab-ului:", error);
        targetElement.innerHTML = `<p style="color: red;">Eroare la încărcarea conținutului. ${error.message}</p>`;
        showMessage(`Eroare la încărcarea tab-ului ${tabId}.`, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.innerHTML = `
            <button data-tab="home">Acasă</button>
            <button data-tab="buildings">Clădiri</button>
            <button data-tab="fleet">Flotă</button>
            <button data-tab="map">Hartă</button>
            <button data-tab="research">Cercetare</button>
            <button data-tab="tutorial">Tutorial</button>
            <button id="login-logout-button">Autentificare</button>
        `;

        mainMenu.addEventListener('click', async (event) => {
            const button = event.target.closest('button');
            if (button) {
                const tabId = button.dataset.tab;
                if (tabId) {
                    await loadTabContent(tabId);
                    const currentActive = mainMenu.querySelector('.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    button.classList.add('active');
                }
            }
        });

        const loginLogoutButton = document.getElementById('login-logout-button');
        if (loginLogoutButton) {
            firebase.auth().onAuthStateChanged(user => {
                loginLogoutButton.textContent = user ? 'Deconectare' : 'Autentificare';
                loginLogoutButton.onclick = user ? async () => {
                    await firebase.auth().signOut();
                    showMessage('Te-ai deconectat.', 'success');
                    window.location.reload();
                } : () => loadTabContent('login');
            });
        }
    } else {
        console.error("Elementul #main-menu nu a fost găsit.");
    }
});
