// js/user.js
export let user = {
    name: "PlayerOne", // Nume inițial, poate fi schimbat
    race: "Human",     // Rasă inițială, poate fi schimbată
    resources: {
        metal: 10000,
        crystal: 5000,
        energy: 2000
    },
    buildings: {}, // { metalMine: 1, energyPlant: 2, ... }
    technologies: {}, // { advancedMining: true, ... }
    fleet: {}, // { fighter: 5, bomber: 2, ... }
    score: 0,
    lastLogin: Date.now() // Timpul ultimei logări pentru calculul producției offline
};

export function loadUserData() {
    const savedUser = localStorage.getItem('spaceGameUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
        // Asigură-te că toate câmpurile există, chiar dacă nu erau în salvarea veche
        user.resources = user.resources || { metal: 0, crystal: 0, energy: 0 };
        user.buildings = user.buildings || {};
        user.technologies = user.technologies || {};
        user.fleet = user.fleet || {};
        user.score = user.score || 0;
        user.name = user.name || "PlayerOne";
        user.race = user.race || "Human";
        user.lastLogin = user.lastLogin || Date.now(); // Setează la login dacă lipsește
    }
}

export function saveUserData() {
    localStorage.setItem('spaceGameUser', JSON.stringify(user));
}
