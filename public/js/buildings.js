.buildings-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px;
}

.building-category {
    background-color: rgba(10, 15, 46, 0.9);
    padding: 12px;
    border-radius: 8px;
    border: 2px solid #00ccff;
}

.building-category h2 {
    color: #ff00ff;
    font-size: 20px;
    margin: 0 0 10px 0;
    text-align: center;
}

.category-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
}

.building-card {
    background-color: #0a0f2e;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #00ccff;
    width: 180px;
    text-align: center;
    box-shadow: 0 0 12px rgba(0, 204, 255, 0.3);
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    min-height: 280px;
    box-sizing: border-box;
}

.building-card:hover {
    transform: scale(1.05);
}

.building-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid #ff00ff;
    display: block;
    margin: 0 auto;
}

.building-card h3 {
    color: #00ccff;
    font-size: 16px;
    margin: 8px 0;
}

.building-card p {
    font-size: 12px;
    color: #ffffff;
    margin: 4px 0;
}

.build-button {
    background: linear-gradient(45deg, #ff00ff, #00ccff);
    border: none;
    color: #ffffff;
    padding: 6px;
    cursor: pointer;
    border-radius: 4px;
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    margin-top: auto;
    transition: background 0.3s, box-shadow 0.3s;
}

.build-button:hover {
    background: linear-gradient(45deg, #00ccff, #ff00ff);
    box-shadow: 0 0 8px rgba(0, 204, 255, 0.7);
}

.build-button:disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.6;
}

.progress-bar-container {
    width: 100%;
    background-color: #1a1a3e;
    border-radius: 4px;
    margin-top: 8px;
    overflow: hidden;
}

.progress-bar {
    height: 8px;
    background: linear-gradient(45deg, #00ccff, #ff00ff);
    width: 0%;
    transition: width 0.5s ease-in-out;
}

.progress-timer {
    color: #00ccff;
    font-size: 12px;
    margin-top: 4px;
}

.drone-allocation {
    background-color: #0a0f2e;
    padding: 10px;
    border: 2px solid #00ccff;
    border-radius: 10px;
    margin-top: 10px;
    text-align: center;
}

.drone-allocation h3 {
    color: #ff00ff;
    font-size: 16px;
    margin: 0 0 10px 0;
}

.drone-allocation input {
    width: 50px;
    background-color: #1a1a3e;
    color: #00ccff;
    border: 1px solid #ff00ff;
    border-radius: 4px;
    padding: 4px;
    font-family: 'Orbitron', sans-serif;
}

.drone-allocation p {
    font-size: 12px;
    color: #ffffff;
    margin: 4px 0;
}

.save-drone-allocation {
    background: linear-gradient(45deg, #ff00ff, #00ccff);
    border: none;
    color: #ffffff;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    margin-top: 10px;
}

.save-drone-allocation:hover {
    background: linear-gradient(45deg, #00ccff, #ff00ff);
    box-shadow: 0 0 8px rgba(0, 204, 255, 0.7);
}
