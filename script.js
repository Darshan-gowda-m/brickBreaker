let board;
let context; 

let playerWidth = 80; 
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x: 0,
    y: 0,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
};

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2; 

let ball = {
    x: 0,
    y: 0,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
};

let blockArray = [];
let blockWidth = 50;
let blockHeight = 20; 
let blockColumns;
let blockRows = 5; s
let blockMaxRows = 10; 
let blockCount = 0;

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    resizeCanvas();
    context = board.getContext("2d");
    
    player.y = board.height - player.height - 5;
    player.x = (board.width - player.width) / 2;

    ball.x = (board.width - ball.width) / 2;
    ball.y = (board.height - ball.height) / 2;

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    createBlocks();
};

window.onresize = resizeCanvas;

function resizeCanvas() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    player.y = board.height - player.height - 5;
    player.x = (board.width - player.width) / 2;
    ball.x = (board.width - ball.width) / 2;
    ball.y = (board.height - ball.height) / 2;
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillStyle = "white";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   
    } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   
    }

    if (ball.y <= 0) { 
        ball.velocityY *= -1;
    } else if (ball.x <= 0 || (ball.x + ball.width >= board.width)) {
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= board.height) {
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", board.width / 4, board.height / 2);
        gameOver = true;
    }

    context.fillStyle = "skyblue";
    for (let block of blockArray) {
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     
                ball.velocityY *= -1;   
                score += 100;
                blockCount -= 1;
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;     
                ball.velocityX *= -1;   
                score += 100;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    if (blockCount == 0) {
        score += 100 * blockRows * blockColumns;
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > board.width);
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    } else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
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
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; 
    blockCount = 0;

    // Calculate the number of columns based on canvas width
    blockColumns = Math.floor(board.width / (blockWidth + 10)); 

    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: 15 + c * (blockWidth + 10), 
                y: 45 + r * (blockHeight + 10), 
                width: blockWidth,
                height: blockHeight,
                break: false
            };
            blockArray.push(block);
            blockCount++;
        }
    }
}

function resetGame() {
    gameOver = false;
    player = {
        x: (board.width - playerWidth) / 2,
        y: board.height - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    };
    ball = {
        x: (board.width - ballWidth) / 2,
        y: (board.height - ballHeight) / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    };
    blockArray = [];
    blockRows = 5; 
    score = 0;
    createBlocks();
}
