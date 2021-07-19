    }

    if (
        ball.y * height > height - width / 200 ||
        ball.y * height < width / 200
    ) {
        ball.angle += 2 * (Math.PI - ball.angle);
    }
    if (ball.x * width > width - width / 200) {
        ++playerScore;
        resetBall();
        resetPaddles();
    } else if (ball.x * width < width / 200) {
        ++enemyScore;
        resetBall();
        resetPaddles();
    }

    if (
        Math.abs(ball.x - 1 / 20) < 1 / 100 &&
        Math.abs(ball.y - playerY) < 1 / 8
    ) {
        ball.angle = (ball.y - playerY) * Math.PI * 2 * 1.6;
        ball.speed *= 1.02;
    } else if (
        Math.abs(ball.x - 19 / 20) < 1 / 100 &&
        Math.abs(ball.y - enemyY) < 1 / 8
    ) {
        ball.angle =
            2 * Math.PI - (ball.y - enemyY) * Math.PI * 2 * 1.6 + Math.PI;
        ball.speed *= 1.02;
    }

    ball.y = clamp(ball.y * height, width / 200, height - width / 200) / height;
}

function handleInput() {
    switch (currentKey) {
        case 38:
            playerY -= ((1 / 130) * ball.speed) / 0.007;
            break;
