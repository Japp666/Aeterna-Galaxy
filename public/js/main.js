// js/main.js
import { user, loadUserData, saveUserData } from './user.js';
import { updateHUD, startProductionInterval } from './hud.js';
import { showBuildings } from './buildings.js';
import { showResearch } from './research.js'; // Asigură-te că ai un fișier research.js
import { showFleet } from './fleet.js';     // Asigură-te că ai un fișier fleet.js
import { initMap } from './map.js';

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    updateHUD();
    startProductionInterval();

    // Setăm un nume și o rasă inițială dacă nu există
    if (!user.name) {
        user.name = "Comandant Necunoscut";
    }
    if (!user.race) {
        user.race = "Uman";
    }

    document.getElementById('player-name').textContent = `Comandant: ${user.name}`;
    document.getElementById('player-race').textContent = `Rasă: ${user.race}`;

    // Funcție pentru a afișa un anumit tab
    const showTab = (tabId) => {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // Inițializează conținutul specific tab-ului dacă e necesar
        if (tabId === 'buildingsTab') {
            showBuildings();
        } else if (tabId === 'mapTab') {
            initMap();
        }
        // Adaugă aici logica pentru alte tab-uri dacă necesită inițializare
        // else if (tabId === 'researchTab') { showResearch(); }
        // else if (tabId === 'fleetTab') { showFleet(); }
    };

    // Adaugă event listeners pentru butoanele de navigare
    document.getElementById('homeBtn').addEventListener('click', () => showTab('homeTab'));
    document.getElementById('buildingsBtn').addEventListener('click', () => showTab('buildingsTab'));
    document.getElementById('researchBtn').addEventListener('click', () => showTab('researchTab'));
    document.getElementById('fleetBtn').addEventListener('click', () => showTab('fleetTab'));
    document.getElementById('mapBtn').addEventListener('click', () => showTab('mapTab'));
    document.getElementById('rankingsBtn').addEventListener('click', () => showTab('rankingsTab'));


    // Afișează tab-ul de start la încărcarea paginii
    showTab('homeTab');
});

// Aici se poate adăuga o funcție de salvare periodică
setInterval(() => {
    saveUserData();
}, 60000); // Salvează la fiecare 60 de secunde
