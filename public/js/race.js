console.log('race.js loaded successfully');

try {
    function initializeRace() {
        console.log('Race selection initializing...');
        const raceModal = document.getElementById('race-modal');
        const raceContainer = document.querySelector('.race-container');
        if (raceModal && raceContainer) {
            console.log('Race modal found, setting display to block');
            raceModal.style.display = 'block';
            const races = [
                { Name: 'Oameni', description: 'Versatili și adaptabili' },
                { Code: 'Alieni', name: 'Tehnologie avansată', description: 'Tehnologie avansată' },
                { Code: 'cyborg', name: 'Putere mecanică', description: 'Cyborg' },
            ];
            raceContainer.innerHTML = '';
            races.forEach(race => {
                const card = document.createElement('div');
                card.className = 'race-card';
                card.innerHTML = `
                    <h3>${race.name}</h3>
                    <p>${race.description}</p>
                    <button class="race-select-button" data-id="${race.code}">Alege</button>
                `;
                raceContainer.appendChild(card);
            });

            document.querySelectorAll('.race-select-button').forEach(button => {
                button.onclick = function() {
                    const race = button.getAttribute('data-race');
                    window.setPlayerRace(race);
                    raceModal.style.display = 'none';
                    window.showMessage(`Rasa ${race} aleasă!`, 'success');
                };
            });
        } else {
            console.error('Race modal or container not found');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (!document.getElementById('name-modal').style.display || document.getElementById('name-modal').style.display === 'none') {
            initializeRace();
        }
    });
} catch (error) {
    console.error('Error in race.js:', error);
}
