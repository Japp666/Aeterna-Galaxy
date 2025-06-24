// js/drag-drop-manager.js - Modul pentru gestionarea drag-and-drop-ului

let currentDraggedPlayerId = null;

/**
 * Setează event listeneri pentru drag-and-drop pe sloturile de pe teren și pe rândurile tabelului de jucători.
 * @param {Function} onDropCallback - Funcție de apelat când un jucător este mutat.
 */
export function setupDragDropListeners(onDropCallback) {
    const pitch = document.getElementById('football-pitch');
    const rosterContainer = document.querySelector('.roster-table-container');

    if (!pitch || !rosterContainer) {
        console.error("Elementele pitch sau roster container nu au fost găsite pentru drag-drop-manager.");
        return;
    }

    // Setăm listeneri pentru sloturile de pe teren
    const allSlots = pitch.querySelectorAll('.player-slot');
    allSlots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');

            const playerIdToMove = e.dataTransfer.getData('text/plain');
            const targetSlotId = slot.dataset.slotId;
            const targetPositionType = slot.dataset.positionType;

            onDropCallback(playerIdToMove, targetSlotId, targetPositionType);
        });
    });

    // Setăm listeneri pentru roster container (pentru a trimite jucători de pe teren în bancă)
    rosterContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        rosterContainer.classList.add('drag-over');
    });

    rosterContainer.addEventListener('dragleave', () => {
        rosterContainer.classList.remove('drag-over');
    });

    rosterContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        rosterContainer.classList.remove('drag-over');

        const playerIdToMove = e.dataTransfer.getData('text/plain');
        onDropCallback(playerIdToMove, null, null); // Mută în bancă (slot=null)
    });

    // Setăm listeneri pentru player card-urile de pe teren (pentru drag-start)
    // Acestea sunt create dinamic, deci trebuie să folosim delegare de evenimente
    pitch.addEventListener('dragstart', (e) => {
        const targetCard = e.target.closest('.player-card.on-pitch');
        if (targetCard) {
            currentDraggedPlayerId = targetCard.dataset.playerId;
            e.dataTransfer.setData('text/plain', currentDraggedPlayerId);
            targetCard.classList.add('dragging');
            // Creează și setează o imagine fantomă pentru drag
            const ghostElement = targetCard.cloneNode(true);
            ghostElement.classList.add('dragging-ghost');
            ghostElement.style.position = 'absolute';
            ghostElement.style.top = '-1000px';
            document.body.appendChild(ghostElement);
            e.dataTransfer.setDragImage(ghostElement, e.offsetX, e.offsetY);
        }
    });

    pitch.addEventListener('dragend', (e) => {
        const targetCard = e.target.closest('.player-card.on-pitch');
        if (targetCard) {
            targetCard.classList.remove('dragging');
            const ghostElement = document.querySelector('.player-card.dragging-ghost');
            if (ghostElement) {
                ghostElement.remove();
            }
        }
    });

    // Setăm listeneri pentru rândurile tabelului (pentru drag-start)
    rosterContainer.addEventListener('dragstart', (e) => {
        const targetRow = e.target.closest('.roster-table-row');
        if (targetRow) {
            currentDraggedPlayerId = targetRow.dataset.playerId;
            e.dataTransfer.setData('text/plain', currentDraggedPlayerId);
            targetRow.classList.add('dragging');
            // Creează și setează o imagine fantomă pentru drag
            const ghostElement = targetRow.cloneNode(true);
            ghostElement.classList.add('dragging-ghost');
            ghostElement.style.width = targetRow.offsetWidth + 'px';
            ghostElement.style.position = 'absolute';
            ghostElement.style.top = '-1000px';
            document.body.appendChild(ghostElement);
            e.dataTransfer.setDragImage(ghostElement, e.offsetX, e.offsetY);
        }
    });

    rosterContainer.addEventListener('dragend', (e) => {
        const targetRow = e.target.closest('.roster-table-row');
        if (targetRow) {
            targetRow.classList.remove('dragging');
            const ghostElement = document.querySelector('.roster-table-row.dragging-ghost');
            if (ghostElement) {
                ghostElement.remove();
            }
        }
    });
}
