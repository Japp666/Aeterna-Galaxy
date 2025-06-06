console.log('map.js loaded');

function initializeMap() {
    const canvas = document.getElementById('galaxy-map');
    if (!canvas) {
        console.error('Galaxy map canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const gridSize = 50;
    const cellSize = canvas.width / gridSize;
    const playerBaseImage = new Image();
    playerBaseImage.src = 'https://i.postimg.cc/8C2Y2k3n/player-base.png';

    function drawMap() {
        // Fundal negru
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Stele aleatorii
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Grilă
        ctx.strokeStyle = '#6E6E6E';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= canvas.width; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Planete (aleatorii)
        const planets = [
            { x: 10, y: 10, color: '#FF6347', name: 'Alpha' },
            { x: 30, y: 20, color: '#4682B4', name: 'Beta' },
            { x: 15, y: 40, color: '#32CD32', name: 'Gamma' }
        ];
        planets.forEach(planet => {
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(planet.x * cellSize, planet.y * cellSize, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#B0B0B0';
            ctx.font = '10px Orbitron';
            ctx.fillText(planet.name, planet.x * cellSize + 10, planet.y * cellSize);
        });

        // Baza jucătorului
        if (playerBaseImage.complete) {
            const x = gameState.player.coords.x * cellSize - 10;
            const y = gameState.player.coords.y * cellSize - 10;
            ctx.drawImage(playerBaseImage, x, y, 20, 20);
            ctx.fillStyle = '#B0B0B0';
            ctx.font = '10px Orbitron';
            ctx.fillText('Baza ta', x + 25, y + 15);
        }
    }

    playerBaseImage.onload = drawMap;

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        showMessage(`Coordonate selectate: (${x}, ${y})`, 'info');
    });
}
