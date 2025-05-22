// public/js/fleet.js
export function initFleetPage() {
    console.log("Fleet page initialized.");
    // Logica pentru pagina de flotă (afișare nave, construcție, misiune)
    const content = document.getElementById('main-content');
    if (content) {
        content.innerHTML = `
            <h2>Flotă Spațială</h2>
            <p>Aici vei gestiona navele tale.</p>
            <div class="fleet-list">
                <p>Navele tale:</p>
                <ul>
                    <li>Interceptor (x5)</li>
                    <li>Transportator (x2)</li>
                </ul>
            </div>
            <button>Construiește Navă</button>
            <button>Trimite Flota</button>
        `;
    }
}
