// js/teams-data.js

export const ALL_TEAMS_NAMES = [
    "Stellar Comets FC", "Orion Blasters", "Nebula Strikers", "Andromeda Titans", "Lunar Wolves", "Galactic Raptors", "Astrocore United", "Quantum Blades", "Celestial Phoenix", "Voidwalkers FC", "Solaris Drifters", "Plasma Storm FC", "Meteor Vortex", "Hypernova Knights", "Zenith Hunters", "Iron Moons FC",
    "Omega Squadron", "Darkstar Nomads", "Fusion Pulse FC", "Titan Reactor", "Warpdrive Wanderers", "Black Hole FC", "Supernova Rebels", "Zero Gravity FC", "Marscore Legion", "Starcrash Elite", "Cometfire FC", "Holo Rangers", "AI Dynamo FC", "Nebulon Forge", "Cyberspace Eagles", "Omega Orbiters",
    "Chrono Blazers", "Cygnus Roar", "Ionwave Sentinels", "Galactic Forge FC", "Martian Vultures", "Nova Raptors", "Hyperdrive Sabres", "Stellar Anarchy", "Cosmic Dominion", "Warp Wolves", "Astro Synth FC", "AndroCore Chargers", "Binary Falcons", "Mechstorm FC", "Intergalactic Armada", "Phobos Vipers",
    "Xenon Slashers", "Quantum Titans", "Vortex Screamers", "Venus Shard FC", "ZeroPoint Wolves", "Saturn Syndicate", "Crater Kings", "Fusion Core United", "Eclipse Raiders", "Asteroid Breakers", "Andromeda Howl", "Warpfangs FC", "Galactic Saints", "Dark Matter FC", "Starbeast United", "Solaris Reapers",
    "Cybot Crushers", "Holo Howlers", "Titan Orbit FC", "Nova Burners", "Synthblade FC", "Interstellar Aces", "Quantum Hazard", "Redshift Nomads", "Astrowire FC", "Omega Talons", "Cryo Blizzards", "Void Knights FC", "Spectral Wolves", "Black Nebula FC", "Cosmotron FC", "Plasma Reavers",
    "Chrono Raptors", "Xenith Xplorers", "Stellar Blades", "Reactor Rage FC", "Cometbane FC", "Rift Slashers", "Jetstream Drifters", "Exo Reign FC", "Titan Pulse FC", "Mars Blasters", "Cybercore Wolves", "Bioforge FC", "Venus Vortex", "Stellar Matrix", "Ionstorm Hunters", "Phoenix Drive",
    "Mecha Reign FC", "Warp Titans", "Lunaris Legacy", "Nova Venom FC", "Rift Howl FC", "Solaris Vultures", "Singularity FC", "Thunder Nova", "Voidstorm United", "Darksky Crushers", "Galactic Dawn", "Proton Scorchers", "Astral Swarm", "Interspace Owls", "Skyforge Raptors", "Omega Roar FC",
    "Nebula Pioneers", "Hyperlight Hunters", "Quasar Impact FC", "Titanflare United", "Venus Outriders", "Void Engine FC", "Xenon Blaze", "Quarkstorm FC", "Cosmic Talons", "Eclipse Knights", "Astro Gears", "Terra Nova FC", "Magnetic Blitz", "Warpshock FC", "Mech Howlers", "Voidflare Legion",
    "Cryo Vultures", "Spaceborn FC", "Exo Shadows", "Reactor Wolves", "Nova Roamers", "Marscore Thunder", "Ghost Orbiters", "Lunar Fangs", "Ionbound United", "Spectra Burners", "Warpstream Slashers", "Antimatter FC", "Mecha Drive FC", "Cyberstorm Talons", "Holo Stalkers", "Meteor Roar FC",
    "Zerozone Blades", "Phoenixfall FC", "Saturn Blaze", "ExoTrek United", "Titansteel FC", "Rift Syndicate", "Dark Pulse Wolves", "Nebula Charge FC", "Chrono Pulse FC", "Omega Blaze United", "Starhunter FC", "Gravity Slashers", "Warpstar Crushers", "Plasma Wraiths", "Ionfall FC", "Nebula Roar",
    "Quantum Reign", "Cosmogear FC", "Darkspace Serpents", "Hypernova Wings", "Voidfire Rangers", "Ghostfire FC", "Mechcore Phoenix", "Cyberstorm Legion", "Holo Wolves United", "Terra Rift FC", "Singularity Slashers", "Marsfang Blasters", "Rocketstorm FC", "Xenon Vortex", "Orion Blaze FC", "Galactic Titans United",
    "Eclipse Surge FC", "Phobos Warlords", "Celestial Shockers", "Cometbreakers", "Nebulon Raptors", "Quasar Reign FC", "Plasmaborn Blades", "Warp Vultures", "Astro Phantom FC", "Saturn Nova", "Mech Pulse FC", "Shadowspace Knights", "Quantum Blaze FC", "Cyber Nova Rangers", "Gravity Hunters FC", "Rift Phoenix",
    "Pulsar Talons FC", "Ionstorm Legion", "Orbital Storm FC", "Cosmic Fangs", "Voidwalk Vipers", "Jetflame Wolves", "Lunaris Blaze", "Coreburn FC", "Meteorwave Slashers", "Ghost Reactor", "Warpcharge Owls", "Terra Vortex FC", "Titanfire FC", "Starshock Syndicate", "Cryo Knights United", "Saturn Pulse FC",
    "Plasma Tigers", "Ionflux FC", "Astralis Nomads", "Mechstrike Wolves", "Stellar Boom FC", "Cosmoslash Hunters", "Binary Comets", "Omega Wraiths", "Void Pulse FC", "Andro Howlers", "Hypernova Slashers", "Xenolith FC", "Lunar Roamers", "Nebulon Drive FC", "Solarstorm Vultures", "Quarkfangs FC",
    "Riftstorm Raptors", "Warp Howl FC", "Cryo Pulse Blades", "Galaxyborn Reign", "Cometflare FC", "Photon Wolves", "Mech Rift FC", "Cyberpulse Howlers", "Mars Vortex FC", "Stellar Drift FC", "Void Engines", "Starforged Legion", "Eclipse Drift FC", "Titanwave Blades", "Astrostorm Nomads", "Ion Blaze FC",
    "Warpstride FC", "Nova Shard Blasters", "Phantom Moon FC", "Omega Drift FC", "CosmoCore Hunters", "Terraforge FC", "Meteor Drive Slashers", "Zero G Reapers", "Starshade FC", "Nebula Reign FC", "Galactic Orbiters", "Xenoforce FC", "Skybreaker Talons", "Lunarstorm Blades", "Ioncore Wraiths"
];

export const GAME_DIVISIONS = [];

// Populate divisions and teams
const teamsPerDivision = 16;
const totalDivisions = 10;
let teamIdCounter = 1;

for (let i = 0; i < totalDivisions; i++) {
    const divisionId = i + 1;
    const divisionName = `Divizia ${divisionId}`;
    const divisionTeams = [];

    for (let j = 0; j < teamsPerDivision; j++) {
        const teamNameIndex = (i * teamsPerDivision) + j;
        const teamName = ALL_TEAMS_NAMES[teamNameIndex];
        
        // Atribuim un OVR (Overall Rating) inițial aleatoriu.
        // Poți ajusta intervalele pentru a reflecta diferențe de nivel între divizii.
        // De exemplu, diviziile superioare pot avea OVR-uri medii mai mari.
        let overallRating;
        if (divisionId === 1) {
            overallRating = Math.floor(Math.random() * (95 - 80 + 1)) + 80; // Divizia 1: 80-95
        } else if (divisionId <= 3) {
            overallRating = Math.floor(Math.random() * (85 - 70 + 1)) + 70; // Diviziile 2-3: 70-85
        } else if (divisionId <= 6) {
            overallRating = Math.floor(Math.random() * (75 - 60 + 1)) + 60; // Diviziile 4-6: 60-75
        } else {
            overallRating = Math.floor(Math.random() * (65 - 50 + 1)) + 50; // Diviziile 7-10: 50-65
        }

        // Generează calea emblemei bazată pe index, ciclic pentru cele 19 embleme
        const emblemNumber = (teamNameIndex % 19) + 1; // Număr de la 1 la 19
        const paddedEmblemNumber = emblemNumber.toString().padStart(2, '0'); // Ex: 1 -> "01", 10 -> "10"
        const emblemUrl = `/img/emblems/emblema${paddedEmblemNumber}.png`;

        divisionTeams.push({
            id: `team-${teamIdCounter++}`,
            name: teamName,
            overallRating: overallRating,
            emblemUrl: emblemUrl, // Folosim calea dinamică
            players: [], // Placeholder for players, to be filled later
            stats: { // Initial stats for standings
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0
            }
        });
    }

    GAME_DIVISIONS.push({
        id: `division-${divisionId}`,
        name: divisionName,
        teams: divisionTeams,
        schedule: [] // Va fi populat în game-state.js
    });
}
