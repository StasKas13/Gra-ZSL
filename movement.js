// Pobranie elementów
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const image = new Image();
const player = document.getElementById("player");

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight - 5; // Odejmij 5 pikseli od dołu

image.src = "Szkoła/parter.jpg"; // Ścieżka do obrazu

// Aktualizacja rozmiaru canvasu
function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight - 5;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Gracz
player = {
  x: 625,
  y: 790,
  size: 50,
  speed: 6,
  dx: 0,
  dy: 0,
  color: "blue"
};

// Joystick
const joystick = document.getElementById('joystick');
const joystickHandle = document.getElementById('joystickHandle');
let joystickCenter = { x: 0, y: 0 };
let dragging = false;

// Pozycjonowanie joysticka
function updateJoystickCenter() {
  const rect = joystick.getBoundingClientRect();
  joystickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
window.addEventListener('resize', updateJoystickCenter);
window.addEventListener('load', () => setTimeout(updateJoystickCenter, 500)); // Opóźnienie na poprawne ustawienie

// Obsługa dotyku i myszy na joysticku
function handleJoystickStart(event) {
  dragging = true;
  let x = event.clientX || event.touches[0].clientX;
  let y = event.clientY || event.touches[0].clientY;
  handleJoystickMove(x, y);
}

function handleJoystickMove(cursorX, cursorY) {
  if (!dragging) return;

  const dx = cursorX - joystickCenter.x;
  const dy = cursorY - joystickCenter.y;

  // Ograniczenie do okręgu o promieniu 75px
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75);
  const angle = Math.atan2(dy, dx);

  // Ustawienie uchwytu joysticka
  joystickHandle.style.transform = `translate(
    ${Math.cos(angle) * distance}px, 
    ${Math.sin(angle) * distance}px
  )`;

  // Aktualizacja ruchu gracza
  player.dx = Math.cos(angle) * (distance / 75) * player.speed;
  player.dy = Math.sin(angle) * (distance / 75) * player.speed;
}

// Resetowanie joysticka
function resetJoystick() {
  joystickHandle.style.transform = 'translate(-50%, -50%)';
  player.dx = 0;
  player.dy = 0;
  dragging = false;
}

// Obsługa eventów joysticka
joystick.addEventListener('mousedown', handleJoystickStart);
joystick.addEventListener('touchstart', handleJoystickStart);

window.addEventListener('mousemove', (e) => {
  if (dragging) handleJoystickMove(e.clientX, e.clientY);
});
window.addEventListener('touchmove', (e) => {
  if (dragging) handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
});

window.addEventListener('mouseup', resetJoystick);
window.addEventListener('touchend', resetJoystick);

// Aktualizacja pozycji gracza
function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvasWidth) player.x = canvasWidth - player.size;
  if (player.y < 0) player.y = 0;
  if (player.y + player.size > canvasHeight) player.y = canvasHeight - player.size;
}

// Renderowanie
function drawBackground() {
  ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Pętla gry
function gameLoop() {
  clearCanvas();
  drawBackground();
  updatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

// Start gry po załadowaniu obrazu
image.onload = () => {
  updateJoystickCenter();
  gameLoop();
};
