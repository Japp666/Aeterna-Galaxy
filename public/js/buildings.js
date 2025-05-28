console.log('buildings.js loaded successfully');
try {
    export function initializeBuildings() {
        console.log('Initializing buildings...');
        const buildingsContainer = document.querySelector('.buildings-container');
        if (buildingsContainer) {
            console.log('Buildings container found');
            // Placeholder pentru afișarea clădirilor
            buildingsContainer.innerHTML = '<p>Clădirile vor fi afișate aici.</p>';
        } else {
            console.error('Buildings container not found');
        }
    }
    initializeBuildings();
} catch (error) {
    console.error('Error in buildings.js:', error);
}
