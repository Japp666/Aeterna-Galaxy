console.log('map.js loaded');

function initializeMap() {
    const canvas = document.getElementById('galaxy-map');
    if (!canvas) {
        console.error('Galaxy map canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const mapImage = new Image();
    mapImage.src = 'https://i.postimg.cc/mrfgr13H/harta.jpg';
    const playerBaseImage = new Image();
    playerBaseImage.src = 'https://i.postimg.cc/d1CWNMvH/baza-jucator.jpg';

    const cellSize = canvas.width / 50; // Presupunem o grilă de 50x50

    function drawMap() {
        // Desenăm imaginea hărții
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

        // Desenăm baza jucătorului
        if (playerBaseImage.complete) {
            const x = gameState.player.coords.x * cellSize - 10;
            const y = gameState.player.coords.y * cellSize - 10;
            ctx.drawImage(playerBaseImage, x, y, 20, 20);
            ctx.fillStyle = '#B0B0B0';
            ctx.font = '10px Orbitron';
            ctx.fillText('Baza ta', x + 25, y + 15);
        }
    }

    mapImage.onload = drawMap;
    playerBaseImage.onload = drawMap;

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        showMessage(`Coordonate selectate: (${x}, ${y})`, 'info');
    });
}
