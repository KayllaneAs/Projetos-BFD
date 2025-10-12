const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// grade
const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let obstacles = [];
let score = 0;
let speed = 120;
let gameInterval = null;
let running = false;
let level = 'facil';

// --- sons
const eatSound = new Audio('sons/soundEat.wav');
const gameOverSound = new Audio('sons/soundGameOver.wav');
const musicBackground = new Audio('sons/musica_fundo.mp3');
musicBackground.loop = true; // deixa tocando em loop
musicBackground.volume = 0.3; // volume moderado

// --- gera comida
function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  for (let s of snake.concat(obstacles)) {
    if (s.x === food.x && s.y === food.y) {
      placeFood();
      return;
    }
  }
}

// --- gera obstáculos
function generateObstacles() {
  obstacles = [];
  if (level === 'medio' || level === 'dificil') {
    for (let i = 0; i < 5; i++) {
      obstacles.push({
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        dx: Math.random() < 0.5 ? 1 : -1,
        dy: Math.random() < 0.5 ? 1 : -1
      });
    }
  }
}

// --- desenha
function draw() {
  // fundo quadriculado suave
  for (let y = 0; y < tileCount; y++) {
    for (let x = 0; x < tileCount; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#c8f8c0' : '#b8efb0';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // comida 
  ctx.font = `${tileSize}px Arial`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('🍎', food.x * tileSize, food.y * tileSize);

  // cobra
  ctx.fillStyle = '#27ae60';
  for (let s of snake) {
    ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize - 1, tileSize - 1);
  }

  // obstáculos com glow
  for (let o of obstacles) {
    const glow = Math.floor(50 + Math.random() * 80);
    ctx.fillStyle = `rgb(230, 126, 34, 0.9)`;
    ctx.shadowColor = `rgba(255, 180, 80, 0.6)`;
    ctx.shadowBlur = glow / 3;
    ctx.fillRect(o.x * tileSize, o.y * tileSize, tileSize - 1, tileSize - 1);
    ctx.shadowBlur = 0;
  }
}

// --- atualiza obstáculos
function updateObstacles() {
  if (level === 'facil') return;

  if (Math.random() < 0.25) {
    for (let o of obstacles) {
      o.x += o.dx;
      o.y += o.dy;

      if (o.x < 0 || o.x >= tileCount) o.dx *= -1;
      if (o.y < 0 || o.y >= tileCount) o.dy *= -1;

      o.x = Math.round(o.x);
      o.y = Math.round(o.y);

      // se obstáculo colidir com cobra, mata imediatamente
      if (snake.some(s => s.x === o.x && s.y === o.y)) {
        gameOver();
        return;
      }
    }
  }
}


// --- atualiza jogo
function update() {
  if (!running) return;

  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // colisões
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let s of snake) {
    if (s.x === head.x && s.y === head.y) {
      gameOver();
      return;
    }
  }

  for (let o of obstacles) {
    if (o.x === head.x && o.y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  // comer comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    eatSound.currentTime = 0;
    eatSound.play();
    placeFood();

    if (level === 'dificil') speed = Math.max(50, speed - 3);
  } else {
    snake.pop();
  }

  updateObstacles();
  draw();
}

// --- Game Over
function gameOver() {
  musicBackground.pause();
  running = false;
  clearInterval(gameInterval);
  gameOverSound.currentTime = 0;
  gameOverSound.play();

  document.getElementById('final-score').innerText = score;
  document.querySelector('.game-over-screen').style.display = 'flex';
}

// --- start
function start() {
  if (running) return;
  running = true;
  musicBackground.currentTime = 0;
  musicBackground.play();
  clearInterval(gameInterval);
  gameInterval = setInterval(update, speed);
}

// --- pause
function pause() {
  running = false;
  clearInterval(gameInterval);
}

// --- restart (reinicia estado, mas só começa quando clicar em iniciar)
function restart() {
  document.querySelector('.game-over-screen').style.display = 'none';
  running = false;
  clearInterval(gameInterval);

  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  document.getElementById('score').innerText = score;
  speed = parseInt(document.getElementById('speed').value, 10);
  placeFood();
  generateObstacles();
  musicBackground.currentTime = 0;
  musicBackground.play();
  draw();
}

// --- teclado
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': nextDir = { x: 0, y: -1 }; break;
    case 'ArrowDown': case 's': case 'S': nextDir = { x: 0, y: 1 }; break;
    case 'ArrowLeft': case 'a': case 'A': nextDir = { x: -1, y: 0 }; break;
    case 'ArrowRight': case 'd': case 'D': nextDir = { x: 1, y: 0 }; break;
  }
});

// botões
document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('restart').addEventListener('click', restart);
document.getElementById('restart-go').addEventListener('click', restart);

document.getElementById('speed').addEventListener('change', (e) => {
  speed = parseInt(e.target.value, 10);
  if (running) {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
  }
});

// inicializa
window.addEventListener('load', () => {
  placeFood();
  generateObstacles();
  draw();
});
