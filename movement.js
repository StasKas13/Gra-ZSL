// Canvas i jego ustawienia
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const image = new Image();

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

image.src = "Szkoła\parter.jpg";

image.addEventListener("load", () =>{
  ctx.drawImage(image,0,0);
})
// Aktualizacja rozmiaru canvasu
function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Gracz
const player = {
  x: 100,
  y: 100,
  size: 50, // Rozmiar gracza (kwadrat)
  color: 'blue',
  speed: 3,
  dx: 0,
  dy: 0,
};

// Joystick
const joystick = document.getElementById('joystick');
const joystickHandle = document.getElementById('joystickHandle');
let joystickCenter = { x: 0, y: 0 }; // Centrum joysticka
let dragging = false;




// Pozycjonowanie joysticka
function updateJoystickCenter() {
  const rect = joystick.getBoundingClientRect();
  joystickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
updateJoystickCenter();
window.addEventListener('resize', updateJoystickCenter);

// Obsługa myszy na joysticku
joystick.addEventListener('mousedown', (e) => {
  dragging = true;
  handleJoystickMove(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => {
  if (dragging) {
    handleJoystickMove(e.clientX, e.clientY);
  }
});
window.addEventListener('mouseup', () => {
  dragging = false;
  resetJoystick();
});

// Obsługa dotyku na joysticku
joystick.addEventListener('touchstart', (e) => {
  dragging = true;
  handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
});
joystick.addEventListener('touchmove', (e) => {
  if (dragging) {
    handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
  }
});
joystick.addEventListener('touchend', () => {
  dragging = false;
  resetJoystick();
});

// Obsługa joysticka
function handleJoystickMove(cursorX, cursorY) {
  const dx = cursorX - joystickCenter.x;
  const dy = cursorY - joystickCenter.y;

  // Ograniczenie uchwytu joysticka do okręgu
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75); // 75 to promień joysticka
  const angle = Math.atan2(dy, dx);

  // Pozycja uchwytu
  joystickHandle.style.transform = `translate(
    ${Math.cos(angle) * distance}px, 
    ${Math.sin(angle) * distance}px
  )`;

  // Oblicz kierunek ruchu
  player.dx = Math.cos(angle) * (distance / 75) * player.speed;
  player.dy = Math.sin(angle) * (distance / 75) * player.speed;
}

function resetJoystick() {
  joystickHandle.style.transform = 'translate(-50%, -50%)';
  player.dx = 0;
  player.dy = 0;
}

// Aktualizacja pozycji gracza
function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Utrzymanie gracza w obszarze canvasu (z uwzględnieniem jego rozmiaru)
  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvasWidth) player.x = canvasWidth - player.size;
  if (player.y < 0) player.y = 0;
  if (player.y + player.size > canvasHeight) player.y = canvasHeight - player.size;
}

// Renderowanie
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size); // Zawsze kwadrat
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Pętla gry
function gameLoop() {
  clearCanvas(); // Czyść ekran
  updatePlayer(); // Zaktualizuj gracza
  drawPlayer(); // Narysuj gracza
  requestAnimationFrame(gameLoop); // Kontynuuj pętlę
}

// Start gry
gameLoop();


function isInsideImage(x, y) {
  const imgData = ctx.getImageData(x, y, 1, 1).data;
  return !(imgData[0] === 0 && imgData[1] === 0 && imgData[2] === 0); // Odrzuca białe piksele
}

canvas.addEventListener('mousemove', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  if (isInsideImage(x, y)) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, 5, 5);
  }
});