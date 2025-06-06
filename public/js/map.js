console.log('map.js loaded');

function initializeMap() {
    const canvas = document.getElementById('galaxy-map');
    const tooltip = document.getElementById('map-tooltip');
    if (!canvas || !tooltip) {
        console.error('Galaxy map canvas or tooltip not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const mapImage = new Image();
    mapImage.src = 'https://i.postimg.cc/mrfgr13H/harta.jpg';
    const playerBaseImage = new Image();
    playerBaseImage.src = 'https://i.postimg.cc/d1CWNMvH/baza-jucator.jpg';

    const gridSize = 50;
    const cellSize = canvas.width / gridSize;

    function drawMap() {
        // Desenăm harta
        ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

        // Grilă discretă
        ctx.strokeStyle = 'rgba(110, 110, 110, 0.3)';
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

    mapImage.onload = drawMap;
    playerBaseImage.onload = drawMap;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.textContent = `(${x}, ${y})`;
    });

    canvas.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        showMessage(`Coordonate selectate: (${x}, ${y})`, 'info');
    });
}
