document.addEventListener('keydown', (e) => {
    if (!gameRunning && e.code === 'Space') {
        resetGame();
        animationFrame = requestAnimationFrame(gameLoop);
        return;
    }

    if (!gameRunning) return;

    // Store key states for smooth movement
    keys[e.code] = true;
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});