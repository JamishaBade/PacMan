// Game state variables
let score = 0;
let lives = 3;
let gameRunning = true;
let invulnerable = false;
let invulnerabilityTimer = 0;
let animationFrame;
let lastTime = 0;
let ghostMoveTimer = 0;
let pacmanMoveTimer = 0;
let keys = {};
let totalDots = 0;
let dotsEaten = 0;

// Game entities
let pacman = { x: 1, y: 1, direction: 'right', nextDirection: 'right' };
let ghosts = [
    { x: 9, y: 9, direction: 'up', color: '#f00', moveTimer: 0 },
    { x: 10, y: 9, direction: 'down', color: '#f0f', moveTimer: 0 },
    { x: 9, y: 10, direction: 'left', color: '#0ff', moveTimer: 0 },
    { x: 10, y: 10, direction: 'right', color: '#ffa500', moveTimer: 0 }
];

// Initialize maze by copying from the layout
let maze = [];
for (let i = 0; i < ROWS; i++) {
    maze[i] = [...MAZE_LAYOUT[i]];
}

function countDots() {
    totalDots = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 0) totalDots++;
        }
    }
}

function updateLivesDisplay() {
    const hearts = '❤️'.repeat(lives);
    const emptyHearts = '🖤'.repeat(3 - lives);
    livesElement.textContent = 'Lives: ' + hearts + emptyHearts;
}

function resetPositions() {
    pacman.x = 1;
    pacman.y = 1;
    pacman.direction = 'right';

    ghosts[0] = { x: 9, y: 9, direction: 'up', color: '#f00', moveTimer: 0 };
    ghosts[1] = { x: 10, y: 9, direction: 'down', color: '#f0f', moveTimer: 0 };
    ghosts[2] = { x: 9, y: 10, direction: 'left', color: '#0ff', moveTimer: 0 };
    ghosts[3] = { x: 10, y: 10, direction: 'right', color: '#ffa500', moveTimer: 0 };
}