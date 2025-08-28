const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cargar imagen del pájaro
const birdImage = new Image();
birdImage.src = 'images/pajaro.png'; // Ruta de la imagen

// Bird
let bird = {
  x: 120,
  y: 150,
  width: 30,   // Ajusta el tamaño de acuerdo con la imagen
  height: 30,  // Ajusta el tamaño de acuerdo con la imagen
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

// Pipes
let pipes = [];
let frame = 0;
const pipeGap = 130;
const pipeWidth = 60;

// Game
let score = 0;
let gameOver = false;

function drawBird() {
  // Dibuja la imagen del pájaro en vez de un rectángulo
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
  });
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    gameOver = true;
  }

  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

function updatePipes() {
  if (frame % 90 === 0) {
    let top = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({ x: canvas.width, top });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Check collision
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }

    // Update score
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  // Remove pipes off screen
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "48px Arial";
  ctx.fillText("Game Over", 80, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 150, canvas.height / 2 + 40);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  if (!gameOver) {
    updateBird();
    updatePipes();
    frame++;
    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
    if (gameOver) {
      // Reset game
      bird.y = 150;
      bird.velocity = 0;
      pipes = [];
      frame = 0;
      score = 0;
      gameOver = false;
      gameLoop();
    }
  }
});

// Start the game when the image is loaded
birdImage.onload = function() {
  gameLoop();
};
