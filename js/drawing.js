function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * CELL_SIZE + CELL_SIZE/2, y * CELL_SIZE + CELL_SIZE/2, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 1) {
                drawCell(col, row, '#00f');
            } else if (maze[row][col] === 0) {
                drawCircle(col, row, 3, '#ff0');
            }
        }
    }
}

function drawPacman() {
    const centerX = pacman.x * CELL_SIZE + CELL_SIZE/2;
    const centerY = pacman.y * CELL_SIZE + CELL_SIZE/2;

    // Flash when invulnerable
    if (invulnerable && Math.floor(Date.now() / 100) % 2) {
        ctx.globalAlpha = 0.5;
    }

    ctx.fillStyle = '#ff0';
    ctx.beginPath();

    // Draw pacman with mouth based on direction
    let startAngle = 0;
    let endAngle = 2 * Math.PI;

    // Animate mouth opening/closing
    const mouthAnimation = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
    const mouthSize = 0.2 + (mouthAnimation * 0.3);

    switch(pacman.direction) {
        case 'right':
            startAngle = mouthSize * Math.PI;
            endAngle = (2 - mouthSize) * Math.PI;
            break;
        case 'left':
            startAngle = (1 + mouthSize) * Math.PI;
            endAngle = (1 - mouthSize) * Math.PI;
            break;
        case 'up':
            startAngle = (1.5 + mouthSize) * Math.PI;
            endAngle = (1.5 - mouthSize) * Math.PI;
            break;
        case 'down':
            startAngle = (0.5 + mouthSize) * Math.PI;
            endAngle = (0.5 - mouthSize) * Math.PI;
            break;
    }

    ctx.arc(centerX, centerY, CELL_SIZE/2 - 2, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.globalAlpha = 1.0;
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        const centerX = ghost.x * CELL_SIZE + CELL_SIZE/2;
        const centerY = ghost.y * CELL_SIZE + CELL_SIZE/2;

        // Body
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 5, CELL_SIZE/2 - 2, Math.PI, 0);
        ctx.rect(centerX - CELL_SIZE/2 + 2, centerY - 5, CELL_SIZE - 4, CELL_SIZE/2);
        ctx.fill();

        // Bottom wavy part
        ctx.beginPath();
        ctx.moveTo(centerX - CELL_SIZE/2 + 2, centerY + CELL_SIZE/2 - 7);
        for (let i = 0; i < 4; i++) {
            ctx.lineTo(centerX - CELL_SIZE/2 + 2 + (i * 2 + 1) * (CELL_SIZE - 4) / 8, centerY + CELL_SIZE/2 - 2);
            ctx.lineTo(centerX - CELL_SIZE/2 + 2 + (i * 2 + 2) * (CELL_SIZE - 4) / 8, centerY + CELL_SIZE/2 - 7);
        }
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(centerX - 8, centerY - 10, 4, 6);
        ctx.fillRect(centerX + 4, centerY - 10, 4, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 7, centerY - 8, 2, 2);
        ctx.fillRect(centerX + 5, centerY - 8, 2, 2);
    });
}