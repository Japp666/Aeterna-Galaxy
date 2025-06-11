console.log('matches.js loaded');

function initializeMatches() {
    const content = document.getElementById('matches-content');
    if (!content) {
        console.error('Matches content not found');
        return;
    }

    if (!gameState.league.standings.length) {
        initializeCompetitions();
        saveGame();
    }

    let html = '<h2>Liga Stelară (Tier ' + gameState.competitions.stellarLeague.tier + ')</h2>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += '<tr><th>Echipa</th><th>Puncte</th><th>Meciuri</th><th>Goluri</th></tr>';
    gameState.league.standings.forEach(team => {
        html += `<tr><td>${team.team}</td><td>${team.points}</td><td>${team.played}</td><td>${team.goalsFor}-${team.goalsAgainst}</td></tr>`;
    });
    html += '</table>';

    const nextMatch = gameState.league.schedule.find(m => m.week === gameState.league.currentWeek && (m.home === gameState.club.name || m.away === gameState.club.name));
    if (nextMatch) {
        html += `<h3>Următorul meci: Etapa ${gameState.league.currentWeek}</h3>`;
        html += `<p>${nextMatch.home} vs ${nextMatch.away}</p>`;
        html += `<button class="sf-button" onclick="simulateMatch(${gameState.league.currentWeek})">Simulează Meci</button>`;
    }

    content.innerHTML = html;
}

function initializeCompetitions() {
    const teams = [
        gameState.club.name, 'Nova Pulsar', 'Starforge', 'Nebula FC', 
        'Astro Blitz', 'Comet Strikers', 'Galaxian Rovers', 'Cosmo Elite',
        'Orbitron', 'Eclipse United', 'Quantum Sparks', 'Void Wanderers'
    ];
    gameState.league.standings = teams.map(team => ({
        team,
        points: 0,
        played: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        position: 1
    }));

    gameState.league.schedule = [];
    for (let week = 1; week <= 22; week++) {
        for (let i = 0; i < teams.length / 2; i++) {
            const home = teams[i];
            const away = teams[teams.length - 1 - i];
            gameState.league.schedule.push({ week, home, away, played: false });
        }
        teams.splice(1, 0, teams.pop());
    }
}

function simulateMatch(week) {
    let match = gameState.league.schedule.find(m => m.week === week && (m.home === gameState.club.name || m.away === gameState.club.name));
    if (!match) return;

    let homeTeam = gameState.league.standings.find(t => t.team === match.home);
    let awayTeam = gameState.league.standings.find(t => t.team === match.away);

    ensureBotPlayers();

    let homeRating = match.home === gameState.club.name ? calculateTeamRating() : Math.random() * 20 + 65;
    let awayRating = match.away === gameState.club.name ? calculateTeamRating() : Math.random() * 20 + 65;

    const modifiers = {
        attacking: { attack: 1.15, defense: 0.9, stamina: 1.1 },
        balanced: { attack: 1, defense: 1, stamina: 1 },
        defensive: { attack: 0.9, defense: 1.15, stamina: 0.9 },
        gegenpressing: { attack: 1.1, defense: 1.1, stamina: 1.2 },
        tiki-taka: { attack: 1.05, defense: 1, stamina: 1.15 },
        counterattack: { attack: 1.3, defense: 0.85, stamina: 1.1
    };

    const homeMod = modifiers[gameState.tactics.style];
    homeRating *= homeMod.attack * homeMod.defense;
    const homeGoals = Math.floor(Math.random() * 5 * (homeRating / (homeRating + awayRating)));
    const awayGoals = Math.floor(Math.random() * 5 * (awayRating / (homeRating + awayRating)));

    gameState.players.forEach(p => {
        if (!p.injured) {
            p.stamina = Math.max(0, p.stamina - (20 * homeMod.stamina));
            if (Math.random() < (p.stamina < 30 ? 0.15 : 0.05)) {
                p.injured = Math.floor(Math.random() * 6) + 1;
                showMessage(`${p.name} s-a accidentat (${p.injured} etape)!`, 'error');
            }
        }
    });

    homeTeam.played++;
    awayTeam.played++;
    homeTeam.goals += homeGoals;
    awayTeam.goalsFor += awayGoals;
    homeTeam.goalsAgainst += awayGoals;
    awayTeam.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
        homeTeam.points += 3;
        if (match.home === homeTeam.gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.min(p.moral + 15, 100));
        } else if (match.away === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.max(p.moral - 15, 20));
        }
    } else if (awayGoals > homeGoals) {
        awayTeam.points += 3;
        if (match.away === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.min(p.moral + 15, 100));
        } else if (match.home === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.max(p.moral - 15, 20)));
        }
    } else {
        homeTeam.points++;
        awayTeam.points++;
    }

    gameState.club.budget += gameState.club.stadiumCapacity * 150; // Ticket revenue
    gameState.fans += homeGoals > awayGoals ? 100 : 0; // Fanbase growth
    match.played = true;

    gameState.league.currentWeek++;
    gameState.gameDate.setDate(gameState.gameDate.getDate() + 3); // Advance 3 days

    if (gameState.league.currentWeek > 22) {
        handleEndOfSeason();
    }

    gameState.league.standings.sort((a, b) => {
        return b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    });
    gameState.league.standings.forEach((team, index) => team.position = index + 1);

    saveGame();
    checkPromotions();
    initializeMatches();
    updateHUD();
    showMessage(`Meci: ${match.home} ${homeGoals}-${awayGoals} ${match.away}`, 'success');
}

function ensureBotPlayers() {
    while (gameState.players.length < 11) {
        gameState.players.push({
            id: `bot-${Math.random().toString(36).slice(2)}`,
            name: `Unitate T-${Math.floor(Math.random() * 100)}`,
            position: ['Portar', 'Fundaș', 'Mijlocaș', 'Atacant'][Math.floor(Math.random() * 4)],
            rating: Math.floor(Math.random() * 10) + 50,
            moral: 100,
            stamina: 70,
            salary: 0,
            isBot: true
        });
    }
}

function calculateTeamRating() {
    const activePlayers = gameState.players.filter(p => !p.injured && p.stamina >= 10).slice(0, 11);
    return activePlayers.reduce((sum, p) => sum + p.rating * (p.moral / 100) * (p.stamina / 100), 0) / activePlayers.length;
}

function handleEndOfSeason() {
    gameState.league.currentWeek = 1;
    gameState.league.currentSeason++;
    gameState.league.standings.forEach(team => {
        team.points = 0;
        team.played = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
    });
    gameState.league.schedule.forEach(match => match.played = false);
    gameState.transferMarket = generateTransferMarket();
    gameState.players.forEach(p => {
        p.moral = Math.max(p.moral - 20, 20);
        if (p.injured) p.injured = Math.max(p.injured - 22, 0);
        p.contractYears = (p.contractYears || 1) - 1;
        if (p.contractYears <= 0 && !p.isBot) {
            gameState.players = gameState.players.filter(p2 => p2.id !== p.id);
            showMessage(`${p.name} a părăsit clubul (contract expirat)!`, 'error');
        }
    });
    gameState.players = gameState.players.filter(p => !p.isBot); // Remove bots
    gameState.club.budget -= gameState.players.reduce((sum, p) => sum + (p.salary || 0), 0);
    if (gameState.club.budget < 0) {
        showMessage('Clubul este în faliment! Vinde jucători!', 'error');
    }
}

function checkPromotions() {
    const tier = gameState.competitions.stellarLeague.tier;
    const position = gameState.league.standings.find(s => s.team === gameState.club.name).position;
    if (position <= 2 && tier < 1) {
        gameState.competitions.stellarLeague.tier--;
        gameState.club.budget += 2000000; // Promotion bonus
        showMessage(`Felicitări! Ai promovat în Liga Stelară Tier ${tier - 1}!`, 'success');
        initializeCompetitions();
    } else if (position >= 11 && tier > 3) {
        gameState.competitions.stellarLeague.tier++;
        showMessage(`Ai retrogradat în Liga Stelară ${tier + 1}!`, 'error');
        initializeCompetitions();
    }
}
