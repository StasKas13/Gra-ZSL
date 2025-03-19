const playerElement = document.getElementById("player");
const joystick = document.getElementById('joystick');
const joystickHandle = document.getElementById('joystickHandle');
const gameArea = document.getElementById("all");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definicja borderów (przeszkody na mapie)
const borders = [
  { x: 50, y: 50, width: 300, height: 20 },
  { x: 400, y: 200, width: 200, height: 20 },
  { x: 600, y: 400, width: 250, height: 20 },
  { x: 100, y: 500, width: 150, height: 20 }
];

// Rysowanie borderów na canvasie
function drawBorders() {
  ctx.fillStyle = "red";
  borders.forEach(border => {
    ctx.fillRect(border.x, border.y, border.width, border.height);
  });
}

let player = { x: 625, y: 790, speed: 6, dx: 0, dy: 0, width: 50, height: 50 };
let joystickCenter = { x: 0, y: 0 }, dragging = false;

//  Aktualizacja pozycji joysticka
const updateJoystickCenter = () => {
  const rect = joystick.getBoundingClientRect();
  joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

//  Obsługa joysticka
const handleJoystickMove = (x, y) => {
  if (!dragging) return;

  const dx = x - joystickCenter.x;
  const dy = y - joystickCenter.y;
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75);
  const angle = Math.atan2(dy, dx);

  joystickHandle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
  player.dx = Math.cos(angle) * (distance / 75) * player.speed;
  player.dy = Math.sin(angle) * (distance / 75) * player.speed;
};

//  Resetowanie joysticka
const resetJoystick = () => {
  joystickHandle.style.transform = 'translate(-50%, -50%)';
  player.dx = player.dy = 0;
  dragging = false;
};

// Funkcja sprawdzająca kolizję gracza z borderami
function checkCollision(x, y) {
  return borders.some(border =>
    x < border.x + border.width &&
    x + player.width > border.x &&
    y < border.y + border.height &&
    y + player.height > border.y
  );
}

//  Aktualizacja pozycji gracza
const updatePlayer = () => {
  const newX = player.x + player.dx;
  const newY = player.y + player.dy;

  if (!checkCollision(newX, player.y)) {
    player.x = newX;
  }
  if (!checkCollision(player.x, newY)) {
    player.y = newY;
  }

  playerElement.style.left = `${player.x}px`;
  playerElement.style.top = `${player.y}px`;
};

//  Pętla gry
const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Czyszczenie ekranu
  drawBorders(); // Rysowanie borderów
  updatePlayer();
  requestAnimationFrame(gameLoop);
};

//  Eventy joysticka
joystick.addEventListener('mousedown', e => { dragging = true; handleJoystickMove(e.clientX, e.clientY); });
joystick.addEventListener('touchstart', e => { dragging = true; handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY); });

window.addEventListener('mousemove', e => { if (dragging){ handleJoystickMove(e.clientX, e.clientY); }});
window.addEventListener('touchmove', e => { if (dragging) handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY); });

window.addEventListener('mouseup', resetJoystick);
window.addEventListener('touchend', resetJoystick);

//  Start gry
window.onload = () => { updateJoystickCenter(); gameLoop(); };
window.addEventListener('resize', updateJoystickCenter);