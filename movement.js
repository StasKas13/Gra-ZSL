const playerElement = document.getElementById("player");
const joystick = document.getElementById('joystick');
const joystickHandle = document.getElementById('joystickHandle');

let player = { x: 625, y: 790, speed: 6, dx: 0, dy: 0 };
let joystickCenter = { x: 0, y: 0 }, dragging = false;

// 🔄 Aktualizacja pozycji joysticka
const updateJoystickCenter = () => {
  const rect = joystick.getBoundingClientRect();
  joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

// 🎮 Obsługa joysticka
const handleJoystickMove = (x, y) => {
  if (!dragging) return;

  const dx = x - joystickCenter.x, dy = y - joystickCenter.y;
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75);
  const angle = Math.atan2(dy, dx);

  joystickHandle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
  player.dx = Math.cos(angle) * (distance / 75) * player.speed;
  player.dy = Math.sin(angle) * (distance / 75) * player.speed;
};

// 🛑 Resetowanie joysticka
const resetJoystick = () => {
  joystickHandle.style.transform = 'translate(-50%, -50%)';
  player.dx = player.dy = 0;
  dragging = false;
};

// 🎥 Aktualizacja pozycji gracza
const updatePlayer = () => {
  player.x = Math.max(0, Math.min(window.innerWidth - 50, player.x + player.dx));
  player.y = Math.max(0, Math.min(window.innerHeight - 50, player.y + player.dy));

  playerElement.style.left = `${player.x}px`;
  playerElement.style.top = `${player.y}px`;
};

// 🔄 Pętla gry
const gameLoop = () => { updatePlayer(); requestAnimationFrame(gameLoop); };

// 🎮 Eventy joysticka
joystick.addEventListener('mousedown', e => { dragging = true; handleJoystickMove(e.clientX, e.clientY); });
joystick.addEventListener('touchstart', e => { dragging = true; handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY); });

window.addEventListener('mousemove', e => { if (dragging) handleJoystickMove(e.clientX, e.clientY); });
window.addEventListener('touchmove', e => { if (dragging) handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY); });

window.addEventListener('mouseup', resetJoystick);
window.addEventListener('touchend', resetJoystick);

// 🚀 Start gry
window.onload = () => { updateJoystickCenter(); gameLoop(); };
window.addEventListener('resize', updateJoystickCenter);
