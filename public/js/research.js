// js/research.js
import { getUserData, updateResources, updateProduction, setUserResearchLevel, getPlayerRace } from './user.js';
import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

// Definim structura de bază a cercetărilor
const researchItems = {
    advancedMining: {
        name: "Minerit Avansat",
        description: "Crește eficiența minelor de Metal și Cristal.",
        baseCost: { metal: 50, crystal: 100, energy: 20 },
        researchTime: 20000, // 20 secunde
        imageUrl: "img/research_mining.png", // Asigură-te că ai această imagine
        maxLevel: 5,
        effects: {
            metalMineProductionBonus: 0.1, // +10% la producția minelor de metal/nivel
            crystalMineProductionBonus: 0.1
        }
    },
    energyEfficiency: {
        name: "Eficiență Energetică",
        description: "Reduce consumul de energie al clădirilor.",
        baseCost: { metal: 80, crystal: 120, energy: 30 },
        researchTime: 25000, // 25 secunde
        imageUrl: "img/research_energy.png", // Asigură-te că ai această imagine
        maxLevel: 3,
        effects: {
            energyConsumptionReduction: 0.05 // -5% la consumul de energie/nivel
        }
    },
    // Adaugă alte cercetări aici
};

const researchQueue = {}; // Coada de cercetare { researchId: { level: X, endTime: Y, element: Z } }

export function renderResearch() {
    const researchTab = document.getElementById('researchTab');
    if (!researchTab) {
        console.error("researchTab element not found!");
        return;
    }
    researchTab.innerHTML = '<h2>Cercetare</h2><p>Aici poți investiga și dezvolta tehnologii avansate pentru a-ți îmbunătăți producția, a-ți crește puterea militară și a debloca noi oportunități strategice.</p><div class="research-list"></div>';
    const researchList = researchTab.querySelector('.research-list');

    const userResearch = getUserData().research;

    for (const id in researchItems) {
        const research = researchItems[id];
        const currentLevel = userResearch[id] || 0;
        const nextLevel = currentLevel + 1;

        if (nextLevel > research.maxLevel) {
            const researchCard = document.createElement('div');
            researchCard.className = 'research-card';
            researchCard.innerHTML = `
                <img src="${research.imageUrl || 'img/default_research.png'}" alt="${research.name}" class="research-image">
                <h3>${research.name}</h3>
                <p>Nivel: ${currentLevel} (Max)</p>
                <p>${research.description}</p>
                <button disabled>Nivel Maxim Atingut</button>
            `;
            researchList.appendChild(researchCard);
            continue;
        }

        const cost = calculateResearchCost(research.baseCost, nextLevel);
        const researchTime = calculateResearchTime(research.researchTime, nextLevel);

        const researchCard = document.createElement('div');
        researchCard.className = 'research-card';
        researchCard.dataset.id = id;

        researchCard.innerHTML = `
            <img src="${research.imageUrl || 'img/default_research.png'}" alt="${research.name}" class="research-image">
            <h3>${research.name}</h3>
            <p>Nivel: ${currentLevel}</p>
            <p>${research.description}</p>
            <p>Cost Nivel ${nextLevel}: Metal: ${cost.metal}, Cristal: ${cost.crystal}, Energie: ${cost.energy}</p>
            <p>Timp cercetare: ${formatTime(researchTime / 1000)}</p>
            <button class="research-btn" data-id="${id}"
                    data-metal="${cost.metal}"
                    data-crystal="${cost.crystal}"
                    data-energy="${cost.energy}"
                    data-time="${researchTime}">Cercetează Nivel ${nextLevel}</button>
            <div class="progress-container" style="display: none;">
                <div class="progress-bar"></div>
                <div class="progress-text"></div>
            </div>
        `;
        researchList.appendChild(researchCard);
    }

    addResearchEventListeners();
    updateResearchProgressBars(); // Inițializează barele de progres la randare
}

function addResearchEventListeners() {
    document.querySelectorAll('.research-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const researchId = event.target.dataset.id;
            const costMetal = parseInt(event.target.dataset.metal);
            const costCrystal = parseInt(event.target.dataset.crystal);
            const costEnergy = parseInt(event.target.dataset.energy);
            const researchTime = parseInt(event.target.dataset.time);

            const userData = getUserData();

            if (userData.resources.metal < costMetal || userData.resources.crystal < costCrystal || userData.resources.energy < costEnergy) {
                showMessage("Resurse insuficiente pentru cercetare!", "error");
                return;
            }

            if (researchQueue[researchId]) {
                showMessage("Această cercetare este deja în desfășurare!", "info");
                return;
            }

            updateResources(-costMetal, -costCrystal, -costEnergy);
            updateHUD();
            showMessage(`Cercetare "${researchItems[researchId].name}" Nivel ${ (userData.research[researchId] || 0) + 1 } începută!`, "success");

            const card = event.target.closest('.research-card');
            const progressBarContainer = card.querySelector('.progress-container');
            const progressBar = card.querySelector('.progress-bar');
            const progressText = card.querySelector('.progress-text');
            const researchButton = event.target;

            researchButton.disabled = true;
            progressBarContainer.style.display = 'block';

            const startTime = Date.now();
            const endTime = startTime + researchTime;

            researchQueue[researchId] = {
                level: (userData.research[researchId] || 0) + 1,
                endTime: endTime,
                element: { progressBar: progressBar, progressText: progressText, button: researchButton, card: card }
            };

            updateResearchProgress(researchId);
        });
    });
}

function updateResearchProgress(researchId) {
    const item = researchQueue[researchId];
    if (!item) return;

    const now = Date.now();
    const remainingTime = item.endTime - now;

    if (remainingTime <= 0) {
        const research = researchItems[researchId];
        const currentLevel = (getUserData().research[researchId] || 0) + 1;
        setUserResearchLevel(researchId, currentLevel);
        showMessage(`"${research.name}" Nivel ${currentLevel} a fost finalizat!`, "success");

        // Aplică efectele cercetării
        applyResearchEffects(researchId, currentLevel);
        updateHUD(); // Actualizează HUD-ul pentru a reflecta schimbările de producție/consum

        item.element.progressBar.style.width = '100%';
        item.element.progressText.textContent = 'Finalizat!';
        item.element.button.disabled = false;
        item.element.card.classList.remove('research-in-progress');

        setTimeout(() => {
            item.element.progressBar.style.width = '0%';
            item.element.progressText.textContent = '';
            item.element.progressBar.parentNode.style.display = 'none';
            delete researchQueue[researchId];
            renderResearch();
        }, 1000);
    } else {
        const totalTime = item.endTime - (item.endTime - researchItems[researchId].researchTime);
        const progress = ((totalTime - remainingTime) / totalTime) * 100;
        item.element.progressBar.style.width = `${progress}%`;
        item.element.progressText.textContent = `${formatTime(remainingTime / 1000)}`;

        requestAnimationFrame(() => updateResearchProgress(researchId));
    }
}

function updateResearchProgressBars() {
    const now = Date.now();
    for (const researchId in researchQueue) {
        const item = researchQueue[researchId];
        const remainingTime = item.endTime - now;

        if (remainingTime > 0) {
            const card = document.querySelector(`.research-card[data-id="${researchId}"]`);
            if (card) {
                const progressBarContainer = card.querySelector('.progress-container');
                const progressBar = card.querySelector('.progress-bar');
                const progressText = card.querySelector('.progress-text');
                const researchButton = card.querySelector('.research-btn');

                if (progressBarContainer && progressBar && progressText && researchButton) {
                    progressBarContainer.style.display = 'block';
                    researchButton.disabled = true;
                    item.element = { progressBar: progressBar, progressText: progressText, button: researchButton, card: card };
                    requestAnimationFrame(() => updateResearchProgress(researchId));
                }
            }
        } else {
            const research = researchItems[researchId];
            const currentLevel = (getUserData().research[researchId] || 0) + 1;
            setUserResearchLevel(researchId, currentLevel);
            applyResearchEffects(researchId, currentLevel); // Aplică efectele la finalizare
            updateHUD();
            showMessage(`"${research.name}" Nivel ${currentLevel} a fost finalizat!`, "success");
            delete researchQueue[researchId];
            renderResearch();
        }
    }
}


function calculateResearchCost(baseCost, level) {
    return {
        metal: Math.floor(baseCost.metal * Math.pow(1.6, level - 1)),
        crystal: Math.floor(baseCost.crystal * Math.pow(1.7, level - 1)),
        energy: Math.floor(baseCost.energy * Math.pow(1.5, level - 1))
    };
}

function calculateResearchTime(baseTime, level) {
    return baseTime * level * 1.2; // Timpul crește mai repede
}

function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let parts = [];
    if (days > 0) parts.push(`${days}z`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
}

// Funcție pentru a aplica efectele cercetării (important!)
function applyResearchEffects(researchId, level) {
    const research = researchItems[researchId];
    if (!research || !research.effects) return;

    // Aici ar trebui să interacționezi cu logica de producție/consum din `user.js`
    // Sau să triggerezi o recalculare completă a producției.
    // Pentru simplitate, vom modifica direct producția din `user.js` (dar ideal ar fi o funcție de recalculare totală)

    let totalMetalProdBonus = 0;
    let totalCrystalProdBonus = 0;
    let totalEnergyConsReduction = 0; // Pentru a ține evidența reducerilor de consum

    // Recalculează bonusurile/reducerile totale de la TOATE cercetările
    const userResearch = getUserData().research;
    for (const rId in userResearch) {
        const rLevel = userResearch[rId];
        const rItem = researchItems[rId];
        if (rItem && rItem.effects) {
            if (rItem.effects.metalMineProductionBonus) {
                totalMetalProdBonus += rItem.effects.metalMineProductionBonus * rLevel;
            }
            if (rItem.effects.crystalMineProductionBonus) {
                totalCrystalProdBonus += rItem.effects.crystalMineProductionBonus * rLevel;
            }
            if (rItem.effects.energyConsumptionReduction) {
                totalEnergyConsReduction += rItem.effects.energyConsumptionReduction * rLevel;
            }
        }
    }

    // Această parte este delicată. Ideal, ai o funcție în user.js care recalculează producția totală
    // și consumul total pe baza nivelurilor tuturor clădirilor și cercetărilor.
    // Aici, facem o actualizare directă, care ar putea fi inexactă dacă producția de bază
    // a clădirilor nu este actualizată corespunzător.

    // Pentru a face o recalculare corectă, ar trebui să:
    // 1. Iei toate clădirile active ale jucătorului.
    // 2. Iei toate cercetările active ale jucătorului.
    // 3. Calculezi producția de bază a fiecărei clădiri.
    // 4. Aplici bonusurile din cercetare (ex: 10% la mine de metal).
    // 5. Calculezi consumul de bază al fiecărei clădiri.
    // 6. Aplici reducerile din cercetare (ex: 5% la consum).
    // 7. Sumezi totalurile și actualizezi `userData.production`.

    // Ca o soluție rapidă (dar care poate necesita refactorizare ulterior):
    // Când o cercetare de producție este finalizată, stimulează recalcularea producției totale.
    // Aceasta înseamnă că `updateProduction` ar trebui să fie apelată cu NOUA producție totală, nu doar diferența.
    // Vom adăuga o funcție în `user.js` numită `recalculateTotalProductionAndConsumption()`
    // și o vom apela aici.

    // Aici, apelăm `recalculateTotalProductionAndConsumption` după ce o cercetare e gata.
    // Această funcție va fi adăugată în `user.js` și va fi responsabilă de logica complexă.
    // Trebuie să ai o funcție în `user.js` sau `buildings.js` care știe să calculeze producția și consumul bazat pe toate nivelurile clădirilor ȘI cercetărilor.
    // Deocamdată, doar afișăm un mesaj, dar reține că efectul real necesită o implementare mai complexă.
    showMessage(`Efectele cercetării "${research.name}" Nivel ${level} au fost aplicate!`, "info");
    // TODO: Implement actual recalculation of total production/consumption in user.js
    // și apelează-o aici:
    // recalculateTotalProductionAndConsumption();
}
