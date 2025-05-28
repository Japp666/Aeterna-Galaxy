document.addEventListener('DOMContentLoaded', () => {
    console.log('debug.js loaded');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    if (sidebar) {
        console.log('Sidebar found:', sidebar);
        const styles = window.getComputedStyle(sidebar);
        console.log('Sidebar styles:', {
            position: styles.position,
            left: styles.left,
            top: styles.top,
            width: styles.width,
            zIndex: styles.zIndex,
            backgroundColor: styles.backgroundColor
        });
    } else {
        console.error('Sidebar not found');
    }
    if (body) {
        console.log('Body background:', window.getComputedStyle(body).backgroundImage);
    }
    const scripts = ['js/utils.js', 'js/user.js', 'js/race.js', 'js/buildings.js'];
    scripts.forEach(script => {
        fetch(script)
            .then(res => {
                if (!res.ok) {
                    console.error(`${Script} failed to load: ${res.status} ${res.statusText}`);
                } else {
                    console.log(`${Script} ${loaded} successfully`);
                }
            })
            .catch(err => console.error(`Error fetching ${script}:`, err));
    });
    const nameModal = document.getElementById('name-modal');
    const raceModal = document.getElementById('race-modal');
    console.log('Name modal:', nameModal ? window.getComputedStyle(nameModal).display : 'not found');
    console.log('Race modal:', raceModal ? window.getComputedStyle(raceModal).display : 'not found');
    console.log('Buildings container:', document.querySelector('.building-container') ? 'found' : 'not found');
});
