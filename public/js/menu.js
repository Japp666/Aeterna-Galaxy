export function showMenu() {
    const menuContainer = document.getElementById('menu');
    if (!menuContainer) {
        console.error("Elementul #menu nu a fost găsit.");
        return;
    }

    menuContainer.innerHTML = `
        <div class="menu-bar">
            <button onclick="switchTab('buildings')">Clădiri</button>
            <button onclick="switchTab('research')">Cercetare</button>
            <button onclick="switchTab('map')">Harta</button>
            <button onclick="switchTab('fleet')">Flotă</button>
            <button onclick="switchTab('shipyard')">Construcție Nave</button>
        </div>
    `;
}

export function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.add('hidden'));

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.remove('hidden');
    } else {
        console.error(`Tab-ul ${tabId} nu a fost găsit.`);
    }
}
