let marketShare = 0;
let money = 10000;
let time = 50;
let team = 1;
let currentLevel = 1;
let category = '';
let domainName = '';

const levels = {
    1: [
        { task: "Choose a domain name", cost: { money: 100, time: 5 }, marketShare: 10 },
        { task: "Build a basic homepage", cost: { money: 300, time: 10 }, marketShare: 20 },
        { task: "Set up website hosting", cost: { money: 200, time: 8 }, marketShare: 30 }
    ],
    2: [
        { task: "Integrate Google Analytics", cost: { money: 150, time: 5 }, marketShare: 20 },
        { task: "Create a sitemap", cost: { money: 100, time: 7 }, marketShare: 25 },
        { task: "Add placeholder content", cost: { money: 100, time: 6 }, marketShare: 30 }
    ],
    3: [
        { task: "Implement SEO", cost: { money: 200, time: 10 }, marketShare: 30 },
        { task: "Launch an Ad Campaign", cost: { money: 400, time: 15 }, marketShare: 40 },
        { task: "Analyze Traffic", cost: { money: 100, time: 5 }, marketShare: 50 }
    ]
};

const competitors = [
    { name: "Competitor 1", marketShare: 0 },
    { name: "Competitor 2", marketShare: 0 },
    { name: "Competitor 3", marketShare: 0 }
];

const marketShareDisplay = document.getElementById('market-share');
const moneyDisplay = document.getElementById('money');
const timeDisplay = document.getElementById('time');
const levelContainer = document.getElementById('level-container');
const statusDisplay = document.getElementById('status');

function updateMarketShare(value) {
    marketShare += value;
    marketShareDisplay.innerText = marketShare;
}

function updateResources(cost) {
    money -= cost.money;
    time -= cost.time;
    moneyDisplay.innerText = money;
    timeDisplay.innerText = time;
}

function selectCategory(selectedCategory) {
    category = selectedCategory;
    localStorage.setItem('category', category);
    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('domain-input').style.display = 'block';
}

function saveDomainName() {
    const domainInput = document.getElementById('domain').value;
    if (domainInput) {
        domainName = domainInput;
        localStorage.setItem('domainName', domainName);
        document.getElementById('domain-input').style.display = 'none';
        loadLevel(currentLevel);
        document.getElementById('level-container').style.display = 'block';
    } else {
        alert('Please enter a valid domain name.');
    }
}

function loadLevel(level) {
    levelContainer.innerHTML = `<h2>Level ${level}</h2>`;
    levels[level].forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const taskLabel = document.createElement('span');
        taskLabel.innerText = `${task.task} (Cost: $${task.cost.money}, ${task.cost.time} hours)`;

        const taskButton = document.createElement('button');
        taskButton.innerText = "Complete";
        taskButton.onclick = () => {
            if (money >= task.cost.money && time >= task.cost.time) {
                statusDisplay.innerText = `${task.task} completed!`;
                taskButton.disabled = true;
                updateMarketShare(task.marketShare);
                updateResources(task.cost);
            } else {
                statusDisplay.innerText = "Not enough resources to complete this task!";
            }
        };

        taskDiv.appendChild(taskLabel);
        taskDiv.appendChild(taskButton);
        levelContainer.appendChild(taskDiv);
    });
}
