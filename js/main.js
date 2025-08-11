// Main game loop function that runs continuously while the game is running
function gameLoop(currentTime) {
    // Exit the loop if the game is not running
    if (!gameRunning) return;

    // Calculate time passed since last frame (for smooth animation)
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Handle invulnerability timer (after pacman eats a power pellet)
    if (invulnerable) {
        invulnerabilityTimer -= deltaTime;
        // When timer runs out, make pacman vulnerable again
        if (invulnerabilityTimer <= 0) {
            invulnerable = false;
        }
    }

    // Clear the canvas before drawing new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all game elements in correct order
    drawMaze();      // this displays the maze/walls
    drawPacman();    // this draws pacman character
    drawGhosts();    // this draws all ghosts

    // Update positions of game characters
    movePacman(deltaTime);   // Move pacman based on user input
    moveGhosts(deltaTime);   // Move all ghosts (AI movement)

    // Check for collisions between pacman and ghosts/dots
    checkCollisions();

    // Continue the game loop by requesting next animation frame
    animationFrame = requestAnimationFrame(gameLoop);
}

// Initialize game state when starting
countDots();                     // Count how many dots are in the maze
updateLivesDisplay();            // Show initial lives count on screen
animationFrame = requestAnimationFrame(gameLoop);  // Start the game loop