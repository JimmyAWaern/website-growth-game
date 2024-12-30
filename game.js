const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

// Game variables
let resources = 90;
let level = 1;
let tasksCompleted = 0;
let milestoneTarget = 3;
let milestoneReward = 50;
let totalTasks = 0;
let totalBonuses = 0;
let levelsCompleted = 0;

function preload() {
    this.load.image('taskIcon', 'assets/taskIcon.png');
    this.load.image('particle', 'assets/particle.png');
}

function create() {
    // Title
    this.add.text(400, 50, `Website Growth Game (Level ${level})`, {
        font: '28px Arial',
        fill: '#ffffff',
    }).setOrigin(0.5);

    // Resources display
    this.resourceText = this.add.text(20, 20, `Resources: ${resources}`, {
        font: '20px Arial',
        fill: '#ffffff',
    });

    // Milestone progress bar
    this.add.text(20, 60, 'Milestone Progress:', {
        font: '18px Arial',
        fill: '#ffffff',
    });

    const progressBarBg = this.add.rectangle(150, 80, 300, 20, 0x666666);
    this.progressBar = this.add.rectangle(150, 80, 0, 20, 0x00ff00);

    // Reward preview
    this.rewardPreview = this.add.text(150, 40, `Reward: +${milestoneReward} Resources`, {
        font: '16px Arial',
        fill: '#ffffff',
    }).setOrigin(0.5);

    // Cumulative stats display
    this.statsOverlay = this.add.text(600, 20, '', {
        font: '16px Arial',
        fill: '#ffffff',
    });
    this.updateCumulativeStats();

    // Tasks
    const task = this.add.image(400, 300, 'taskIcon').setInteractive();
    task.on('pointerdown', () => this.completeTask(task, 30));
}

function update() {
    this.resourceText.setText(`Resources: ${resources}`);
}

function completeTask(taskObject, reward) {
    resources += reward;
    tasksCompleted += 1;
    totalTasks += 1; // Update cumulative tasks
    taskObject.setVisible(false);
    this.updateProgressBar();
    this.checkMilestone();
    this.checkLevelCompletion();
}

function updateProgressBar() {
    const progress = (tasksCompleted / milestoneTarget) * 300;
    this.progressBar.width = progress;
}

function updateCumulativeStats() {
    this.statsOverlay.setText(
        `Total Tasks: ${totalTasks}\n` +
        `Total Bonuses: ${totalBonuses}\n` +
        `Levels Completed: ${levelsCompleted}`
    );
}

function checkMilestone() {
    if (tasksCompleted === milestoneTarget) {
        resources += milestoneReward; // Milestone reward
        totalBonuses += milestoneReward; // Update cumulative bonuses
        this.updateCumulativeStats();
        this.showMilestonePopup();
        this.progressBar.width = 0; // Reset progress bar
        tasksCompleted = 0; // Reset milestone counter
    }
}

function showMilestonePopup() {
    const popup = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.8);
    const border = this.add.rectangle(400, 300, 410, 210, 0xffffff).setDepth(-1);

    const title = this.add.text(400, 250, 'Milestone Reached!', {
        font: '24px Arial',
        fill: '#00ff00',
    }).setOrigin(0.5);

    const rewardText = this.add.text(400, 310, `Bonus Reward: +${milestoneReward} Resources`, {
        font: '18px Arial',
        fill: '#ffffff',
    }).setOrigin(0.5);

    // Add glowing animation to the reward text
    this.tweens.add({
        targets: rewardText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 500,
        yoyo: true,
        repeat: -1,
    });

    const continueButton = this.add.text(400, 380, 'Continue', {
        font: '20px Arial',
        fill: '#ffffff',
        backgroundColor: '#007700',
        padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    continueButton.on('pointerdown', () => {
        popup.destroy();
        border.destroy();
        title.destroy();
        rewardText.destroy();
        continueButton.destroy();
    });

    // Particle effects
    const particles = this.add.particles('particle');
    const emitter = particles.createEmitter({
        x: 400,
        y: 300,
        speed: { min: -200, max: 200 },
        lifespan: 1000,
        quantity: 50,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
    });

    this.time.addEvent({
        delay: 1000,
        callback: () => particles.destroy(),
    });
}

function checkLevelCompletion() {
    if (tasksCompleted === milestoneTarget) {
        levelsCompleted += 1; // Update cumulative levels
        level += 1;
        tasksCompleted = 0;
        this.saveProgress();
        this.transitionToNextLevel();
    }
}

function saveProgress() {
    const gameState = {
        resources,
        level,
        tasksCompleted,
        totalTasks,
        totalBonuses,
        levelsCompleted,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function transitionToNextLevel() {
    const transitionText = this.add.text(400, 300, `Level ${level - 1} Complete!`, {
        font: '30px Arial',
        fill: '#00ff00',
    }).setOrigin(0.5);

    this.time.addEvent({
        delay: 2000,
        callback: () => {
            transitionText.destroy();
            location.reload(); // Reload for next level
        },
        loop: false,
    });
}
