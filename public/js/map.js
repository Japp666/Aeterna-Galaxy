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
        baseImage.src = 'https://i.postimg.cc/d1CWVMvH/baza-jucator.jpg';
        baseImage.onload = () => {
            const bases = [
                { coords: gameState.player.coords, type: 'player', color: 'blue' },
                { coords: [12, 8], type: 'ally', color: 'green' },
                { coords: [8, 12], type: 'enemy', color: 'red' }
            ];
            bases.forEach(base => {
                const [x, y] = base.coords;
                ctx.drawImage(baseImage, x * cellSize - 25, y * cellSize - 25, 50, 50);
                ctx.strokeStyle = base.color;
                ctx.lineWidth = 3;
                ctx.strokeRect(x * cellSize - 25, y * cellSize - 25, 50, 50);
                console.log(`Drew base at (${x}, ${y}) with ${base.color} border`);
            });
        };
    }
}
