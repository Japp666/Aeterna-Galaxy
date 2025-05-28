import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';
import { refreshBuildingUI, updateBuildButtons } from './buildings.js';

let player = {
    name: '',
    race: '',
    resources: { metal: 1000, crystal: 500, helium: 200, energy: 500 },
    buildings: {},
    units: { soldiers: 0, drones: 0, tanks: 0, aircraft: 0, transports: 0, 'spy-drone': 0 },
    drones: { metal: 0, crystal: 0, helium: 0 },
    researches: {
        railgun: 0, exoskeleton: 0, training: 0,
        laser: 0, shield: 0, propulsion: 0,
        plasma: 0, armor: 0, traction: 0,
        photon: 0, nano: 0, hyper: 0,
        extraction_metal: 0, extraction_crystal: 0, extraction_helium: 0, efficiency_energy: 0,
        encryption: 0, counterspy: 0
    },
    spyReports: [],
    activeConstructions: 0,
    constructionQueue: [],
    activeResearches: 0
};

let lastUpdate = performance.now();
let lastResourceUpdate = performance.now();

export function getPlayer() {
    return player;
}

export function getProductionPerHour() {
    const metalProd = (player.buildings['metal-mine']?.level || 0) * 5 * (1 + (player.researches.extraction_metal || 0) * 0.05 + (player.drones.metal || 0) * 0.08) * 3600;
    const crystalProd = (player.buildings['crystal-mine']?.level || 0) * 3 * (1 + (player.researches.extraction_crystal || 0) * 0.05 + (player.drones.crystal || 0) * 0.08) * 3600;
    const heliumProd = (player.buildings['helium-mine']?.level || 0) * 2 * (1 + (player.researches.extraction_helium || 0) * 0.03 + (player.drones.helium || 0) * 0.08) * 3600;
    const energyProd = (player.buildings['power-plant']?.level || 0) * 10 * (1 + (player.researches.efficiency_energy || 0) * 0.05) * 3600;
    return { metal: metalProd, crystal: crystalProd, helium: heliumProd, energy: energyProd };
}

export async function setPlayerName(name) {
    player.name = name;
    updateHUD(player);
}

export async function setPlayerRace(race) {
    player.race = race;
    updateHUD(player);
}

export async function addBuildingToQueue(buildingId, buildTime) {
    const maxSlots = (player.buildings['adv-research-center']?.level || 0) + 1;
    console.log('Adding to queue:', { buildingId, activeConstructions: player.activeConstructions, maxSlots });
    if (player.activeConstructions >= maxSlots) {
        showMessage('Toate sloturile de construcție sunt ocupate!', 'error');
        return false;
    }

    player.activeConstructions++;
    const completionTime = Date.now() + buildTime * 1000;
    player.constructionQueue.push({ buildingId, completionTime });
    console.log('Added to queue:', { buildingId, buildTime, completionTime, activeConstructions: player.activeConstructions });
    return true;
}

export function processConstructionQueue() {
    const now = Date.now();
    const updatedQueue = [];
    let updated = false;

    console.log('Processing queue:', { queue: player.constructionQueue, activeConstructions: player.activeConstructions });

    for (const entry of player.constructionQueue) {
        if (now >= entry.completionTime) {
            const level = player.buildings[entry.buildingId]?.level || 0;
            player.buildings[entry.buildingId] = { level: level + 1 };
            player.activeConstructions = Math.max(0, player.activeConstructions - 1);
            console.log('Building completed:', { buildingId: entry.buildingId, newLevel: level + 1, activeConstructions: player.activeConstructions });
            showMessage(`Clădirea ${entry.buildingId} a fost finalizată! Nivel ${level + 1}`, 'success');
            refreshBuildingUI(entry.buildingId);
            updated = true;
        } else {
            updatedQueue.push(entry);
        }
    }

    player.constructionQueue = updatedQueue;
    if (updated) {
        console.log('Queue updated:', { queue: player.constructionQueue, activeConstructions: player.activeConstructions });
        updateHUD(player);
        updateBuildButtons();
    }
}

export function updateResources() {
    const now = performance.now();
    const deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;

    processConstructionQueue();

    if (now - lastResourceUpdate < 60000) {
        requestAnimationFrame(updateResources);
        return;
    }
    lastResourceUpdate = now;

    const metalProd = (player.buildings['metal-mine']?.level || 0) * 5 * (1 + (player.researches.extraction_metal || 0) * 0.05 + (player.drones.metal || 0) * 0.08) * 60;
    const crystalProd = (player.buildings['crystal-mine']?.level || 0) * 3 * (1 + (player.researches.extraction_crystal || 0) * 0.05 + (player.drones.crystal || 0) * 0.08) * 60;
    const heliumProd = (player.buildings['helium-mine']?.level || 0) * 2 * (1 + (player.researches.extraction_helium || 0) * 0.03 + (player.drones.helium || 0) * 0.08) * 60;
    const energyProd = (player.buildings['power-plant']?.level || 0) * 10 * (1 + (player.researches.efficiency_energy || 0) * 0.05) * 60;

    const storage = {
        metal: (player.buildings['metal-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['metal-storage']?.level || 0) || 500,
        crystal: (player.buildings['crystal-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['crystal-storage']?.level || 0) || 500,
        helium: (player.buildings['helium-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['helium-storage']?.level || 0) || 500,
        energy: (player.buildings['energy-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['energy-storage']?.level || 0) || 500
    };

    player.resources.metal = Math.min(player.resources.metal + metalProd, storage.metal);
    player.resources.crystal = Math.min(player.resources.crystal + crystalProd, storage.crystal);
    player.resources.helium = Math.min(player.resources.helium + heliumProd, storage.helium);
    player.resources.energy = Math.min(player.resources.energy + energyProd, storage.energy);

    console.log('Resources updated:', player.resources);

    updateHUD(player);

    requestAnimationFrame(updateResources);
}

export async function sendSpyDrone(targetPlayer) {
    const successChance = Math.min(0.9, 0.1 + player.researches.encryption * 0.1 - targetPlayer.researches.counterspy * 0.08);
    if (Math.random() > successChance) {
        showMessage('Spionajul a eșuat!', 'error');
        return;
    }

    const report = {
        player: targetPlayer.name,
        units: { ...targetPlayer.units },
        resources: { ...targetPlayer.resources },
        defenses: {
            turret: targetPlayer.buildings.turret?.level || 0,
            'anti-air': targetPlayer.buildings['anti-air']?.level || 0
        },
        date: Date.now()
    };
    player.spyReports.push(report);
    player.spyReports = player.spyReports.filter(r => Date.now() - r.date < 7 * 24 * 3600 * 1000);
    showMessage('Spionaj reușit!', 'success');
}

export async function launchAttack(targetPlayer, fleet) {
    const heliumCost = (fleet.soldiers * 1 + fleet.drones * 2 + fleet.tanks * 5 + fleet.aircraft * 10 + fleet.transports * 3) * 2;
    if (player.resources.helium < heliumCost) {
        showMessage('Heliu insuficient pentru atac!', 'error');
        return;
    }

    const playerPower = fleet.soldiers * (17 + player.researches.railgun * 2 + player.researches.exoskeleton * 1 + player.researches.training * 0.5) +
                        fleet.drones * (23 + player.researches.laser * 2 + player.researches.shield * 1 + player.researches.propulsion * 0.5) +
                        fleet.tanks * (48 + player.researches.plasma * 3 + player.researches.armor * 2 + player.researches.traction * 0.3) +
                        fleet.aircraft * (57 + player.researches.photon * 3 + player.researches.nano * 1.5 + player.researches.hyper * 0.5) +
                        fleet.transports * 11;

    const targetPower = calculateTargetPower(targetPlayer);

    player.resources.helium -= heliumCost;
    if (playerPower > targetPower) {
        const loot = {
            metal: Math.min(targetPlayer.resources.metal * 0.6, fleet.transports * 1000),
            crystal: Math.min(targetPlayer.resources.crystal * 0.6, fleet.transports * 1000),
            helium: Math.min(targetPlayer.resources.helium * 0.6, fleet.transports * 1000)
        };
        player.resources.metal += loot.metal;
        targetPlayer.resources.metal -= loot.metal;
        player.resources.crystal += loot.crystal;
        targetPlayer.resources.crystal -= loot.crystal;
        player.resources.helium += loot.helium;
        targetPlayer.resources.helium -= loot.helium;
        showMessage(`Atac reușit! Ai furat ${loot.metal} Metal, ${loot.crystal} Cristal, ${loot.helium} Heliu!`, 'success');
    } else {
        showMessage('Atacul a eșuat!', 'error');
    }

    updateHUD(player);
}

function calculateTargetPower(targetPlayer) {
    return (targetPlayer.units.soldiers || 0) * 17 +
           (targetPlayer.units.drones || 0) * 23 +
           (targetPlayer.units.tanks || 0) * 48 +
           (targetPlayer.units.aircraft || 0) * 57 +
           (targetPlayer.buildings.turret?.level || 0) * 50 +
           (targetPlayer.buildings['anti-air']?.level || 0) * 40;
}

requestAnimationFrame(updateResources);
