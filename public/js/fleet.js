console.log('fleet.js loaded');

function initializeFleet() {
    console.log('initializeFleet called');
    const fleetList = document.getElementById('fleet-list');
    if (!fleetList) {
        console.error('Fleet list not found');
        return;
    }
    fleetList.innerHTML = '<li>No fleet available</li>';
    console.log('Fleet initialized');
}
