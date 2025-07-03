// js/game-state.js
import { GAME_DIVISIONS } from './teams-data.js';
import { generateDivisionSchedule } from './match-scheduler.js';
import { generatePlayer } from './player-generator.js'; // Asumăm că există deja

/**
 * Obiectul global care va stoca toată starea jocului.
 * Va fi exportat pentru a putea fi accesat de alte module.
 */
export const gameState = {
    // Starea jocului principală
    coachName: '',
    clubName: '',
    clubLogo: '',
    currentBudget: 1000000, // Buget inițial
    currentSeason: 1,
    currentDay: 1, // Ziua curentă în sezon
    // Poți adăuga și alte informații de stare aici, cum ar fi reputația clubului, etc.

    // Informații despre ligă și echipe
    divisions: [], // Aici vom stoca diviziile cu echipele și programele lor
    userTeamId: '', // ID-ul echipei jucătorului
    userDivisionId: '', // ID-ul diviziei jucătorului

    // Metode pentru manipularea stării jocului
    initGame: function(coachName, clubName, clubLogo) {
        this.coachName = coachName;
        this.clubName = clubName;
        this.clubLogo = clubLogo;
        
        // Populăm diviziile cu datele inițiale din teams-data.js
        // Clonăm profund pentru a ne asigura că modificăm o copie și nu referința originală
        this.divisions = JSON.parse(JSON.stringify(GAME_DIVISIONS));

        // Generează jucători pentru fiecare echipă și programul pentru fiecare divizie
        this.divisions.forEach(division => {
            division.teams.forEach(team => {
                // Generăm 25 de jucători pentru fiecare echipă, ca exemplu
                for (let i = 0; i < 25; i++) { 
                    const player = generatePlayer(team.name); // generatePlayer ar trebui să existe deja
                    player.teamId = team.id; // Asociaza jucatorul cu echipa
                    team.players.push(player);
                }
            });
            // Generăm programul de meciuri pentru fiecare divizie
            division.schedule = generateDivisionSchedule(division.teams);
            console.log(`Programul pentru ${division.name} generat cu ${division.schedule.length} etape.`);
        });

        // Setăm echipa jucătorului (presupunem că e prima echipă din Divizia 1, pentru moment)
        // Aceasta va trebui adaptată când jucătorul își va alege echipa în setup.js
        this.userDivisionId = this.divisions[0].id; // Ex: Divizia 1
        this.userTeamId = this.divisions[0].teams[0].id; // Ex: Prima echipă din Divizia 1 (Stellar Comets FC)
        
        console.log('Starea jocului inițializată:', this);
    },

    // Metodă pentru a avansa o zi sau o etapă
    advanceDay: function() {
        this.currentDay++;
        console.log(`A avansat ziua la: ${this.currentDay}`);
        // Aici va veni logica de rulare a meciurilor pentru ziua respectivă
        // și actualizarea clasamentelor
    },

    // Metodă pentru a obține o echipă după ID
    getTeamById: function(teamId) {
        for (const division of this.divisions) {
            const team = division.teams.find(t => t.id === teamId);
            if (team) return team;
        }
        return null;
    },

    // Metodă pentru a obține o divizie după ID
    getDivisionById: function(divisionId) {
        return this.divisions.find(d => d.id === divisionId);
    },

    // Metodă pentru a obține echipa jucătorului
    getUserTeam: function() {
        return this.getTeamById(this.userTeamId);
    },

    // Metodă pentru a obține divizia jucătorului
    getUserDivision: function() {
        return this.getDivisionById(this.userDivisionId);
    }
    // Adaugă alte metode de manipulare a stării aici
};
