console.log('map.js loaded');

function initializeMap() {
    console.log('Map initialization started');
    const canvas = document.getElementById('map-canvas');
    if (!canvas) {
        console.error('Map canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;

    const background = new Image();
    background.src = 'https://i.postimg.cc/mrfgr13H/harta.jpg';
    background.onload = () => {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        console.log('Background drawn, size:', canvas.width, canvas.height);
        drawGrid();
    };
    background.onerror = () => console.error('Failed to load background image');

    function drawGrid() {
        const cellSize = 50;
        ctx.strokeStyle = '#6E6E6E';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 20; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, canvas.height);
            ctx.stroke();
            ctx.moveTo(0, x * cellSize);
            ctx.lineTo(canvas.width, x * cellSize);
            ctx.stroke();
        }

        const baseImage = new Image();
        baseImage.src = 'https://via.placeholder.com/50'; // Placeholder valid
        baseImage.onload = () => {
            const bases = [
                { coords: gameState.player.coords, type: 'player', color: 'blue' },
                { coords: gameState.players.find(p => p.id === 'ally')?.coords, type: 'ally', color: 'green' },
                { coords: gameState.players.find(p => p.id === 'enemy')?.coords, type: 'enemy', color: 'red' }
            ];
            bases.forEach(base => {
                if (base.coords && Array.isArray(base.coords) && base.coords.length === 2) {
                    const [x, y] = base.coords;
                    ctx.drawImage(baseImage, x * cellSize - 25, y * cellSize - 25, 50, 50);
                    ctx.strokeStyle = base.color;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x * cellSize - 25, y * cellSize - 25, 50, 50);
                    console.log(`Drew base at (${x}, ${y}) with ${base.color} border`);
                } else {
                    console.warn(`Invalid coords for base:`, base);
                }
            });
        };
        baseImage.onerror = () => console.error('Failed to load base image');
    }
}
