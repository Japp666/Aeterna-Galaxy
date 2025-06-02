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
        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        let startX, startY;

        if (!gameState.player.coords) {
            gameState.player.coords = { x: 5, y: 5 };
            console.log('Assigned player coords:', gameState.player.coords);
        }

        if (!gameState.players || gameState.players.length === 0) {
            gameState.players = [
                { name: gameState.player.nickname || 'Jucător', points: 1000, x: gameState.player.coords.x, y: gameState.player.coords.y, resources: { metal: 5000, crystal: 3000 }, type: 'ally' },
                { name: 'Inamic 1', points: 800, x: 10, y: 3, resources: { metal: 4000, crystal: 2000 }, type: 'enemy' },
                { name: 'Inamic 2', points: 1200, x: 15, y: 7, resources: { metal: 6000, crystal: 3500 }, type: 'enemy' }
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);

            if (!fallback && bgImage.complete && bgImage.naturalWidth !== 0) {
                ctx.drawImage(bgImage, 0, 0, canvas.width / scale, canvas.height / scale);
                console.log('Background image drawn');
            } else {
                ctx.fillStyle = '#2A2A2A';
                ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);
                console.log('Fallback background drawn');
            }

            gameState.players.forEach(player => {
                const isCurrentPlayer = player.x === gameState.player.coords.x && player.y === gameState.player.coords.y;
                const radius = cellWidth / 2;
                const pulse = Math.sin(Date.now() * 0.002) * 5 + radius;

                ctx.beginPath();
                ctx.arc(player.x * cellWidth + radius, player.y * cellHeight + radius, pulse, 0, Math.PI * 2);
                ctx.fillStyle = isCurrentPlayer ? 'rgba(0, 191, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                ctx.fill();
                ctx.strokeStyle = isCurrentPlayer ? '#00BFFF' : '#FF0000';
                ctx.lineWidth = 2 / scale;
                ctx.stroke();

                ctx.fillStyle = isCurrentPlayer ? '#00BFFF' : '#FF0000';
                ctx.beginPath();
                ctx.arc(player.x * cellWidth + radius, player.y * cellHeight + radius, radius / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#B0B0B0';
                ctx.font = `${12 / scale}px Orbitron`;
                ctx.textAlign = 'center';
                ctx.fillText(player.name, player.x * cellWidth + radius, player.y * cellHeight + radius + 20 / scale);
                console.log(`Drew planet for ${player.name} at (${player.x}, ${player.y}) with ${isCurrentPlayer ? 'blue' : 'red'} border`);
            });

            ctx.restore();

            // Draw mini-map
            ctx.fillStyle = 'rgba(42, 42, 42, 0.8)';
            ctx.fillRect(canvas.width - 100, canvas.height - 100, 100, 100);
            gameState.players.forEach(player => {
                const isCurrentPlayer = player.x === gameState.player.coords.x && player.y === gameState.player.coords.y;
                ctx.fillStyle = isCurrentPlayer ? '#00BFFF' : '#FF0000';
                ctx.fillRect(canvas.width - 100 + player.x * 5, canvas.height - 100 + player.y * 5, 5, 5);
            });
        }

        if (tooltip && contextMenu && attackBtn && spyBtn) {
            canvas.addEventListener('mousemove', e => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - offsetX) / scale;
                const mouseY = (e.clientY - rect.top - offsetY) / scale;
                const gridX = Math.floor(mouseX / cellWidth);
                const gridY = Math.floor(mouseY / cellHeight);

                const player = gameState.players.find(p => p.x === gridX && p.y === gridY);
                if (player) {
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${e.clientX + 10}px`;
                    tooltip.style.top = `${e.clientY + 10}px`;
                    tooltip.innerHTML = `Jucător: ${player.name}<br>Puncte: ${player.points}<br>Coordonate: (${gridX}, ${gridY})<br>Resurse estimate: ${player.resources.metal} Metal, ${player.resources.crystal} Cristal<br>Status: ${player.type === 'ally' ? 'Aliat' : 'Inamic'}`;
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
                scale = Math.max(0.5, Math.min(scale, 3));

                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                offsetX = mouseX - (mouseX - offsetX) * (scale / oldScale);
                offsetY = mouseY - (mouseY - offsetY) * (scale / oldScale);

                drawMap();
            });

            canvas.addEventListener('click', e => {
                contextMenu.style.display = 'none';
                const rect = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - offsetX) / scale;
                const mouseY = (e.clientY - rect.top - offsetY) / scale;
                const gridX = Math.floor(mouseX / cellWidth);
                const gridY = Math.floor(mouseY / cellHeight);

                const player = gameState.players.find(p => p.x === gridX && p.y === gridY);
                if (player && (player.x !== gameState.player.coords.x || player.y !== gameState.player.coords.y)) {
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

        function animate() {
            drawMap();
            requestAnimationFrame(animate);
        }
        animate();
    };

    attemptInit();
}
