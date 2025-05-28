document.addEventListener('DOMContentLoaded', () => {
    console.log('debug.js loaded');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    if (sidebar) {
        console.log('Sidebar found:', sidebar);
        console.log('Sidebar computed styles:', {
            position: window.getComputedStyle(sidebar).position,
            left: window.getComputedStyle(sidebar).left,
            top: window.getComputedStyle(sidebar).top,
            width: window.getComputedStyle(sidebar).width,
            zIndex: window.getComputedStyle(sidebar).zIndex
        });
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                console.log('Sidebar modified:', mutation);
            });
        });
        observer.observe(sidebar, { attributes: true, childList: true, subtree: true });
    } else {
        console.error('Sidebar not found!');
    }
    if (body) {
        console.log('Body background:', window.getComputedStyle(body).backgroundImage);
    }
    const stylesLink = document.querySelector('link[href="css/styles.css"]');
    if (!stylesLink) {
        console.error('styles.css not found in DOM!');
    } else {
        fetch('css/styles.css')
            .then(res => {
                if (!res.ok) {
                    console.error('styles.css failed to load:', res.status, res.statusText);
                } else {
                    console.log('styles.css loaded successfully');
                }
            })
            .catch(err => console.error('Error fetching styles.css:', err));
    }
    fetch('https://i.postimg.cc/d07m01yM/fundal-joc.png')
        .then(res => {
            if (!res.ok) {
                console.error('Background image failed to load:', res.status, res.statusText);
            } else {
                console.log('Background image loaded successfully');
            }
        })
        .catch(err => console.error('Error fetching background image:', err));
});
