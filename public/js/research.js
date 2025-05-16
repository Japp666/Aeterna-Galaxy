#researchTab {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.building-category {
  background-color: rgba(25, 25, 40, 0.9);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.2);
}

.building-category h3 {
  color: #00ffff;
  border-bottom: 1px solid #00ffff55;
  margin-bottom: 10px;
  font-size: 18px;
}

.building-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.building-card {
  background-color: #1a1a2a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 12px;
  width: 220px;
  color: #fff;
  position: relative;
  transition: transform 0.3s ease;
}

.building-card:hover {
  transform: scale(1.02);
}

.building-card.locked {
  background-color: #2b2b2b;
  opacity: 0.5;
}

.building-card.locked::after {
  content: attr(data-requirements);
  color: #ff6666;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
}

.building-card h4 {
  color: #00ccff;
  margin: 0 0 6px 0;
}

.building-card p {
  margin: 4px 0;
  font-size: 14px;
}

.progress-bar {
  background-color: #333;
  border: 1px solid #555;
  border-radius: 6px;
  height: 20px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill {
  background-color: #00ffcc;
  height: 100%;
  width: 0%;
  transition: width 0.5s ease;
}

.progress-timer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: black;
  font-size: 13px;
  font-weight: bold;
  line-height: 20px;
}
