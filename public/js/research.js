console.log('research.js loaded');

function initializeResearch() {
    console.log('initializeResearch called');
    const researchList = document.getElementById('research-list');
    if (!researchList) {
        console.error('Research list not found');
        return;
    }
    researchList.innerHTML = '<li>No research lab available</li>';
    console.log('Research initialized');
}
