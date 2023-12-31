//board
const blockSize = 25;
const rows = 20;
const cols = 20;
let board;
let context;

//snake variables
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let velocityX = 0;
let velocityY = 0;

//snake body
let snakeBody = [];

//food variables
let foodX;
let foodY;
let score = 0;

let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.width = blockSize * cols;
    board.height = blockSize * rows;
    context = board.getContext("2d"); //context is the object that is used to draw on the canvas

    placeFood();
    document.addEventListener("keydown", changeDirection);
    //update();
    setInterval(update, 1000 / 10);//10 frames per second
}

function update() {
    if (gameOver) {
        let gameOverVar = document.getElementById("game-over");
        gameOverVar.innerHTML = "Game Over";
        return;
    }

    context.fillStyle = "rgb(43, 44, 50)";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "orangered";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        placeFood();
        document.getElementById("score").innerHTML = score;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i][0] = snakeBody[i - 1][0];
        snakeBody[i][1] = snakeBody[i - 1][1];
    }

    if (snakeBody.length) {
        snakeBody[0][0] = snakeX;
        snakeBody[0][1] = snakeY;
    }
    
    context.fillStyle = "rgb(53, 129, 76)";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //check if snake is out of bounds
    if (snakeX < 0 || snakeX >= board.width || snakeY < 0 || snakeY >= board.height) {
        gameOver = true;
    }

    //check if snake is eating itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
        }
    }
}

function changeDirection(event) {
    if (event.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function restart() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;

    velocityX = 0;
    velocityY = 0;

    snakeBody = [];

    score = 0;
    document.getElementById("score").innerHTML = score;

    gameOver = false;
    let gameOverVar = document.getElementById("game-over");
    gameOverVar.innerHTML = "";
}
