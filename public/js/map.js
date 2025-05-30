console.log('map.js loaded');

function initializeMap() {
    console.log('initializeMap called');
    const canvas = document.getElementById('planetMap');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');
    const contextMenu = document.getElementById('contextMenu');
    const attackBtn = document.getElementById('attackBtn');
    const spyBtn = document.getElementById('spyBtn');

    if (!canvas || !ctx) {
        console.error('Canvas or context not found');
        return;
    }

    // Configurare grilă 20x10 pentru 200 jucători
    const gridWidth = 20;
    const gridHeight = 10;
    const cellWidth = canvas.width / gridWidth;
    const cellHeight = canvas.height / gridHeight;

    // Inițializare jucători
    if (!gameState.players || gameState.players.length === 0) {
        gameState.players = [];
        const taken = new Set();
        for (let i = 0; i < 200; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * gridWidth);
                y = Math.floor(Math.random() * gridHeight);
            } while (taken.has(`${x},${y}`));
            taken.add(`${x},${y}`);
            gameState.players.push({
                name: `Jucător ${i + 1}`,
                points: Math.floor(Math.random() * 10000),
                x: x,
                y: y
            });
        }
        saveGame();
        console.log('Initialized 200 players:', gameState.players);
    }

    // Încarc imaginea de fundal
    const bgImage = new Image();
    bgImage.src = 'https://i.postimg.cc/mrfgr13H/harta.jpg';
    bgImage.onload = () => {
        console.log('Background image loaded');
        drawMap();
    };
    bgImage.onerror = () => {
        console.error('Failed to load background image');
        drawMap();
    };

    function drawMap() {
        // Desenează fundalul
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Desenează grila
        ctx.strokeStyle = '#6E6E6E';
        ctx.lineWidth = 1;
        for (let x = 0; x <= gridWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellWidth, 0);
            ctx.lineTo(x * cellWidth, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= gridHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellHeight);
            ctx.lineTo(canvas.width, y * cellHeight);
            ctx.stroke();
        }

        // Marchează jucătorii
        gameState.players.forEach(player => {
            ctx.fillStyle = '#1E3A5F';
            ctx.fillRect(player.x * cellWidth + 2, player.y * cellHeight + 2, cellWidth - 4, cellHeight - 4);
            ctx.fillStyle = '#B0B0B0';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.name, player.x * cellWidth + cellWidth / 2, player.y * cellHeight + cellHeight / 2);
        });
    }

    // Hover
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridX = Math.floor(mouseX / cellWidth);
        const gridY = Math.floor(mouseY / cellHeight);

        const player = gameState.players.find(p => p.x === gridX && p.y === gridY);
        if (player) {
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.clientX + 10}px`;
            tooltip.style.top = `${e.clientY + 10}px`;
            tooltip.innerHTML = `Jucător: ${player.name}<br>Puncte: ${player.points}<br>Coordonate: (${gridX}, ${gridY})`;
        } else {
            tooltip.style.display = 'none';
        }
    });

    // Click
    canvas.addEventListener('click', (e) => {
        contextMenu.style.display = 'none';
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const gridX = Math.floor(mouseX / cellWidth);
        const gridY = Math.floor(mouseY / cellHeight);

        const player = gameState.players.find(p => p.x === gridX && p.y === gridY);
        if (player) {
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            attackBtn.onclick = () => {
                showMessage(`Atac către ${player.name} la (${gridX}, ${gridY})`, 'info');
                console.log(`Attack initiated on ${player.name} at (${gridX}, ${gridY})`);
                contextMenu.style.display = 'none';
            };
            spyBtn.onclick = () => {
                showMessage(`Spionaj către ${player.name} la (${gridX}, ${gridY})`, 'info');
                console.log(`Spy mission initiated on ${player.name} at (${gridX}, ${gridY})`);
                contextMenu.style.display = 'none';
            };
        }
    });

    // Ascunde meniul contextual la click în altă parte
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) && e.target !== canvas) {
            contextMenu.style.display = 'none';
        }
    });
}
