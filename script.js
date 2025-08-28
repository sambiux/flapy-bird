const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cargar imagen del pájaro
const birdImage = new Image();
birdImage.src = 'images/bird.png'; // Asegúrate de tener esta imagen en la carpeta correcta

// Bird
let bird = {
  x: 80,
  y: 150,
  width: 30,
  height: 30,
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

    // Colisión
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }

    // Puntaje
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

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

// Función para que el pájaro "vuele"
function flap() {
  bird.velocity = bird.lift;
  if (gameOver) {
    // Reiniciar juego
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    gameLoop();
  }
}

// Eventos para móvil y desktop

// Toque en móvil
window.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Evita scroll o zoom al tocar
  flap();
}, { passive: false });

// Click en desktop
window.addEventListener('click', (e) => {
  flap();
});

// Teclado (barra espaciadora)
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    flap();
  }
});

// Iniciar juego cuando se cargue la imagen
birdImage.onload = function () {
  gameLoop();
};

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
        console.log('Service Worker registrado con éxito:', reg.scope);
      })
      .catch(err => {
        console.error('Error al registrar el Service Worker:', err);
      });
  });
}
