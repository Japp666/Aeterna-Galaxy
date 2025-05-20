#buildingsTab {
  display: grid; /* Schimbăm în grid layout */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Coloane responsive */
  gap: 1rem;
  padding: 1rem;
  align-items: start; /* Aliniere la începutul celulei */
}

.building-category {
  border: 2px solid #0ff;
  border-radius: 10px;
  padding: 1rem;
  background-color: #111;
}

.building-category h3 {
  color: #0ff;
  margin-bottom: 1rem;
  text-align: center;
}

.building-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.building-card {
  background-color: #222;
  border: 1px solid #0ff;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  color: #0ff;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.building-card.locked {
  opacity: 0.5;
  pointer-events: none;
  position: relative;
}

.building-card.locked::after {
  content: 'Necesită: ' attr(data-requirements);
  color: #ff4444;
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 10px;
  right: 10px;
}

.progress-container {
  background-color: #333;
  border: 1px solid #0ff;
  height: 20px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  width: 100%; /* Ocupă toată lățimea cărții */
}

.progress-bar {
  background-color: #0ff;
  height: 100%;
  width: 0%;
  transition: width 0.3s linear;
}

.progress-text {
  color: black;
  font-weight: bold;
  position: absolute;
  width: 100%;
  text-align: center;
  top: 0;
  line-height: 20px;
}
