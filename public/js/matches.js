console.log('matches.js loaded');

function initializeMatches() {
    const matchesContent = document.getElementById('matches-content');
    if (!matchesContent) {
        console.error('Matches content not found');
        return;
    }

    // Initialize league if not set
    if (!gameState.league.standings.length) {
        initializeLeague();
        saveGame();
    }

    let html = '<h2>Clasament</h2><table style="width: 100%; border-collapse: collapse;">';
    html += '<tr><th>Echipa</th><th>Puncte</th><th>Meciuri</th><th>Goluri</th></tr>';
    gameState.league.standings.forEach(team => {
        html += `<tr><td>${team.team}</td><td>${team.points}</td><td>${team.played}</td><td>${team.goalsFor}-${team.goalsAgainst}</td></tr>`;
    });
    html += '</table>';

    const nextMatch = gameState.league.schedule.find(m => m.week === gameState.league.currentWeek && (m.home === gameState.club.name || m.away === gameState.club.name));
    if (nextMatch) {
        html += `<h2>Următorul meci: Etapa ${gameState.league.currentWeek}</h2>`;
        html += `<p>${nextMatch.home} vs ${nextMatch.away}</p>`;
        html += `<button class="sf-button" onclick="simulateMatch(${gameState.league.currentWeek})">Simulează Meci</button>`;
    }

    matchesContent.innerHTML = html;
}

function initializeLeague() {
    const teams = [gameState.club.name, 'Galaxia FC', 'Cometa United', 'Nebuloasa', 'Astro City', 'Luna Rovers', 'Starlight FC', 'Cosmos Club', 'Orbiters', 'Pulsar', 'Nova Team', 'Eclipse'];
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
        teams.splice(1, 0, teams.pop()); // Rotate teams
    }
}

function simulateMatch(week) {
    const match = gameState.league.schedule.find(m => m.week === week && (m.home === gameState.club.name || m.away === gameState.club.name));
    if (!match) return;

    const homeTeam = gameState.league.standings.find(t => t.team === match.home);
    const awayTeam = gameState.league.standings.find(t => t.team === match.away);

    let homeRating = match.home === gameState.club.name ? calculateTeamRating() : Math.floor(Math.random() * 20) + 65;
    let awayRating = match.away === gameState.club.name ? calculateTeamRating() : Math.floor(Math.random() * 20) + 65;

    if (gameState.tactics.style === 'attacking') {
        homeRating += 10;
        awayRating -= 10;
    } else if (gameState.tactics.style === 'defensive') {
        homeRating -= 10;
        awayRating += 10;
    }

    const homeGoals = Math.floor(Math.random() * 4 * (homeRating / (homeRating + awayRating)));
    const awayGoals = Math.floor(Math.random() * 4 * (awayRating / (homeRating + awayRating)));

    homeTeam.played++;
    awayTeam.played++;
    homeTeam.goalsFor += homeGoals;
    homeTeam.goalsAgainst += awayGoals;
    awayTeam.goalsFor += awayGoals;
    awayTeam.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
        homeTeam.points += 3;
        if (match.home === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.min(p.moral + 10, 100));
        } else if (match.away === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.max(p.moral - 10, 0));
        }
    } else if (awayGoals > homeGoals) {
        awayTeam.points += 3;
        if (match.away === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.min(p.moral + 10, 100));
        } else if (match.home === gameState.club.name) {
            gameState.players.forEach(p => p.moral = Math.max(p.moral - 10, 0));
        }
    } else {
        homeTeam.points++;
        awayTeam.points++;
    }

    gameState.club.budget += gameState.club.stadiumCapacity * 100; // Ticket revenue
    match.played = true;
    gameState.league.currentWeek++;
    if (gameState.league.currentWeek > 22) {
        gameState.league.currentWeek = 1;
        gameState.league.currentSeason++;
        resetSeason();
    }

    // Update standings
    gameState.league.standings.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
    gameState.league.standings.forEach((team, index) => team.position = index + 1);

    // Advance game date
    gameState.gameDate.setDate(gameState.gameDate.getDate() + 7);

    // Random injuries
    if (Math.random() < 0.05) {
        const player = gameState.players[Math.floor(Math.random() * gameState.players.length)];
        player.injured = Math.floor(Math.random() * 3) + 1;
        showMessage(`${player.name} s-a accidentat (${player.injured} etape)!`, 'error');
    }

    saveGame();
    initializeMatches();
    updateHUD();
    showMessage(`Meci simulat: ${match.home} ${homeGoals}-${awayGoals} ${match.away}`, 'success');
}

function calculateTeamRating() {
    return gameState.players.reduce((sum, p) => sum + (p.injured ? 0 : p.rating * (p.moral / 100)), 0) / 11;
}

function resetSeason() {
    gameState.league.standings.forEach(team => {
        team.points = 0;
        team.played = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
    });
    gameState.league.schedule.forEach(match => match.played = false);
    gameState.transferMarket = generateTransferMarket();
    gameState.players.forEach(p => {
        p.moral = Math.max(p.moral - 10, 50);
        if (p.injured) p.injured = Math.max(p.injured - 22, 0);
    });
    gameState.club.budget -= gameState.players.reduce((sum, p) => sum + p.salary, 0);
    if (gameState.club.budget < 0) {
        showMessage('Clubul este în faliment! Vinde jucători!', 'error');
    }
}
