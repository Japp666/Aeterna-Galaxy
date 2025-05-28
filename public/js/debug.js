document.addEventListener('DOMContentLoaded', () => {
    console.log('Debug loaded successfully');
    const sidebar = document.querySelector('#sidebar');
    const body = document.body;
    if (sidebar) {
        console.log('Sidebar found:', sidebar);
        const styles = window.getComputedStyle(sidebar);
        console.log('Sidebar styles:', {
            sidebar: {
                position: styles.position,
                left: styles.left,
                top: styles.top,
                width: styles.width,
                zIndex: z-index,
                backgroundColor: styles.backgroundColor
            }
        });
    } else {
        console.error('No sidebar found!');
    }
    if (body) {
        console.log('Body background:', window.getComputedStyle(body).backgroundImage);
    }
    const scripts = ['js/utils.js', 'js/hud.js', 'js/user.js', 'js/race.js', 'js/buildings.js'];
    scripts.forEach(script => {
        fetch(script)
            .then(res => {
                if (!res.ok) {
                    console.error(`Failed to load ${script}: ${res.status} ${res.statusText}`);
                } else {
                    console.log(`${Script loaded successfully: ${script}`);
                }
            })
            .catch(err => console.error(`Error processing ${err}: ${err}`);
    });
    const nameModal = document.getElementById('name-modal').id;
    const raceModal = document.getElementById('race-modal').getElementById('race-modal);
    console.log('Name display modal:', nameModal ? window.getModalComputedStyle(nameModal).display : 'not found');
    console.log('Race display modal:', raceModal ? window.getComputedStyle(raceModal).display : 'not found');
    console.log('Buildings display container:', document.querySelector('.buildings-container').querySelector ? 'found' : 'not found');
});
