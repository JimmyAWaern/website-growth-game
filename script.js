// Game State
const gameState = {
    companyName: "IndieSoft", // You can let the player name their company
    funds: 10000,
    platforms: ["PC"],
    availableGenres: ["Action", "RPG", "Strategy"],
    researchedTechnologies: [],
    researchPoints: 0,
    researchCost: 5000,
    games: [],
    gameIdCounter: 1,
    gameHistory: [],
    currentYear: 1980, // Start year
    newsFeed: [],
};

// DOM Elements
const companyNameDisplay = document.getElementById("company-name");
const companyFundsDisplay = document.getElementById("company-funds");
const platformSelect = document.getElementById("platform");
const developGameForm = document.getElementById("develop-game-form");
const researchedTechnologiesList = document.getElementById("researched-technologies");
const researchButton = document.getElementById("research-button");
const researchCostDisplay = document.getElementById("research-cost");
const gameList = document.getElementById("game-list");
const newsFeedList = document.getElementById("news-feed");

// Initialize Game
function initializeGame() {
    companyNameDisplay.textContent = gameState.companyName;
    updateFundsDisplay();
    populatePlatformOptions();
    updateResearchButtonState();
    updateResearchCostDisplay();
}

function updateFundsDisplay() {
    companyFundsDisplay.textContent = gameState.funds;
}

function populatePlatformOptions() {
    platformSelect.innerHTML = "";
    gameState.platforms.forEach(platform => {
        const option = document.createElement("option");
        option.value = platform;
        option.textContent = platform;
        platformSelect.appendChild(option);
    });
}

function updateResearchButtonState() {
    researchButton.disabled = gameState.funds < gameState.researchCost;
}

function updateResearchCostDisplay() {
    researchCostDisplay.textContent = gameState.researchCost;
}

// Game Development
developGameForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const gameName = document.getElementById("game-name").value;
    const genre = document.getElementById("genre").value;
    const platform = platformSelect.value;

    if (gameName.trim() === "") {
        alert("Please enter a game title.");
        return;
    }

    developGame(gameName, genre, platform);
});

function developGame(name, genre, platform) {
    const developmentCost = 2000; // Example cost
    if (gameState.funds >= developmentCost) {
        gameState.funds -= developmentCost;
        updateFundsDisplay();

        const game = {
            id: gameState.gameIdCounter++,
            name: name,
            genre: genre,
            platform: platform,
            releaseYear: gameState.currentYear,
            score: generateReviewScore(), // Placeholder for score generation
            sales: 0,
        };
        gameState.games.push(game);
        gameState.gameHistory.unshift(`${gameState.currentYear}: Released "${game.name}" (${game.genre}) on ${game.platform}.`);
        updateGameHistoryDisplay();
        simulateSales(game);
        addNews(`Released "${game.name}" on ${game.platform}!`);
    } else {
        addNews("Not enough funds to develop the game.");
    }
}

function generateReviewScore() {
    // Simple random score for now, can be more complex
    return Math.floor(Math.random() * (10 - 3 + 1)) + 3; // Score between 3 and 10
}

function simulateSales(game) {
    // Very basic sales simulation
    const baseSales = 5000;
    const genreModifier = game.genre === "Action" ? 1.2 : 1; // Example modifier
    const platformModifier = game.platform === "PC" ? 1 : 0.8; // Example modifier
    const scoreModifier = game.score / 5; // Scale score

    const sales = Math.floor(baseSales * genreModifier * platformModifier * scoreModifier);
    game.sales = sales;
    const revenue = sales * 30; // Example price per game
    gameState.funds += revenue;
    updateFundsDisplay();
    addNews(`"${game.name}" sold approximately ${sales} copies and generated $${revenue}. Review Score: ${game.score}/10`);
}

function updateGameHistoryDisplay() {
    gameList.innerHTML = "";
    gameState.gameHistory.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        gameList.appendChild(li);
    });
}

// Research
researchButton.addEventListener("click", function() {
    if (gameState.funds >= gameState.researchCost) {
        gameState.funds -= gameState.researchCost;
        gameState.researchPoints += 100; // Example research points gained
        updateFundsDisplay();
        updateResearchButtonState();
        attemptResearch();
    }
});

function attemptResearch() {
    // Simple chance-based research unlock
    if (Math.random() < 0.3) {
        const newTechnology = "Improved Graphics"; // Example technology
        if (!gameState.researchedTechnologies.includes(newTechnology)) {
            gameState.researchedTechnologies.push(newTechnology);
            updateResearchedTechnologiesDisplay();
            addNews(`Researched "${newTechnology}"!`);
        }
    } else {
        addNews("Research yielded no immediate breakthroughs.");
    }
}

function updateResearchedTechnologiesDisplay() {
    researchedTechnologiesList.innerHTML = "";
    gameState.researchedTechnologies.forEach(tech => {
        const li = document.createElement("li");
        li.textContent = tech;
        researchedTechnologiesList.appendChild(li);
    });
}

// News Feed
function addNews(message) {
    const newsItem = document.createElement("li");
    newsItem.textContent = `(${gameState.currentYear}) ${message}`;
    newsFeedList.insertBefore(newsItem, newsFeedList.firstChild); // Add to the top
    if (newsFeedList.children.length > 5) { // Keep only the latest news
        newsFeedList.removeChild(newsFeedList.lastChild);
    }
}

// Game Loop (Basic time progression)
setInterval(() => {
    gameState.currentYear++;
    // Potentially introduce new platforms or events based on the year
    if (gameState.currentYear === 1985 && !gameState.platforms.includes("NES")) {
        gameState.platforms.push("NES");
        populatePlatformOptions();
        addNews("The Nintendo Entertainment System (NES) is released!");
    }
}, 10000); // Example: Advance year every 10 seconds

// Initialization
initializeGame();
