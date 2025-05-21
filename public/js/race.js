/* css/race.css */

/* Stiluri pentru selecția rasei */
.race-selection {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Ajustat pentru 2 coloane */
    gap: 25px;
    margin-top: 20px;
    justify-content: center; /* Centrează cardurile dacă sunt mai puține */
    max-width: 500px; /* Limitează lățimea pentru aliniere */
    margin-left: auto;
    margin-right: auto;
}

.race-card {
    background-color: rgba(var(--bg-primary-dark-rgb), 0.7);
    border: 1px solid var(--ui-border-light);
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: flex; /* Folosim flexbox pentru aliniere verticală */
    flex-direction: column;
    justify-content: space-between; /* Distribuie spațiul uniform */
}

.race-card:hover:not(.coming-soon) { /* Nu aplica hover pe "Coming Soon" */
    transform: translateY(-5px);
    box-shadow: 0 0 20px var(--accent-cyan-glow);
    border-color: var(--accent-cyan);
}

.race-card.selected {
    background-color: var(--accent-cyan);
    color: var(--bg-primary-dark);
    border-color: var(--accent-cyan-glow);
    box-shadow: 0 0 30px var(--accent-cyan-glow);
    transform: scale(1.05);
}

/* Stiluri pentru cardul "Coming Soon" */
.race-card.coming-soon {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: rgba(var(--bg-primary-dark-rgb), 0.4);
    border-color: rgba(var(--ui-border-light-rgb), 0.2);
    box-shadow: none;
}

.race-card.coming-soon:hover {
    transform: none; /* Anulează transformarea la hover */
    box-shadow: none; /* Anulează umbra la hover */
}

.race-card img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin-bottom: 10px;
    filter: drop-shadow(0 0 5px var(--accent-cyan)); /* Efect subtil de strălucire pe imagini */
    margin-left: auto; /* Centrează imaginea */
    margin-right: auto;
}

.race-card.coming-soon img {
    filter: grayscale(100%) brightness(50%); /* Dezaturare și întunecare pentru "Coming Soon" */
}

.race-card h3 {
    margin: 0;
    font-size: 1.3em;
    color: inherit; /* Moștenește culoarea de la părinte */
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
}

.race-card p {
    font-size: 0.9em;
    color: inherit;
    line-height: 1.4;
    margin-top: 5px;
}
