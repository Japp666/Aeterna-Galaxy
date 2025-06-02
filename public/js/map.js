console.log('map.js loaded');

function initializeMap() {
    console.log('Map initialization started');
    let attempts = 0;
    const maxAttempts = 10;
    const attemptInit = () => {
        attempts++;
        console.log(`Attempt ${attempts} to initialize map`);
        const canvas = document.getElementById('planetMap');
        if (!canvas) {
            if (attempts < maxAttempts) {
                console.warn('Canvas #planetMap not found, retrying in 100ms...');
                setTimeout(attemptInit, 100);
            } else {
                console.error('Canvas #planetMap not found after max attempts');
            }
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }
        console.log('Canvas and context initialized');
        const tooltip = document.getElementById('tooltip');
        const contextMenu = document.getElementById('contextMenu');
        const attackBtn = document.getElementById('attackBtn');
        const spyBtn = document.getElementById('spyBtn');

        const gridWidth = 20;
        const gridHeight = 10;
        const cellWidth = canvas.width / gridWidth;
        const cellHeight = canvas.height / gridHeight;

        if (!gameState.player.coords) {
            gameState.player.coords = { x: 5, y: 5 };
            console.log('Assigned player coords:', gameState.player.coords);
        }

        if (!gameState.players || gameState.players.length === 0) {
            gameState.players = [
                { name: gameState.player.nickname || 'Jucător', points: 1000, x: gameState.player.coords.x, y: gameState.player.coords.y },
                { name: 'Inamic 1', points: 800, x: 10, y: 3 },
                { name: 'Inamic 2', points: 1200, x: 15, y: 7 }
            ];
            saveGame();
            console.log('Initialized 3 players:', gameState.players);
        }

        const bgImage = new Image();
        bgImage.src = 'https://i.postimg.cc/mrfgr13H/harta.jpg';
        bgImage.crossOrigin = 'anonymous';
        bgImage.onload = () => {
            console.log('Background image loaded');
            drawMap();
        };
        bgImage.onerror = () => {
            console.error('Failed to load background image');
            drawMap(true);
        };

        function drawMap(fallback = false) {
            console.log('Drawing map');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!fallback && bgImage.complete && bgImage.naturalWidth !== 0) {
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
                console.log('Background image drawn');
            } else {
                ctx.fillStyle = '#2A2A2A';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                console.log('Fallback background drawn');
            }

            gameState.players.forEach(player => {
                ctx.strokeStyle = player.name === (gameState.player.nickname || 'Jucător') ? '#00BFFF' : '#FF0000';
                ctx.lineWidth = 2;
                ctx.strokeRect(player.x * cellWidth, player.y * cellHeight, cellWidth, cellHeight);
                ctx.fillStyle = 'rgba(30, 58, 95, 0.5)';
                ctx.fillRect(player.x * cellWidth + 2, player.y * cellHeight + 2, cellWidth - 4, cellHeight - 4);
                ctx.fillStyle = '#B0B0B0';
                ctx.font = '12px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText(player.name, player.x * cellWidth + cellWidth / 2, player.y * cellHeight + cellHeight / 2);
            });
            console.log('Players drawn with borders');
        }

        if (tooltip && contextMenu && attackBtn && spyBtn) {
            canvas.addEventListener('mousemove', e => {
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

            canvas.addEventListener('click', e => {
                contextMenu.style.display = 'none';
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const gridX = Math.floor(mouseX / cellWidth);
                const gridY = Math.floor(mouseY / cellHeight);

                const player = gameState.players.find(p => p.x === gridX && p.y === gridY);
                if (player && player.name !== (gameState.player.nickname || 'Jucător')) {
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

            document.addEventListener('click', e => {
                if (!contextMenu.contains(e.target) && e.target !== canvas) {
                    contextMenu.style.display = 'none';
                }
            });
            console.log('Event listeners added');
        } else {
            console.error('Tooltip or context menu elements not found');
        }

        drawMap();
    };

    attemptInit();
}
