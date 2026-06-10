const intro = document.querySelector('#introScene');
const celebration = document.querySelector('#celebrationScene');
const letterScene = document.querySelector('#letterScene');
const startBtn = document.querySelector('#startBtn');
const envelope = document.querySelector('#envelopeBtn');
const letter = document.querySelector('#letterCard');
const canvas = document.querySelector('#confettiCanvas');
const petalsRoot = document.querySelector('#petals');
const bgMusic = document.querySelector('#bgMusic');
const ctx = canvas.getContext('2d');

let confetti = [];
let rafId;
let petalTimer;

function setScene(scene) {
  [intro, celebration, letterScene].forEach((item) => item.classList.remove('active'));
  scene.classList.add('active');
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createConfetti() {
  const count = Math.min(240, Math.floor(window.innerWidth / 4));
  const palette = ['#a31355', '#d83d83', '#f5ddb0', '#c79b45', '#ffffff', '#ff9fc8'];

  confetti = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    size: 5 + Math.random() * 9,
    length: 8 + Math.random() * 18,
    speed: 2.1 + Math.random() * 4.8,
    drift: -1.8 + Math.random() * 3.6,
    rotation: Math.random() * 360,
    spin: -7 + Math.random() * 14,
    color: palette[Math.floor(Math.random() * palette.length)],
    shape: Math.random() > 0.72 ? 'circle' : 'rect'
  }));
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift + Math.sin(piece.y * 0.018) * 0.45;
    piece.rotation += piece.spin;

    if (piece.y > window.innerHeight + 40) {
      piece.y = -40;
      piece.x = Math.random() * window.innerWidth;
    }

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.rotation * Math.PI) / 180);
    ctx.fillStyle = piece.color;

    if (piece.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-piece.size / 2, -piece.length / 2, piece.size, piece.length);
    }

    ctx.restore();
  });

  rafId = requestAnimationFrame(drawConfetti);
}

function startConfetti() {
  resizeCanvas();
  createConfetti();
  cancelAnimationFrame(rafId);
  drawConfetti();
}

function stopConfetti() {
  cancelAnimationFrame(rafId);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function releasePetal() {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
  petal.style.animationDuration = `${7 + Math.random() * 6}s`;
  petal.style.transform = `rotate(${Math.random() * 180}deg)`;
  petalsRoot.appendChild(petal);
  setTimeout(() => petal.remove(), 13500);
}

function startPetals() {
  clearInterval(petalTimer);
  for (let i = 0; i < 14; i += 1) setTimeout(releasePetal, i * 160);
  petalTimer = setInterval(releasePetal, 520);
}

startBtn.addEventListener('click', () => {
  setScene(celebration);
  startConfetti();
  if (bgMusic) bgMusic.play().catch(e => console.log('Audio playback failed:', e));

  setTimeout(() => {
    stopConfetti();
    setScene(letterScene);
    startPetals();
  }, 6200);
});

envelope.addEventListener('click', () => {
  envelope.classList.add('open');
  setTimeout(() => letter.classList.add('show'), 720);
});

window.addEventListener('resize', () => {
  resizeCanvas();
  if (celebration.classList.contains('active')) createConfetti();
});

resizeCanvas();
