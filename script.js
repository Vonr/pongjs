var body = document.body;
var two = new Two({ fullscreen: true }).appendTo(body);
var width = $(window).width();
var height = $(window).height();
var playerY = 0.5;
var playerScore = 0;
var enemyY = 0.5;
var enemyScore = 0;
var ball = { x: 0.5, y: 0.5, angle: 0, speed: 0.007 };
var currentKey = -1;
var clicking = false;
var mouseY = -1;

var difficulty = 0.83;
var speedLimit = 0.017;

function gameLoop() {
    setTimeout(function () {
        width = $(window).width();
        height = $(window).height();

        handleBall();
        handleInput();
        handleEnemy();
        clampPositions();
        render();

        gameLoop();
    }, (1 / 60) * 1000);
}

document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        case 38:
            currentKey = 38;
            break;
        case 40:
            currentKey = 40;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.keyCode) {
        case 38:
            if (currentKey == 38) currentKey = -1;
            break;
        case 40:
            if (currentKey == 40) currentKey = -1;
            break;
    }
});

document.addEventListener("mousedown", (event) => {
    clicking = true;
    mouseY = event.offsetY;
});

document.addEventListener("mouseup", (event) => {
    clicking = false;
});

document.addEventListener("mousemove", (event) => {
    mouseY = event.offsetY;
});

document.addEventListener("touchstart", (event) => {
    clicking = true;
    mouseY = event.touches[0].pageY;
});

document.addEventListener("touchend", (event) => {
    clicking = false;
});

document.addEventListener("touchcancel", (event) => {
    clicking = false;
});

document.addEventListener("touchmove", (event) => {
    mouseY = event.touches[0].pageY;
});

function handleBall() {
    ball.speed = Math.min(ball.speed * 1.0001, speedLimit);

    ball.x += ball.speed * Math.cos(ball.angle);
    ball.y += ball.speed * Math.sin(ball.angle);

    while (ball.angle < 0) {
        ball.angle += Math.PI * 2;
    }

    while (ball.angle > Math.PI * 2) {
        ball.angle -= Math.PI * 2;
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
        case 40:
            playerY += ((1 / 130) * ball.speed) / 0.007;
            break;
        case -1:
            if (clicking) {
                if (mouseY > height / 2) {
                    playerY += ((1 / 130) * ball.speed) / 0.007;
                } else {
                    playerY -= ((1 / 130) * ball.speed) / 0.007;
                }
            }
            break;
    }
}

function handleEnemy() {
    if (ball.angle < Math.PI / 2 || ball.angle > (Math.PI * 3) / 2) {
        if (Math.random() > difficulty) return;

        if (ball.y - enemyY > 0.12) {
            enemyY += ((1 / 130) * ball.speed) / 0.007;
        } else if (enemyY - ball.y > 0.12) {
            enemyY -= ((1 / 130) * ball.speed) / 0.007;
        }
    } else {
        if (0.5 - enemyY > 0.01) {
            enemyY += ((1 / 130) * ball.speed) / 0.007;
        } else if (enemyY - 0.5 > 0.01) {
            enemyY -= ((1 / 130) * ball.speed) / 0.007;
        }
    }
}

function clampPositions() {
    playerY = clamp(height * playerY, height / 8, height - height / 8) / height;
    enemyY = clamp(height * enemyY, height / 8, height - height / 8) / height;
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function render() {
    two.clear();
    var playerPaddle = two.makeRectangle(
        width / 20,
        height * playerY,
        width / 100,
        height / 4
    );
    playerPaddle.stroke = "white";

    var enemyPaddle = two.makeRectangle(
        width - width / 20,
        height * enemyY,
        width / 100,
        height / 4
    );
    enemyPaddle.stroke = "white";

    var splitLine = two.makeRectangle(
        width / 2,
        height / 2,
        width / 80,
        height
    );
    splitLine.stroke = "gray";
    splitLine.fill = "gray";

    var playerScoreText = two.makeText(
        playerScore,
        width / 4,
        width / 20,
        "normal"
    );
    playerScoreText.stroke = "gray";
    playerScoreText.fill = "gray";
    playerScoreText.scale = width / 250;

    var enemyScoreText = two.makeText(
        enemyScore,
        width - width / 4,
        width / 20,
        "normal"
    );
    enemyScoreText.stroke = "gray";
    enemyScoreText.fill = "gray";
    enemyScoreText.scale = width / 250;

    var ballObject = two.makeCircle(
        ball.x * width,
        ball.y * height,
        width / 200
    );

    var red = ((ball.speed - 0.007) / (speedLimit - 0.007)) * 255;

    ballObject.stroke = "rgb(" + red + ", " + (255 - red) + ", 0)";
    ballObject.fill = "rgb(" + red + ", " + (255 - red) + ", 0)";

    // var ballInfo = two.makeText(ball.angle, ball.x * width, (ball.y + 0.1) * height, 'normal');
    // ballInfo.stroke = 'gray'
    // ballInfo.fill = 'gray'

    two.update();
}

function resetBall() {
    ball.x = 0.5;
    ball.y = 0.5;
    ball.angle =
        Math.random() * 0.7 * Math.PI -
        1.4 * Math.PI +
        Math.floor(Math.random() * 2) * Math.PI;
    ball.speed = 0.007;
}

function resetPaddles() {
    playerY = 0.5;
    enemyY = 0.5;
}

resetBall();
resetPaddles();
gameLoop();
