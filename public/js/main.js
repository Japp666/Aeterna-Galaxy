// js/main.js

import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { renderMap } from './map.js';
import { loadGame, saveGame, getUserData, getPlayerRace, setPlayerRace } from './user.js';
import { updateHUD } from './hud.js';
import { showMessage } from './utils.js';

let selectedRace = null; // Variabilă globală pentru rasa selectată

document.addEventListener('DOMContentLoaded', () => {
    loadGame(); // Încearcă să încarci jocul la pornire
    initializeGameUI();
});

function initializeGameUI() {
    const userData = getUserData();

    if (!userData.playerName) {
        showNicknameModal();
    } else if (!userData.playerRace) {
        showRaceSelectionModal();
    } else {
        // Dacă numele și rasa sunt setate, afișează direct UI-ul jocului
        document.getElementById('nicknameModal').style.display = 'none';
        document.getElementById('raceSelectionModal').style.display = 'none';
        setupGameTabs(); // Configurați tab-urile și evenimentele
        updateHUD(); // Actualizați HUD-ul cu datele încărcate
        showTab('homeTab'); // Afișează tab-ul de acasă implicit
    }
}

function showNicknameModal() {
    const modal = document.getElementById('nicknameModal');
    modal.style.display = 'flex'; // Folosim flex pentru centrare
    const submitBtn = document.getElementById('submitNicknameBtn');
    const nameInput = document.getElementById('playerNameInput');

    // Ascunde modalul de selecție a rasei dacă este vizibil
    document.getElementById('raceSelectionModal').style.display = 'none';

    submitBtn.onclick = () => {
        const playerName = nameInput.value.trim();
        if (playerName.length >= 3 && playerName.length <= 20) {
            let userData = getUserData(); // Reîncarcă userData pentru a te asigura că e cea mai recentă
            userData.playerName = playerName; // Setează numele jucătorului
            saveGame(); // Salvează jocul
            modal.style.display = 'none';
            showRaceSelectionModal(); // Treci la selecția rasei
        } else {
            showMessage("Numele trebuie să aibă între 3 și 20 de caractere.", "error");
        }
    };
}

function showRaceSelectionModal() {
    const modal = document.getElementById('raceSelectionModal');
    modal.style.display = 'flex';
    const raceCards = document.querySelectorAll('.race-card');
    const startGameBtn = document.getElementById('startGameBtn');

    raceCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('coming-soon')) {
                showMessage("Această rasă va fi disponibilă în curând!", "info");
                return;
            }
            // Scoate clasa 'selected' de la toate cardurile
            raceCards.forEach(rc => rc.classList.remove('selected'));
            // Adaugă clasa 'selected' cardului curent
            card.classList.add('selected');
            selectedRace = card.dataset.race; // Setează rasa selectată
            startGameBtn.disabled = false; // Activează butonul de start
        });
    });

    startGameBtn.onclick = () => {
        if (selectedRace) {
            setPlayerRace(selectedRace); // Setează rasa jucătorului
            saveGame();
            modal.style.display = 'none';
            setupGameTabs(); // Configurați tab-urile și evenimentele
            updateHUD(); // Actualizați HUD-ul cu datele încărcate
            showTab('homeTab'); // Afișează tab-ul de acasă
        } else {
            showMessage("Te rog selectează o rasă!", "error");
        }
    };
}


function setupGameTabs() {
    // Adaugă event listener-i pentru butoanele de navigare
    document.getElementById('homeBtn').addEventListener('click', () => showTab('homeTab'));
    document.getElementById('buildingsBtn').addEventListener('click', () => showTab('buildingsTab'));
    document.getElementById('researchBtn').addEventListener('click', () => showTab('researchTab'));
    document.getElementById('fleetBtn').addEventListener('click', () => showTab('fleetTab'));
    document.getElementById('mapBtn').addEventListener('click', () => showTab('mapTab'));
    document.getElementById('rankingsBtn').addEventListener('click', () => showTab('rankingsTab'));
    // document.getElementById('tutorialBtn').addEventListener('click', () => showTab('tutorialTab')); // Pentru când este adăugat

    // Inițializează randarea conținutului specific tab-urilor
    // Acestea se vor randa doar când tab-ul devine activ
}

// Funcție pentru a afișa tab-ul corect și a ascunde celelalte
export function showTab(tabId) {
    // Ascunde toate tab-urile
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active'); // Elimină clasa 'active'
    });

    // Elimină clasa 'active' de la toate butoanele de navigare
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('active');
    });

    // Afișează tab-ul dorit
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
        activeTab.classList.add('active'); // Adaugă clasa 'active' pentru animații/stiluri

        // Marchează butonul de navigare corespunzător ca fiind activ
        const activeBtn = document.getElementById(`${tabId.replace('Tab', 'Btn')}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Randează conținutul specific tab-ului
        if (tabId === 'buildingsTab') {
            renderBuildings();
        } else if (tabId === 'researchTab') {
            renderResearch();
        } else if (tabId === 'mapTab') {
            renderMap(); // Randează harta când tab-ul este activ
        }
        // Adaugă condiții similare pentru alte tab-uri (ex: fleet, rankings, tutorial)
    }
}


// Salvare automată la fiecare 60 de secunde
setInterval(saveGame, 60000);

// Expunerea funcției showTab pentru a putea fi apelată din alte module
window.showTab = showTab; // Nu este ideal, dar funcționează. O alternativă mai bună e un event bus.
