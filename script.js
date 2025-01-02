// Game State
const gameState = {
    currentView: "businessSelection",
    businessType: null,
    time: 0,
    energy: 100,
    money: 100000,
    skills: {
        seoKnowledge: 0,
        marketingExpertise: 0,
        developmentSkills: 0,
        customerService: 0,
        productManagement: 0
    },
    tasks: {
        // General Tasks
        learnBusinessBasics: { name: "Learn Basic Business Principles", description: "Understand fundamental concepts.", learnHow: { timeCost: 5, energyCost: 20, moneyCost: 0, skillIncrease: {} }, purchaseProgress: { moneyCost: 300, timeCost: 1, energyCost: 5 } },
        setupBasicWebsite: { name: "Set Up Basic Website", description: "Create an online presence.", learnHow: { timeCost: 10, energyCost: 40, moneyCost: 100, skillIncrease: {} }, purchaseProgress: { moneyCost: 800, timeCost: 2, energyCost: 10 } },
        basicMarketingCampaign: { name: "Run Basic Marketing Campaign", description: "Attract initial visitors.", learnHow: { timeCost: 8, energyCost: 30, moneyCost: 200, skillIncrease: {} }, purchaseProgress: { moneyCost: 1200, timeCost: 1, energyCost: 5 } },

        // E-commerce Tasks
        sourceFirstProduct: { name: "Source First Product", description: "Find your initial product.", businessTypes: ["ecommerce"], learnHow: { timeCost: 7, energyCost: 25, moneyCost: 150, skillIncrease: { productManagement: 3 } }, purchaseProgress: { moneyCost: 900, timeCost: 1, energyCost: 5 } },
        setupOnlineStore: { name: "Set Up Online Store", description: "Configure your e-commerce platform.", businessTypes: ["ecommerce"], learnHow: { timeCost: 12, energyCost: 45, moneyCost: 250, skillIncrease: {} }, purchaseProgress: { moneyCost: 1500, timeCost: 2, energyCost: 10 } },
        handleInitialOrders: { name: "Handle Initial Orders", description: "Process and ship your first sales.", businessTypes: ["ecommerce"], learnHow: { timeCost: 5, energyCost: 20, moneyCost: 50, skillIncrease: { customerService: 2 } }, purchaseProgress: { moneyCost: 600, timeCost: 1, energyCost: 5 } },

        // Service Business Tasks
        defineServiceOfferings: { name: "Define Service Offerings", description: "Clearly outline your services.", businessTypes: ["service"], learnHow: { timeCost: 6, energyCost: 20, moneyCost: 50, skillIncrease: { marketingExpertise: 2 } }, purchaseProgress: { moneyCost: 700, timeCost: 1, energyCost: 5 } },
        acquireFirstClient: { name: "Acquire First Client", description: "Land your first paying customer.", businessTypes: ["service"], learnHow: { timeCost: 15, energyCost: 50, moneyCost: 100, skillIncrease: { marketingExpertise: 4 } }, purchaseProgress: { moneyCost: 1800, timeCost: 2, energyCost: 10 } },
        deliverFirstService: { name: "Deliver First Service", description: "Complete your first client project.", businessTypes: ["service"], learnHow: { timeCost: 10, energyCost: 35, moneyCost: 30, skillIncrease: { customerService: 3 } }, purchaseProgress: { moneyCost: 1200, timeCost: 1, energyCost: 5 } },

        // SaaS Tasks
        developCoreFeatures: { name: "Develop Core Software Features", description: "Build the foundation of your SaaS.", businessTypes: ["saas"], learnHow: { timeCost: 20, energyCost: 60, moneyCost: 500, skillIncrease: { developmentSkills: 5 } }, purchaseProgress: { moneyCost: 3000, timeCost: 3, energyCost: 15 } },
        setupSubscriptionModel: { name: "Set Up Subscription Model", description: "Implement recurring payments.", businessTypes: ["saas"], learnHow: { timeCost: 8, energyCost: 30, moneyCost: 100, skillIncrease: { developmentSkills: 2 } }, purchaseProgress: { moneyCost: 1000, timeCost: 1, energyCost: 5 } },
        onboardFirstUsers: { name: "Onboard First Users", description: "Get your initial users signed up.", businessTypes: ["saas"], learnHow: { timeCost: 12, energyCost: 40, moneyCost: 150, skillIncrease: { marketingExpertise: 3 } }, purchaseProgress: { moneyCost: 1500, timeCost: 2, energyCost: 10 } },

        // Automation Tasks (Unlockable later)
        automateEmailMarketing: { name: "Automate Email Marketing", description: "Set up automated email sequences.", unlocksAtAutomation: 20, learnHow: { timeCost: 15, energyCost: 40, moneyCost: 300, skillIncrease: {} }, purchaseProgress: { moneyCost: 2000, timeCost: 2, energyCost: 10 } },
        automateSocialMedia: { name: "Automate Social Media", description: "Schedule social media posts.", unlocksAtAutomation: 30, learnHow: { timeCost: 10, energyCost: 30, moneyCost: 200, skillIncrease: {} }, purchaseProgress: { moneyCost: 1500, timeCost: 1, energyCost: 5 } },
        customerSupportAutomation: { name: "Automate Basic Customer Support", description: "Implement basic support responses.", unlocksAtAutomation: 40, learnHow: { timeCost: 18, energyCost: 50, moneyCost: 400, skillIncrease: {} }, purchaseProgress: { moneyCost: 2500, timeCost: 2, energyCost: 10 } },
    },
    completedTasks: {},
    automationLevel: 0,
    expenses: 100, // Base daily expenses
    income: 0,
    notifications: [],
    backgroundMusicURL: "background.mp3" // Replace with your actual URL
};

// DOM Elements
const gameContainer = document.getElementById("game-container");
const businessSelectionDiv = document.getElementById("business-selection");
const gamePlayDiv = document.getElementById("game-play");
const businessTypeDisplay = document.getElementById("business-type");
const timeDisplay = document.getElementById("time");
const energyDisplay = document.getElementById("energy");
const moneyDisplay = document.getElementById("money");
const automationLevelDisplay = document.getElementById("automation-level");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const taskList = document.getElementById("task-list");
const notificationsDiv = document.getElementById("notifications");
const gameOverDiv = document.getElementById("game-over");
const gameOverMessage = document.getElementById("game-over-message");
const restartButton = document.getElementById("restart-button");
const gameWinDiv = document.getElementById("game-win");
const restartWinButton = document.getElementById("restart-win-button");
const backgroundMusic = document.getElementById("background-music");

// Initialize Game
function initializeGame() {
    backgroundMusic.src = gameState.backgroundMusicURL;
    backgroundMusic.loop = true;

    document.getElementById("ecommerce-button").addEventListener("click", () => selectBusinessType("ecommerce"));
    document.getElementById("service-button").addEventListener("click", () => selectBusinessType("service"));
    document.getElementById("saas-button").addEventListener("click", () => selectBusinessType("saas"));
    restartButton.addEventListener("click", restartGame);
    restartWinButton.addEventListener("click", restartGame);

    updateUI();
}

function restartGame() {
    gameState.currentView = "businessSelection";
    gameState.businessType = null;
    gameState.time = 0;
    gameState.energy = 100;
    gameState.money = 1000;
    gameState.completedTasks = {};
    gameState.automationLevel = 0;
    gameState.income = 0;
    gameState.expenses = 100;
    gameState.notifications = [];
    updateUI();
}

function selectBusinessType(type) {
    gameState.businessType = type;
    gameState.currentView = "gamePlay";
    addNotification(`You started a ${type.toUpperCase()} business!`);
    updateUI();
}

function updateUI() {
    // Hide all views first
    businessSelectionDiv.style.display = "none";
    gamePlayDiv.style.display = "none";
    gameOverDiv.style.display = "none";
    gameWinDiv.style.display = "none";

    if (gameState.currentView === "businessSelection") {
        businessSelectionDiv.style.display = "block";
    } else if (gameState.currentView === "gamePlay") {
        gamePlayDiv.style.display = "block";
        businessTypeDisplay.textContent = gameState.businessType.toUpperCase();
        timeDisplay.textContent = gameState.time;
        energyDisplay.textContent = gameState.energy;
        moneyDisplay.textContent = gameState.money;
        automationLevelDisplay.textContent = gameState.automationLevel;
        incomeDisplay.textContent = gameState.income;
        expensesDisplay.textContent = gameState.expenses;
        renderTaskList();
        renderNotifications();
    } else if (gameState.currentView === "gameOver") {
        gameOverDiv.style.display = "block";
    } else if (gameState.currentView === "gameWin") {
        gameWinDiv.style.display = "block";
    }
}

function renderTaskList() {
    taskList.innerHTML = "";
    const relevantTasks = Object.keys(gameState.tasks)
        .filter(taskId =>
            !gameState.completedTasks[taskId] &&
            (!gameState.tasks[taskId].businessTypes || gameState.tasks[taskId].businessTypes.includes(gameState.businessType)) &&
            (gameState.tasks[taskId].unlocksAtAutomation === undefined || gameState.automationLevel >= gameState.tasks[taskId].unlocksAtAutomation)
        );

    relevantTasks.forEach(taskId => {
        const task = gameState.tasks[taskId];
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${task.name} <br>
            <button onclick="attemptLearnHow('${taskId}')">Learn How (${task.learnHow.timeCost}d, ${task.learnHow.energyCost}E, \$${task.learnHow.moneyCost})</button>
            <button onclick="attemptPurchaseProgress('${taskId}')">Purchase Progress (\$${task.purchaseProgress.moneyCost}, ${task.purchaseProgress.timeCost}d, ${task.purchaseProgress.energyCost}E)</button>
            <p class="task-description">${task.description}</p>
        `;
        taskList.appendChild(listItem);
    });
}

function attemptLearnHow(taskId) {
    const task = gameState.tasks[taskId];
    if (gameState.time >= task.learnHow.timeCost && gameState.energy >= task.learnHow.energyCost && gameState.money >= task.learnHow.moneyCost) {
        gameState.time += task.learnHow.timeCost;
        gameState.energy -= task.learnHow.energyCost;
        gameState.money -= task.learnHow.moneyCost;
        Object.keys(task.learnHow.skillIncrease).forEach(skill => gameState.skills[skill] += task.learnHow.skillIncrease[skill]);
        completeTask(taskId);
        addNotification(`Learned how to complete: ${task.name}`);
        updateUI();
    } else {
        addNotification("Insufficient resources to learn.");
    }
}

function attemptPurchaseProgress(taskId) {
    const task = gameState.tasks[taskId];
    if (gameState.money >= task.purchaseProgress.moneyCost && gameState.energy >= task.purchaseProgress.energyCost && gameState.time >= task.purchaseProgress.timeCost) {
        gameState.money -= task.purchaseProgress.moneyCost;
        gameState.time += task.purchaseProgress.timeCost;
        gameState.energy -= task.purchaseProgress.energyCost;
        completeTask(taskId);
        addNotification(`Purchased progress for: ${task.name}`);
        updateUI();
    } else {
        addNotification("Insufficient funds to purchase progress.");
    }
}

function completeTask(taskId) {
    gameState.completedTasks[taskId] = true;
    // Update automation level based on completed tasks (example)
    if (taskId === 'automateEmailMarketing') gameState.automationLevel += 10;
    if (taskId === 'automateSocialMedia') gameState.automationLevel += 15;
    if (taskId === 'customerSupportAutomation') gameState.automationLevel += 20;
}

function updateEconomy() {
    let newIncome = 0;
    // Example income based on completed tasks and automation
    if (gameState.completedTasks.basicMarketingCampaign) newIncome += 50;
    if (gameState.completedTasks.acquireFirstClient || gameState.completedTasks.handleInitialOrders || gameState.completedTasks.onboardFirstUsers) newIncome += 100;
    newIncome += gameState.automationLevel * 2; // Income boost from automation

    gameState.income = newIncome;
    gameState.money -= gameState.expenses; // Deduct daily expenses

    if (gameState.money < 0 && gameState.currentView === "gamePlay") {
        gameOver("You ran out of money!");
    }

    if (gameState.income > gameState.expenses && gameState.automationLevel >= 80 && gameState.currentView === "gamePlay") {
        winGame();
    }
}

function addNotification(message) {
    gameState.notifications.push({ message: message, timestamp: Date.now() });
    // Keep only the latest 5 notifications
    if (gameState.notifications.length > 5) {
        gameState.notifications.shift();
    }
    renderNotifications();
}

function renderNotifications() {
    notificationsDiv.innerHTML = "";
    gameState.notifications.forEach(notification => {
        const notificationElement = document.createElement("div");
        notificationElement.classList.add("notification");
        notificationElement.textContent = notification.message;
        notificationsDiv.appendChild(notificationElement);
    });
}

function gameOver(message) {
    gameState.currentView = "gameOver";
    gameOverMessage.textContent = message;
    updateUI();
}

function winGame() {
    gameState.currentView = "gameWin";
    updateUI();
}

// Basic Game Loop
setInterval(() => {
    if (gameState.currentView === "gamePlay") {
        gameState.time++;
        gameState.energy = Math.min(100, gameState.energy + 1);
        updateEconomy();
        updateUI();
    }
}, 1000);

// Initialization
document.addEventListener("DOMContentLoaded", initializeGame);
