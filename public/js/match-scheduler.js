// js/match-scheduler.js

/**
 * Generează programul complet de meciuri (tur-retur) pentru o divizie dată.
 * Folosește algoritmul "Circle Method" pentru a crea un program echilibrat.
 * @param {Array<Object>} teams - Un array de obiecte echipă, fiecare cu un 'id' și 'name'.
 * @returns {Array<Array<Object>>} Un array de etape, fiecare etapă fiind un array de obiecte meci.
 */
export function generateDivisionSchedule(teams) {
    if (teams.length === 0) {
        return [];
    }
    if (teams.length % 2 !== 0) {
        // Adaugă o "echipă fictivă" dacă numărul de echipe este impar, pentru a simplifica algoritmul.
        // Această echipă va avea un "bye" (nu joacă) în acea etapă.
        teams.push({ id: 'bye', name: 'BYE', overallRating: 0 });
    }

    const numTeams = teams.length;
    const numRounds = (numTeams - 1) * 2; // Număr total de etape (tur-retur)
    const matchesPerRound = numTeams / 2;
    const schedule = [];

    // Clonează echipele pentru a nu modifica array-ul original
    let teamsCopy = [...teams];
    // Menține prima echipă fixă, restul se rotesc
    const fixedTeam = teamsCopy[0];
    let rotatingTeams = teamsCopy.slice(1);

    for (let round = 0; round < numRounds; round++) {
        const currentRoundMatches = [];
        
        // Meciuri pentru prima jumătate a sezonului (Tur)
        if (round < numRrounds / 2) { // Tur
            // Meciul cu echipa fixă
            let homeTeam = fixedTeam;
            let awayTeam = rotatingTeams[0];
            currentRoundMatches.push({
                matchId: `match-${round}-${homeTeam.id}-${awayTeam.id}`,
                homeTeamId: homeTeam.id,
                homeTeamName: homeTeam.name,
                awayTeamId: awayTeam.id,
                awayTeamName: awayTeam.name,
                score: null, // Scorul va fi populat după simulare
                played: false
            });

            // Restul meciurilor
            for (let i = 1; i < matchesPerRound; i++) {
                homeTeam = rotatingTeams[rotatingTeams.length - i];
                awayTeam = rotatingTeams[i];
                currentRoundMatches.push({
                    matchId: `match-${round}-${homeTeam.id}-${awayTeam.id}`,
                    homeTeamId: homeTeam.id,
                    homeTeamName: homeTeam.name,
                    awayTeamId: awayTeam.id,
                    awayTeamName: awayTeam.name,
                    score: null,
                    played: false
                });
            }
        } else { // Retur
            const turRound = round - (numRounds / 2);
            const turMatches = schedule[turRound];
            turMatches.forEach(match => {
                // Inversăm echipele pentru meciul retur
                currentRoundMatches.push({
                    matchId: `match-${round}-${match.awayTeamId}-${match.homeTeamId}`,
                    homeTeamId: match.awayTeamId,
                    homeTeamName: match.awayTeamName,
                    awayTeamId: match.homeTeamId,
                    awayTeamName: match.homeTeamName,
                    score: null,
                    played: false
                });
            });
        }
        
        schedule.push(currentRoundMatches.filter(m => m.homeTeamId !== 'bye' && m.awayTeamId !== 'bye'));

        // Rotim echipele (doar pentru tur, returul e inversarea turului)
        if (round < numRounds / 2) {
            const lastRotatingTeam = rotatingTeams.pop();
            rotatingTeams.unshift(lastRotatingTeam);
        }
    }

    // Elimină echipa fictivă dacă a fost adăugată
    if (teamsCopy.length !== teams.length) {
        teams.pop(); 
    }

    return schedule;
}
