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
        const filterAll = document.getElementById('filter-all');
        const filterAllies = document.getElementById('filter-allies');
        const filterEnemies = document.getElementById('filter-enemies');

        const gridSize = 20; // 20x20 grid
        const cellSize = 50; // Each cell is 50x50px
        const mapWidth = gridSize * cellSize; // 1000px
        const mapHeight = gridSize * cellSize; // 1000px
        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        let startX, startY;
        let visiblePlayers = 'all';

        if (!gameState.player.coords) {
            gameState.player.coords = { x: 10, y: 10 }; // Center of 20x20 grid
            console.log('Assigned player coords:', gameState.player.coords);
        }

        if (!gameState.players || gameState.players.length < 3) {
            gameState.players = [
                { name: gameState.player.nickname || 'Jucător', points: 1000, x: 10, y: 10, resources: { metal: 5000, crystal: 3000 }, type: 'player', techLevel: 1, fleetSize: 50 },
                { name: 'Aliat 1', points: 800, x: 12, y: 11, resources: { metal: 4000, crystal: 2000 }, type: 'ally', techLevel: 1, fleetSize: 20 },
                { name: 'Inamic 1', points: 1200, x: 8, y: 9, resources: { metal: 6000, crystal: 3500 }, type: 'enemy', techLevel: 2, fleetSize: 30 }
            ];
            saveGame();
            console.log('Initialized 3 players:', gameState.players);
        }

        const bgImage = new Image();
        bgImage.src = 'https://i.postimg.cc/mrfgr13H/harta.jpg';
        bgImage.crossOrigin = 'anonymous';
        const baseImage = new Image();
        baseImage.src = 'https://i.postimg.cc/d1CWNMvH/baza-jucator.jpg';
        baseImage.crossOrigin = 'anonymous';

        bgImage.onload = () => {
            console.log('Background image loaded');
            drawMap();
        };
        bgImage.onerror = () => {
            console.error('Failed to load background image');
            drawMap(true);
        };
        baseImage.onload = () => {
            console.log('Base image loaded');
            drawMap();
        };

        function clamp(value, min, max) {
            return Math.max(min, Math.min(value, max));
        }

        function drawMap(fallback = false) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            // Limit offsets to keep map in view
            const scaledWidth = mapWidth * scale;
            const scaledHeight = mapHeight * scale;
            offsetX = clamp(offsetX, -scaledWidth / 2, scaledWidth / 2);
            offsetY = clamp(offsetY, -scaledHeight / 2, scaledHeight / 2);

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-mapWidth / 2 + offsetX / scale, -mapHeight / 2 + offsetY / scale);

            // Draw background
            if (!fallback && bgImage.complete && bgImage.naturalWidth !== 0) {
                const bgScale = Math.max(mapWidth / bgImage.width, mapHeight / bgImage.height);
                const bgWidth = bgImage.width * bgScale;
                const bgHeight = bgImage.height * bgScale;
                ctx.drawImage(bgImage, -bgWidth / 2 + mapWidth / 2, -bgHeight / 2 + mapHeight / 2, bgWidth, bgHeight);
                console.log('Background drawn, size:', bgWidth, bgHeight);
            } else {
                ctx.fillStyle = '#2A2A2A';
                ctx.fillRect(0, 0, mapWidth, mapHeight);
                console.log('Fallback background drawn');
            }

            // Draw grid
            ctx.strokeStyle = '#6E6E6E';
            ctx.lineWidth = 1 / scale;
            for (let x = 0; x <= gridSize; x++) {
                ctx.beginPath();
                ctx.moveTo(x * cellSize, 0);
                ctx.lineTo(x * cellSize, mapHeight);
                ctx.stroke();
            }
            for (let y = 0; y <= gridSize; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * cellSize);
                ctx.lineTo(mapWidth, y * cellSize);
                ctx.stroke();
            }

            // Draw player bases
            gameState.players.forEach(player => {
                if (visiblePlayers === 'all' || visiblePlayers === player.type || (player.type === 'player' && visiblePlayers !== 'enemy')) {
                    const x = player.x * cellSize;
                    const y = player.y * cellSize;

                    // Draw base image
                    if (baseImage.complete && baseImage.naturalWidth !== 0) {
                        ctx.drawImage(baseImage, x + 5, y + 5, cellSize - 10, cellSize - 10);
                    }

                    // Draw border
                    ctx.strokeStyle = player.type === 'player' ? '#00BFFF' : player.type === 'ally' ? '#00FF00' : '#FF0000';
                    ctx.lineWidth = 3 / scale;
                    ctx.strokeRect(x, y, cellSize, cellSize);

                    // Draw player name
                    ctx.fillStyle = '#B0B0B0';
                    ctx.font = `${12 / scale}px Orbitron`;
                    ctx.textAlign = 'center';
                    ctx.fillText(player.name, x + cellSize / 2, y + cellSize + 15 / scale);
                    console.log(`Drew base for ${player.name} at (${player.x}, ${player.y}) with ${ctx.strokeStyle} border`);
                }
            });

            ctx.restore();

            // Draw mini-map
            ctx.fillStyle = 'rgba(42, 42, 42, 0.8)';
            ctx.fillRect(canvas.width - 120, canvas.height - 120, 120, 120);
            gameState.players.forEach(player => {
                if (visiblePlayers === 'all' || visiblePlayers === player.type || (player.type === 'player' && visiblePlayers !== 'enemy')) {
                    ctx.fillStyle = player.type === 'player' ? '#00BFFF' : player.type === 'ally' ? '#00FF00' : '#FF0000';
                    ctx.fillRect(canvas.width - 120 + player.x * 6, canvas.height - 120 + player.y * 6, 5, 5);
                }
            });
        }

        if (tooltip && contextMenu && attackBtn && spyBtn && filterAll && filterAllies && filterEnemies) {
            canvas.addEventListener('mousemove', e => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - canvas.width / 2) / scale + mapWidth / 2 - offsetX / scale;
                const mouseY = (e.clientY - rect.top - canvas.height / 2) / scale + mapHeight / 2 - offsetY / scale;
                let foundPlayer = null;

                gameState.players.forEach(player => {
                    if (visiblePlayers === 'all' || visiblePlayers === player.type || (player.type === 'player' && visiblePlayers !== 'enemy')) {
                        const x = player.x * cellSize;
                        const y = player.y * cellSize;
                        if (mouseX >= x && mouseX < x + cellSize && mouseY >= y && mouseY < y + cellSize) {
                            foundPlayer = player;
                        }
                    }
                });

                if (foundPlayer) {
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${e.clientX + 10}px`;
                    tooltip.style.top = `${e.clientY + 10}px`;
                    tooltip.innerHTML = `Jucător: ${foundPlayer.name}<br>Puncte: ${foundPlayer.points}<br>Coordonate: (${foundPlayer.x}, ${foundPlayer.y})<br>Resurse estimate: ${foundPlayer.resources.metal} Metal, ${foundPlayer.resources.crystal} Cristal<br>Status: ${foundPlayer.type === 'player' ? 'Jucător' : foundPlayer.type === 'ally' ? 'Aliat' : 'Inamic'}<br>Nivel tehnologic: ${foundPlayer.techLevel}<br>Flotă estimată: ${foundPlayer.fleetSize} nave`;
                } else {
                    tooltip.style.display = 'none';
                }
            });

            canvas.addEventListener('mousedown', e => {
                if (e.button === 0) {
                    isDragging = true;
                    startX = e.clientX - offsetX;
                    startY = e.clientY - offsetY;
                }
            });

            canvas.addEventListener('mousemove', e => {
                if (isDragging) {
                    offsetX = e.clientX - startX;
                    offsetY = e.clientY - startY;
                    drawMap();
                }
            });

            canvas.addEventListener('mouseup', () => {
                isDragging = false;
            });

            canvas.addEventListener('wheel', e => {
                e.preventDefault();
                const zoomSpeed = 0.1;
                const oldScale = scale;
                scale *= e.deltaY > 0 ? 1 - zoomSpeed : 1 + zoomSpeed;
                scale = Math.max(0.3, Math.min(scale, 3));

                const rect = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - canvas.width / 2) / oldScale + mapWidth / 2 - offsetX / oldScale;
                const mouseY = (e.clientY - rect.top - canvas.height / 2) / oldScale + mapHeight / 2 - offsetY / oldScale;

                offsetX = ((e.clientX - rect.left - canvas.width / 2) / scale + mapWidth / 2 - mouseX) * scale;
                offsetY = ((e.clientY - rect.top - canvas.height / 2) / scale + mapHeight / 2 - mouseY) * scale;

                drawMap();
            });

            canvas.addEventListener('click', e => {
                contextMenu.style.display = 'none';
                const rect = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - canvas.width / 2) / scale + mapWidth / 2 - offsetX / scale;
                const mouseY = (e.clientY - rect.top - canvas.height / 2) / scale + mapHeight / 2 - offsetY / scale;

                const player = gameState.players.find(p => {
                    if (visiblePlayers === 'all' || visiblePlayers === p.type || (p.type === 'player' && visiblePlayers !== 'enemy')) {
                        const x = p.x * cellSize;
                        const y = p.y * cellSize;
                        return mouseX >= x && mouseX < x + cellSize && mouseY >= y && mouseY < y + cellSize;
                    }
                    return false;
                });

                if (player && player.type !== 'player') {
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `${e.clientX}px`;
                    contextMenu.style.top = `${e.clientY}px`;
                    attackBtn.onclick = () => {
                        showMessage(`Atac către ${player.name} la (${player.x}, ${player.y})`, 'info');
                        console.log(`Attack initiated on ${player.name} at (${player.x}, ${player.y})`);
                        contextMenu.style.display = 'none';
                    };
                    spyBtn.onclick = () => {
                        showMessage(`Spionaj către ${player.name} la (${player.x}, ${player.y})`, 'info');
                        console.log(`Spy mission initiated on ${player.name} at (${player.x}, ${player.y})`);
                        contextMenu.style.display = 'none';
                    };
                }
            });

            filterAll.addEventListener('click', () => {
                visiblePlayers = 'all';
                drawMap();
                console.log('Filter set to all');
            });

            filterAllies.addEventListener('click', () => {
                visiblePlayers = 'ally';
                drawMap();
                console.log('Filter set to allies');
            });

            filterEnemies.addEventListener('click', () => {
                visiblePlayers = 'enemy';
                drawMap();
                console.log('Filter set to enemies');
            });

            document.addEventListener('click', e => {
                if (!contextMenu.contains(e.target) && e.target !== canvas) {
                    contextMenu.style.display = 'none';
                }
            });
            console.log('Event listeners added');
        } else {
            console.error('Tooltip, context menu, or filter elements not found');
        }

        function animate() {
            drawMap();
            requestAnimationFrame(animate);
        }
        animate();
    };

    attemptInit();
}
