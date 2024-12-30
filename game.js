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
    this.load.image('taskIcon', 'assets/taskIcon.png'); // Placeholder for task image
    this.load.image('particle', 'assets/particle.png'); // Placeholder for particle effect
}

function create() {
    // Dynamic positions for centering elements
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Set background color
    this.cameras.main.setBackgroundColor('#222'); // Dark background

    // Title
    this.add.text(centerX, 40, `Website Growth Game (Level ${level})`, {
        font: '28px Arial',
        fill: '#ffffff',
    }).setOrigin(0.5);

    // Resources display
    this.resourceText = this.add.text(centerX, 80, `Resources: ${resources}`, {
        font: '20px Arial',
        fill: '#00ff00', // Green for visibility
    }).setOrigin(0.5);

    // Milestone progress bar
    const progressBarWidth = this.cameras.main.width * 0.6; // 60% of canvas width
    this.add.text(centerX, 120, 'Milestone Progress:', {
        font: '18px Arial',
        fill: '#ffffff',
    }).setOrigin(0.5);

    const progressBarBg = this.add.rectangle(centerX, 140, progressBarWidth, 20, 0x666666).setOrigin(0.5);
    this.progressBar = this.add.rectangle(centerX - progressBarWidth / 2, 140, 0, 20, 0x00ff00).setOrigin(0, 0.5);

    // Reward preview
    this.rewardPreview = this.add.text(centerX, 180, `Reward: +${milestoneReward} Resources`, {
        font: '16px Arial',
        fill: '#ffcc00', // Yellow for emphasis
    }).setOrigin(0.5);

    // Task (Clickable object)
    const task = this.add.image(centerX, centerY, 'taskIcon').setInteractive();
    task.setScale(1.5); // Scale up the task icon
    task.on('pointerdown', () => this.completeTask(task, 30));
}

function update() {
    this.resourceText.setText(`Resources: ${resources}`);
}

function completeTask(taskObject, reward) {
    resources += reward;
    tasksCompleted += 1;
    totalTasks += 1; // Update cumulative tasks
    taskObject.setVisible(false); // Hide the task when clicked
    this.updateProgressBar();
    this.checkMilestone();
}

function updateProgressBar() {
    const progressBarWidth = this.cameras.main.width * 0.6; // Match canvas scaling
    const progress = (tasksCompleted / milestoneTarget) * progressBarWidth;
    this.progressBar.width = progress;
}

function checkMilestone() {
    if (tasksCompleted === milestoneTarget) {
        resources += milestoneReward; // Milestone reward
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
}
