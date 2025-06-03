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

        const hexRadius = 30;
        const hexWidth = Math.sqrt(3) * hexRadius;
        const hexHeight = 2 * hexRadius;
        let scale = 1;
        let offsetX = canvas.width / 2;
        let offsetY = canvas.height / 2;
        let isDragging = false;
        let startX, startY;
        let visiblePlayers = 'all';

        if (!gameState.player.coords) {
            gameState.player.coords = { x: 0, y: 0 };
            console.log('Assigned player coords:', gameState.player.coords);
        }

        if (!gameState.players || gameState.players.length === 0) {
            gameState.players = [
                { name: gameState.player.nickname || 'Jucător', points: 1000, x: 0, y: 0, resources: { metal: 5000, crystal: 3000 }, type: 'ally', techLevel: 1, fleetSize: 10 },
                { name: 'Inamic 1', points: 800, x: 2, y: 1, resources: { metal: 4000, crystal: 2000 }, type: 'enemy', techLevel: 1, fleetSize: 8 },
                { name: 'Inamic 2', points: 1200, x: -1, y: -2, resources: { metal: 6000, crystal: 3500 }, type: 'enemy', techLevel: 2, fleetSize: 15 }
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

        function getHexCorners(cx, cy) {
            const corners = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                corners.push({
                    x: cx + hexRadius * Math.cos(angle),
                    y: cy + hexRadius * Math.sin(angle)
                });
            }
            return corners;
        }

        function drawMap(fallback = false) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);

            if (!fallback && bgImage.complete && bgImage.naturalWidth !== 0) {
                ctx.drawImage(bgImage, -canvas.width / (2 * scale), -canvas.height / (2 * scale), canvas.width / scale, canvas.height / scale);
                console.log('Background image drawn');
            } else {
                ctx.fillStyle = '#2A2A2A';
                ctx.fillRect(-canvas.width / (2 * scale), -canvas.height / (2 * scale), canvas.width / scale, canvas.height / scale);
                console.log('Fallback background drawn');
            }

            const clusters = {};
            const zoomThreshold = 0.5;
            gameState.players.forEach(player => {
                if (visiblePlayers === 'all' || visiblePlayers === player.type) {
                    const cx = player.x * hexWidth + (player.y % 2 === 0 ? 0 : hexWidth / 2);
                    const cy = player.y * (hexHeight * 3 / 4);
                    if (scale < zoomThreshold) {
                        const clusterKey = `${Math.round(cx / 100)}:${Math.round(cy / 100)}`;
                        clusters[clusterKey] = clusters[clusterKey] || [];
                        clusters[clusterKey].push(player);
                    } else {
                        drawHexPlanet(cx, cy, player);
                    }
                }
            });

            if (scale < zoomThreshold) {
                Object.values(clusters).forEach(cluster => {
                    if (cluster.length > 1) {
                        const avgX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
                        const avgY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
                        const cx = avgX * hexWidth + (avgY % 2 === 0 ? 0 : hexWidth / 2);
                        const cy = avgY * (hexHeight * 3 / 4);
                        drawCluster(cx, cy, cluster.length);
                    } else {
                        const player = cluster[0];
                        const cx = player.x * hexWidth + (player.y % 2 === 0 ? 0 : hexWidth / 2);
                        const cy = player.y * (hexHeight * 3 / 4);
                        drawHexPlanet(cx, cy, player);
                    }
                });
            }

            ctx.restore();

            // Draw mini-map
            ctx.fillStyle = 'rgba(42, 42, 42, 0.8)';
            ctx.fillRect(canvas.width - 100, canvas.height - 100, 100, 100);
            gameState.players.forEach(player => {
                if (visiblePlayers === 'all' || visiblePlayers === player.type) {
                    const isCurrentPlayer = player.x === gameState.player.coords.x && player.y === gameState.player.coords.y;
                    ctx.fillStyle = isCurrentPlayer ? '#00BFFF' : player.type === 'ally' ? '#00FF00' : '#FF0000';
                    ctx.fillRect(canvas.width - 100 + (player.x + 10) * 5, canvas.height - 100 + (player.y + 5) * 5, 5, 5);
                }
            });
        }

        function drawHexPlanet(cx, cy, player) {
            const isCurrentPlayer = player.x === gameState.player.coords.x && player.y === gameState.player.coords.y;
            const pulse = Math.sin(Date.now() * 0.002) * 5;
            const corners = getHexCorners(cx, cy);

            ctx.beginPath();
            corners.forEach((corner, i) => {
                if (i === 0) ctx.moveTo(corner.x, corner.y);
                else ctx.lineTo(corner.x, corner.y);
            });
            ctx.closePath();
            ctx.fillStyle = isCurrentPlayer ? 'rgba(0, 191, 255, 0.3)' : player.type === 'ally' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
            ctx.fill();
            ctx.strokeStyle = isCurrentPlayer ? '#00BFFF' : player.type === 'ally' ? '#00FF00' : '#FF0000';
            ctx.lineWidth = 2 / scale;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, (hexRadius / 2) + pulse, 0, Math.PI * 2);
            ctx.fillStyle = isCurrentPlayer ? '#00BFFF' : player.type === 'ally' ? '#00FF00' : '#FF0000';
            ctx.fill();

            ctx.fillStyle = '#B0B0B0';
            ctx.font = `${12 / scale}px Orbitron`;
            ctx.textAlign = 'center';
            ctx.fillText(player.name, cx, cy + 20 / scale);
            console.log(`Drew hex planet for ${player.name} at (${player.x}, ${player.y}) with ${isCurrentPlayer ? 'blue' : player.type === 'ally' ? 'green' : 'red'} border`);
        }

        function drawCluster(cx, cy, count) {
            ctx.beginPath();
            ctx.arc(cx, cy, hexRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#B0B0B0';
            ctx.lineWidth = 2 / scale;
            ctx.stroke();

            ctx.fillStyle = '#B0B0B0';
            ctx.font = `${12 / scale}px Orbitron`;
            ctx.textAlign = 'center';
            ctx.fillText(`${count} sisteme`, cx, cy + 10 / scale);
        }

        if (tooltip && contextMenu && attackBtn && spyBtn && filterAll && filterAllies && filterEnemies) {
            canvas.addEventListener('mousemove', e => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - offsetX) / scale;
                const mouseY = (e.clientY - rect.top - offsetY) / scale;
                let foundPlayer = null;

                gameState.players.forEach(player => {
                    if (visiblePlayers === 'all' || visiblePlayers === player.type) {
                        const cx = player.x * hexWidth + (player.y % 2 === 0 ? 0 : hexWidth / 2);
                        const cy = player.y * (hexHeight * 3 / 4);
                        const dx = mouseX - cx;
                        const dy = mouseY - cy;
                        if (Math.sqrt(dx * dx + dy * dy) < hexRadius) {
                            foundPlayer = player;
                        }
                    }
                });

                if (foundPlayer && scale >= 0.5) {
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${e.clientX + 10}px`;
                    tooltip.style.top = `${e.clientY + 10}px`;
                    tooltip.innerHTML = `Jucător: ${foundPlayer.name}<br>Puncte: ${foundPlayer.points}<br>Coordonate: (${foundPlayer.x}, ${foundPlayer.y})<br>Resurse estimate: ${foundPlayer.resources.metal} Metal, ${foundPlayer.resources.crystal} Cristal<br>Status: ${foundPlayer.type === 'ally' ? 'Aliat' : 'Inamic'}<br>Nivel tehnologic: ${foundPlayer.techLevel}<br>Flotă estimată: ${foundPlayer.fleetSize} nave`;
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
                scale = Math.max(0.3, Math.min(scale, 5));

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

                const player = gameState.players.find(p => {
                    if (visiblePlayers === 'all' || visiblePlayers === p.type) {
                        const cx = p.x * hexWidth + (p.y % 2 === 0 ? 0 : hexWidth / 2);
                        const cy = p.y * (hexHeight * 3 / 4);
                        const dx = mouseX - cx;
                        const dy = mouseY - cy;
                        return Math.sqrt(dx * dx + dy * dy) < hexRadius;
                    }
                    return false;
                });

                if (player && (player.x !== gameState.player.coords.x || player.y !== gameState.player.coords.y)) {
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
