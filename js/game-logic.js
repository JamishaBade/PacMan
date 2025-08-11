// Checks if a position is valid (not a wall or out of bounds)
function isValidMove(x, y) {
    // If position is outside the maze boundaries...
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
        // Special case: allow tunnel movement in the middle row
        if (y === 9 && (x < 0 || x >= COLS)) return true;
        return false;
    }
    // 1 represents walls in the maze, so we can't move there
    return maze[y][x] !== 1;
}

// Handles Pacman's movement based on player input
function movePacman(deltaTime) {
    pacmanMoveTimer += deltaTime;

    // Control movement speed - only move every 80ms
    if (pacmanMoveTimer < 80) return;
    pacmanMoveTimer = 0;

    // Check keyboard input for direction changes
    if (keys['ArrowUp'] || keys['KeyW']) {
        pacman.nextDirection = 'up';
    } else if (keys['ArrowDown'] || keys['KeyS']) {
        pacman.nextDirection = 'down';
    } else if (keys['ArrowLeft'] || keys['KeyA']) {
        pacman.nextDirection = 'left';
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        pacman.nextDirection = 'right';
    }

    // Try to change direction if player pressed a new key
    if (pacman.nextDirection !== pacman.direction) {
        let newX = pacman.x;
        let newY = pacman.y;

        // Calculate new position based on desired direction
        switch(pacman.nextDirection) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }

        // Handle screen wrapping (tunnel effect)
        if (newX < 0) newX = COLS - 1;
        if (newX >= COLS) newX = 0;

        // If the new direction is valid, change direction and move
        if (isValidMove(newX, newY)) {
            pacman.direction = pacman.nextDirection;
            pacman.x = newX;
            pacman.y = newY;

            // Check if we hit a dot (0 represents a dot)
            if (maze[newY][newX] === 0) {
                maze[newY][newX] = 2; // Mark dot as eaten
                score += 10;
                dotsEaten++;
                scoreElement.textContent = 'Score: ' + score;

                // Check if we ate all dots (win condition)
                if (dotsEaten >= totalDots) {
                    gameRunning = false;
                    cancelAnimationFrame(animationFrame);
                    gameOverElement.textContent = 'YOU WIN!';
                    gameOverElement.style.color = '#0f0';
                    gameOverElement.style.display = 'block';
                }
            }
            return; // We moved, so we're done for this frame
        }
    }

    // If we didn't change direction, keep moving in current direction
    let newX = pacman.x;
    let newY = pacman.y;

    switch(pacman.direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
    }

    // Handle tunnel again for current direction
    if (newX < 0) newX = COLS - 1;
    if (newX >= COLS) newX = 0;

    if (isValidMove(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;

        // Eat dot if we hit one
        if (maze[newY][newX] === 0) {
            maze[newY][newX] = 2;
            score += 10;
            dotsEaten++;
            scoreElement.textContent = 'Score: ' + score;

            if (dotsEaten >= totalDots) {
                gameRunning = false;
                cancelAnimationFrame(animationFrame);
                gameOverElement.textContent = 'YOU WIN!';
                gameOverElement.style.color = '#0f0';
                gameOverElement.style.display = 'block';
            }
        }
    }
}

// Handles ghost movement with simple AI
function moveGhosts(deltaTime) {
    ghostMoveTimer += deltaTime;

    // Ghosts move slower than Pacman (every 150ms)
    if (ghostMoveTimer < 150) return;
    ghostMoveTimer = 0;

    ghosts.forEach(ghost => {
        const directions = ['up', 'down', 'left', 'right'];

        // Try to keep moving in current direction
        let newX = ghost.x;
        let newY = ghost.y;

        switch(ghost.direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }

        if (isValidMove(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
        } else {
            // If we hit a wall, find all possible valid directions
            const validDirections = directions.filter(dir => {
                let testX = ghost.x;
                let testY = ghost.y;

                switch(dir) {
                    case 'up': testY--; break;
                    case 'down': testY++; break;
                    case 'left': testX--; break;
                    case 'right': testX++; break;
                }

                return isValidMove(testX, testY);
            });

            // Pick a random valid direction
            if (validDirections.length > 0) {
                ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
        }

        // Ghosts can also use the tunnel
        if (ghost.x < 0) ghost.x = COLS - 1;
        if (ghost.x >= COLS) ghost.x = 0;
    });
}

// Checks for collisions between Pacman and ghosts
function checkCollisions() {
    // If Pacman is invulnerable (just ate a power pellet), ignore collisions
    if (invulnerable) return;

    ghosts.forEach(ghost => {
        // Check if ghost and Pacman are in the same spot
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            lives--;
            updateLivesDisplay();

            if (lives <= 0) {
                // Game over if no lives left
                gameRunning = false;
                cancelAnimationFrame(animationFrame);
                gameOverElement.style.display = 'block';
            } else {
                // Reset positions and give temporary invulnerability
                resetPositions();
                invulnerable = true;
                invulnerabilityTimer = 2000; // 2 seconds of safety
            }
        }
    });
}

// Resets the entire game to starting conditions
function resetGame() {
    // Reset all game state variables
    score = 0;
    lives = 3;
    dotsEaten = 0;
    gameRunning = true;
    invulnerable = false;
    invulnerabilityTimer = 0;
    lastTime = 0;
    ghostMoveTimer = 0;
    pacmanMoveTimer = 0;
    keys = {}; // Clear any pressed keys

    // Stop any existing animation
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    // Reset Pacman and ghosts to starting positions
    pacman = { x: 1, y: 1, direction: 'right', nextDirection: 'right' };
    ghosts = [
        { x: 9, y: 9, direction: 'up', color: '#f00', moveTimer: 0 },
        { x: 10, y: 9, direction: 'down', color: '#f0f', moveTimer: 0 },
        { x: 9, y: 10, direction: 'left', color: '#0ff', moveTimer: 0 },
        { x: 10, y: 10, direction: 'right', color: '#ffa500', moveTimer: 0 }
    ];

    // Reset the maze (bring back all eaten dots)
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            maze[i][j] = MAZE_LAYOUT[i][j];
        }
    }

    // Update game displays
    countDots();
    scoreElement.textContent = 'Score: 0';
    updateLivesDisplay();
    gameOverElement.style.display = 'none';
    gameOverElement.textContent = 'GAME OVER!';
    gameOverElement.style.color = '#f00';
}