const canvas = document.getElementById("flappyCanvas");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElem = document.getElementById("finalScore");
const playAgainButton = document.getElementById("playAgainButton");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const pipeImage = new Image();
pipeImage.src = 'pipe.png'; // Replace with the actual path to your pipe image


const GRAVITY = 0.5;
const FLAP = -8;
const SPAWN_RATE = 90; // in frames

let bird = {
    x: canvas.width / 5,
    y: canvas.height / 2,
    velocity: 0
};

let pipes = [];
let score = 0;
let frames = 0;
let gameOver = false;


const birdImage = new Image();
birdImage.src = 'bird.png'; // Replace with the actual path to your bird image


const BIRD_WIDTH = 40; // Adjust this width as needed
const BIRD_HEIGHT = 40; // Adjust this height as needed

function drawBird() {
    ctx.drawImage(birdImage, bird.x - BIRD_WIDTH / 2, bird.y - BIRD_HEIGHT / 2, BIRD_WIDTH, BIRD_HEIGHT);
}



function updateBird() {
    if (!gameOver) {
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;

        if (bird.y < 0) {
            bird.y = 0;
            bird.velocity = 0;
        }

        if (bird.y > canvas.height) {
            bird.y = canvas.height;
            bird.velocity = 0;
        }
    }
}

function drawPipe(pipe) {
    // Draw the upper part of the pipe
    ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.gapStart);

    // Draw the lower part of the pipe
    ctx.drawImage(pipeImage, pipe.x, pipe.gapStart + pipe.gapSize, pipe.width, canvas.height - pipe.gapStart - pipe.gapSize);
}


function showGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
    
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 + 20);
}

function updatePipes() {
    if (frames % SPAWN_RATE === 0) {
        let gapStart = Math.random() * (canvas.height - 300) + 50;
        let newPipe = {
            x: canvas.width,
            width: 50,
            gapStart: gapStart,
            gapSize: 100,
            passed: false
        };
        pipes.push(newPipe);
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;
      


        if (bird.x > pipes[i].x && bird.x < pipes[i].x + pipes[i].width) {
            if (bird.y < pipes[i].gapStart || bird.y > pipes[i].gapStart + pipes[i].gapSize) {
                // Game Over
showGameOver();
gameOver = true;
return;

            } else if (!pipes[i].passed) {
                pipes[i].passed = true;
                score++;
            }
        }

        if (pipes[i].x + pipes[i].width <= 0) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pipes.forEach(pipe => drawPipe(pipe));

    if (!gameOver) {
        drawBird();
        updateBird();
        updatePipes();
        frames++;
        requestAnimationFrame(draw);
    } else {
        showGameOver();
        scoreDisplay.textContent = "Score: " + score; // Update the score display
    }

    scoreDisplay.textContent = "Score: " + score; // Update the score display while playing
}







document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") {
        bird.velocity = FLAP;
    }
});

draw();
