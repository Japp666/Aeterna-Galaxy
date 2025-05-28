document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    if (sidebar) {
        console.log('Sidebar found:', sidebar);
        console.log('Sidebar computed styles:', window.getComputedStyle(sidebar));
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
    // Verifică încărcarea styles.css
    const stylesLink = document.querySelector('link[href="/css/styles.css"]');
    if (!stylesLink) {
        console.error('styles.css not loaded!');
    }
});
