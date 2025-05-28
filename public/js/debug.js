document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        console.log('Sidebar found:', sidebar);
        console.log('Sidebar styles:', window.getComputedStyle(sidebar));
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                console.log('Sidebar modified:', mutation);
            });
        });
        observer.observe(sidebar, { attributes: true, childList: true, subtree: true });
    } else {
        console.error('Sidebar not found!');
    }
});
