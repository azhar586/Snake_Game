const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const newGameBtn = document.getElementById("newGameBtn");
const highScoreDisplay = document.getElementById("high-score");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let highScore = 0;
let gameInterval;

// Dynamically set canvas size based on window width
const resizeCanvas = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    canvas.width = Math.min(screenWidth, 400);  // Max width 400px, but adapts to smaller screens
    canvas.height = Math.min(screenHeight, 400); // Max height 400px, but adapts to smaller screens
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw fruit (fixing disappearance issue)
    const foodImg = new Image();
    foodImg.src = "apple.png"; // Ensure the file is in the same directory
    foodImg.onload = () => {
        ctx.drawImage(foodImg, food.x, food.y, box, box);
    };

    // Move snake
    let head = { ...snake[0] };
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Collision detection
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Eating food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverScreen.style.display = "block";
    finalScore.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function startGame() {
    gameOverScreen.style.display = "none";
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    gameInterval = setInterval(drawGame, 300); // Slower speed
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Touch controls
document.getElementById("up").addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});

newGameBtn.addEventListener("click", startGame);

startGame();

