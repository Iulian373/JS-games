//board
let board;
const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
let context;

//player
const PLAYER_WIDTH = 80; //500 for testing, 80 for normal
const PLAYER_HEIGHT = 10;
const PLAYER_SPEED = 15;

let player = {
    x: BOARD_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: BOARD_HEIGHT - PLAYER_HEIGHT - 5,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED
}

//ball
const BALL_WIDTH = 10;
const BALL_HEIGHT = 10;
const BALL_SPEED_X = 3; //15 for testing, 3 for normal
const BALL_SPEED_Y = 2; //10 for testing, 2 for normal

let ball = {
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT / 2,
    width: BALL_WIDTH,
    height: BALL_HEIGHT,
    speedX: BALL_SPEED_X,
    speedY: BALL_SPEED_Y
}

//blocks
let blockArray = [];
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 10;
let blockColumns = 8;
let blockRows = 3;
const BLOCK_MAX_ROWS = 10;
let blockCount = blockColumns * blockRows;

//starting position of blocks
const BLOCK_START_X = 15;
const BLOCK_START_Y = 45;

//score
let score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = BOARD_HEIGHT;
    board.width = BOARD_WIDTH;
    context = board.getContext("2d");

    //draw initial player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(upadate);
    document.addEventListener("keydown", movePlayer);

    //create blocks
    createBlocks();
}

function upadate() {
    requestAnimationFrame(upadate);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    //player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //check for collision with borders
    if (ball.y <= 0) {
        ball.speedY *= -1;
    } else if (ball.x <= 0 || ball.x + ball.width >= BOARD_WIDTH) {
        ball.speedX *= -1;
    } else if (ball.y + ball.height >= BOARD_HEIGHT) {
        //game over
        context.font = "27px sans-serif";
        context.fillText("Game Over : Press 'Space' to restart", 30, 250);
        gameOver = true;
    }

    //check for collision with player
    if (topCollision(ball, player)) {
        ball.speedY *= -1;
    } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.speedX *= -1;
    }

    //draw blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                ball.speedY *= -1;
                block.break = true;
                blockCount--;
                score += 10;
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                ball.speedX *= -1;
                block.break = true;
                blockCount--;
                score += 10;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //check for next level
    if (blockCount == 0) {
        score += 100 * blockRows;
        Math.min(blockRows++, BLOCK_MAX_ROWS);
        createBlocks();
    }

    //draw score
    context.font = "20px sans-serif";
    context.fillText("Score: " + score, 10, 20);
}

function outOfBounds(xPosition) {
    return xPosition < 0 || xPosition + PLAYER_WIDTH > BOARD_WIDTH;
}

function movePlayer(event) {
    if (gameOver) {
        if (event.code == "Space") {
            restartGame();
        }
    }
    if (event.key == "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key == "ArrowRight" && player.x + player.width < BOARD_WIDTH) {
        player.x += player.speed;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && ball.y <= (block.y + block.height);
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && ball.x <= (block.x + block.width);
}

function createBlocks() {
    blockArray = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: BLOCK_START_X + (c * BLOCK_WIDTH) + (c * 10),
                y: BLOCK_START_Y + (r * BLOCK_HEIGHT) + (r * 10),
                width: BLOCK_WIDTH,
                height: BLOCK_HEIGHT,
                break: false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function restartGame() {
    gameOver = false;
    score = 0;
    blockRows = 3;
    blockArray = [];
    player = {
        x: BOARD_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: BOARD_HEIGHT - PLAYER_HEIGHT - 5,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: PLAYER_SPEED
    }
    ball = {
        x: BOARD_WIDTH / 2,
        y: BOARD_HEIGHT / 2,
        width: BALL_WIDTH,
        height: BALL_HEIGHT,
        speedX: BALL_SPEED_X,
        speedY: BALL_SPEED_Y
    }
    createBlocks();
}