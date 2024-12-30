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
    this.load.image('taskIcon', 'assets/taskIcon.png'); // Placeholder task image
    this.load.image('particle', 'assets/particle.png'); // Placeholder particle image
}

function create() {
    // Set background color
    this.cameras.main.setBackgroundColor('#1d1f21'); // Dark gray

    // Center positions
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Title
    this.add.text(centerX, 50, `Website Growth Game (Level ${level})`, {
        font: '28px Arial',
        fill: '#00ffff', // Cyan for visibility
    }).setOrigin(0.5);

    // Resources display
    this.resourceText = this.add.text(20, 20, `Resources: ${resources}`, {
        font: '20px Arial',
        fill: '#ffffff', // White
    });

    // Milestone progress bar
    const progressBarWidth = this.cameras.main.width * 0.6; // 60% of screen width
    const progressBarBg = this.add.rectangle(centerX, 100, progressBarWidth, 20, 0x666666).setOrigin(0.5);
    this.progressBar = this.add.rectangle(centerX - progressBarWidth / 2, 100, 0, 20, 0x00ff00).setOrigin(0, 0.5);

    // Reward preview
    this.rewardPreview = this.add.text(centerX, 140, `Reward: +${milestoneReward} Resources`, {
        font: '16px Arial',
        fill: '#ffcc00', // Yellow for emphasis
    }).setOrigin(0.5);

    // Cumulative stats display
    this.statsOverlay = this.add.text(20, 180, '', {
        font: '16px Arial',
        fill: '#ffffff',
    });
    this.updateCumulativeStats();

    // Tasks (Clickable object)
    const task = this.add.image(centerX, centerY, 'taskIcon').setInteractive();
    task.setScale(1.5); // Make the task larger
    task.on('pointerdown', () => this.completeTask(task, 30));
}

function update() {
    this.resourceText.setText(`Resources: ${resources}`);
}

function completeTask(taskObject, reward) {
    resources += reward;
    tasksCompleted += 1;
    totalTasks += 1; // Update cumulative tasks
    taskObject.setVisible(false); // Hide the task after clicking
    this.updateProgressBar();
    this.checkMilestone();
    this.checkLevelCompletion();
}

function updateProgressBar() {
    const progressBarWidth = this.cameras.main.width * 0.6; // 60% of screen width
    const progress = (tasksCompleted / milestoneTarget) * progressBarWidth;
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
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const popup = this.add.rectangle(centerX, centerY, 400, 200, 0x000000, 0.8);
    const border = this.add.rectangle(centerX, centerY, 410, 210, 0xffffff).setDepth(-1);

    const title = this.add.text(centerX, centerY - 50, 'Milestone Reached!', {
        font: '24px Arial',
        fill: '#00ff00',
    }).setOrigin(0.5);

    const rewardText = this.add.text(centerX, centerY, `Bonus Reward: +${milestoneReward} Resources`, {
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

    const continueButton = this.add.text(centerX, centerY + 50, 'Continue', {
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
        x: centerX,
        y: centerY,
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
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const transitionText = this.add.text(centerX, centerY, `Level ${level - 1} Complete!`, {
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
