// public/js/news.js

import { getGameState, updateGameState } from './game-state.js';

// List of possible news items (expand with more)
const NEWS_TEMPLATES = [
    { title: "Antrenament intens la clubul tău!", type: "positive" },
    { title: "Fanii sunt entuziasmați de noul sezon.", type: "positive" },
    { title: "Un jucător cheie s-a accidentat la antrenament.", type: "negative" },
    { title: "Zvonuri de transfer circulă în galaxie.", type: "neutral" },
    { title: "O nouă stea a apărut pe firmament.", type: "positive" }
];

/**
 * Initializes or updates the news system.
 * This function can be called to generate initial news or on specific game events.
 */
export function initNewsSystem() {
    console.log("news.js: Initializing news system.");
    let gameState = getGameState();

    if (!gameState.news) {
        gameState.news = [];
    }

    // Example: Generate a few initial news items if the news array is empty
    if (gameState.news.length === 0) {
        for (let i = 0; i < 3; i++) { // Generate 3 initial news items
            const randomTemplate = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
            const newNews = {
                id: `news_${Date.now()}_${i}`,
                date: `Sezon ${gameState.currentSeason}, Ziua ${gameState.currentDay}`,
                title: randomTemplate.title,
                type: randomTemplate.type,
                read: false
            };
            gameState.news.unshift(newNews);
        }
        console.log("news.js: Initial news generated.");
        updateGameState(gameState); // Save updated state with new news
    }
}

/**
 * Returns the latest N news items.
 * @param {number} count - The number of news items to return.
 * @returns {Array<object>} A list of the most recent news items.
 */
export function getLatestNews(count = 3) {
    const gameState = getGameState();
    if (gameState && gameState.news) {
        return gameState.news.slice(0, count);
    }
    return [];
}

/**
 * Marks a news item as read.
 * @param {string} newsId - The ID of the news item to mark.
 */
export function markNewsAsRead(newsId) {
    let gameState = getGameState();
    const newsItem = gameState.news.find(n => n.id === newsId);
    if (newsItem) {
        newsItem.read = true;
        updateGameState(gameState);
        console.log(`news.js: News item with ID ${newsId} marked as read.`);
    }
}
