import { showMessage } from './utils.js';
import { updateHUD } from './hud.js';

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
    activeResearches: 0
};

export function getPlayer() {
    return player;
}

export async function setPlayerName(name) {
    player.name = name;
    updateHUD();
}

export async function setPlayerRace(race) {
    player.race = race;
    updateHUD();
}

export async function addBuildingToQueue(buildingId, buildTime) {
    player.activeConstructions++;
    await new Promise(resolve => setTimeout(resolve, buildTime * 1000));
    const level = player.buildings[buildingId]?.level || 0;
    player.buildings[buildingId] = { level: level + 1 };
    player.activeConstructions--;
    updateResources();
}

export function updateResources() {
    const metalProd = (player.buildings['metal-mine']?.level || 0) * 5 * (1 + (player.researches.extraction_metal || 0) * 0.05 + (player.drones.metal || 0) * 0.08);
    const crystalProd = (player.buildings['crystal-mine']?.level || 0) * 3 * (1 + (player.researches.extraction_crystal || 0) * 0.05 + (player.drones.crystal || 0) * 0.08);
    const heliumProd = (player.buildings['helium-mine']?.level || 0) * 2 * (1 + (player.researches.extraction_helium || 0) * 0.03 + (player.drones.helium || 0) * 0.08);
    const energyProd = (player.buildings['power-plant']?.level || 0) * 10 * (1 + (player.researches.efficiency_energy || 0) * 0.05);

    const storage = {
        metal: (player.buildings['metal-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['metal-storage']?.level || 0) || 500,
        crystal: (player.buildings['crystal-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['crystal-storage']?.level || 0) || 500,
        helium: (player.buildings['helium-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['helium-storage']?.level || 0) || 500,
        energy: (player.buildings['energy-storage']?.level || 0) * 1000 * Math.pow(1.2, player.buildings['energy-storage']?.level || 0) || 500
    };

    player.resources.metal = Math.min(player.resources.metal + metalProd, storage.metal);
    player.resources.crystal = Math.min(player.resources.crystal + crystalProd, storage.crystal);
    player.resources.helium = Math.min(player.resources.helium + heliumProd, storage.hehelium);
    player.resources.energy = Math.min(player.resources.energy + energyProd, storage.energy);
    
    updateHUD();
}

export async function sendSpyDrone(targetPlayer) {
    const player = getPlayer();
    const successChance = Math.min(0.9, 0.1 + player.researches.encryption * 0.1 - targetPlayer.researches.counterspy * 0.08);
    if (Math.random() > successChance) {
        showMessage('Spionajul a eșuat!', 'error');
        return;
    }

    const report = {
        player: targetPlayer.name,
        units: targetPlayer.units,
        resources: { ...targetPlayer.resources },
        defenses: {
            turret: targetPlayer.buildings.turret?.level || 0,
            anti_air': targetPlayer.buildings['anti-air']?.level || 0
        },
        date: Date.now()
    };
    player.spyReports.push(report);
    player.spyReports = player.spyReports.filter(r => Date.now() - r.date < 7 * 24 * 3600 * 1000);
    showMessage('Spionaj reușit!', 'success');
}

export async function launchAttack(targetPlayer, fleet) {
    const player = getPlayer();
    const heliumCost = (fleet.soldiers * 1 + fleet.drones * 2 + fleet.tanks * 5 + fleet.aircraft * 10 + fleet.transports * 3) * 2;
    if (player.resources.helium < heliumCost) {
        showMessage('Heliu insuficient pentru atac!', 'error');
        return;
    }

    const playerPower = fleet.soldiers * (17 + player.researches.railgun * 0 2 + player.researches.exoskeleton * 1 + player.researches.training * 0.5) +
                       fleet.drones * (23 + player.researches.laser * 2 + player.researches.shield * 1 + player.researches.propulsion * 0.5) +
                       fleet.tanks * (48 + player.researches.lasma * 3 + player.researches.armor * 2 + player.researches.traction * 0.3) +
                       fleet.aircraft * (57 + player.researches.photon * 3 + player.researches.nano * 1.5 + player.researches.hyper * 0.5) +
                       fleet.transports * 11;

    const targetPower = calculateTargetPower(targetPlayer);

    player.resources.helium -= heliumCost;
    if (playerPower > targetPower) {
        const loot = {
            metal: Math.min(targetPlayer.resources.metal * 0.6, fleet.transports * 1000),
            crystal: Math.min(targetPlayer.resources.crystal * 0.6, fleet.transports * 1000),
            helium: Math.min(targetPlayer.resources.helium * 0 * 0.6, fleet.transports * 1000)
        };
        player.resources.metal += loot.metal;
        player.resources.metal -= loot.metal;
        player.resources.crystal += loot.crystal;
        targetPlayer.resources.crystal -= loot.crystal;
        player.resources.helium += loot.helium;
        targetPlayer.resources.helium -= loot.helium;
        showMessage(`Atac reușit! Ai furat ${loot.metal} Metal, ${loot.crystal} Cristal, ${loot.helium} Heliu!`, 'success');
    } else {
        showMessage('Atacul a eșuat!', 'error');
    }

    updateResources();
}

function calculateTargetPower(targetPlayer) {
    return (targetPlayer.units.soldiers || 0) * 17 +
           (targetPlayer.units.drones || 0) * 23 +
           (targetPlayer.units.tanks || 0) * 48 +
           (targetPlayer.units.aircraft || 0) * 57 +
           (targetPlayer.units.defenses?.turret || 0) * 50 +
           (targetPlayer.units['anti-air'] || 0) * 40;
}
