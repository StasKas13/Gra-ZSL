const playerElement = document.getElementById("player");
const joystick = document.getElementById("joystick");
const joystickHandle = document.getElementById("joystickHandle");

let dragging = false, joystickCenter = { x: 0, y: 0 };
let player = { x: 625, y: 790, speed: 6, dx: 0, dy: 0 };
let lastRoom = null;

const updateJoystickCenter = () => {
    const rect = joystick.getBoundingClientRect();
    joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const handleJoystickMove = (x, y) => {
    if (!dragging) return;
    const dx = x - joystickCenter.x, dy = y - joystickCenter.y;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75);
    const angle = Math.atan2(dy, dx);
    
    joystickHandle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    
    player.dx = Math.cos(angle) * (distance / 75) * player.speed;
    player.dy = Math.sin(angle) * (distance / 75) * player.speed;
};

const startDrag = (e) => {
    dragging = true;
    const touch = e.touches ? e.touches[0] : e;
    handleJoystickMove(touch.clientX, touch.clientY);
};

const moveDrag = (e) => {
    if (!dragging) return;
    const touch = e.touches ? e.touches[0] : e;
    handleJoystickMove(touch.clientX, touch.clientY);
};

const stopDrag = () => {
    joystickHandle.style.transform = "translate(-50%, -50%)";
    player.dx = player.dy = 0;
    dragging = false;
};

const checkCollision = () => {
    if (!playerElement) return;
    const charRect = playerElement.getBoundingClientRect();
    const rooms = document.querySelectorAll(".room");

    rooms.forEach((room) => {
        const roomRect = room.getBoundingClientRect();
        if (
            charRect.left < roomRect.right &&
            charRect.right > roomRect.left &&
            charRect.top < roomRect.bottom &&
            charRect.bottom > roomRect.top
        ) {
            if (lastRoom === room.id) return;
            lastRoom = room.id;
            setTimeout(() => { lastRoom = null; }, 2000);

            const subject = room.dataset.subject;
            const question = window.getQuestion(subject);
            if (question) {
                alert(`Pytanie z ${subject}:\n${question.pytanie}\n -> ${question.odpowiedzi.join("\n -> ")}`);
            } else {
                alert(`Brak pytań dla ${subject}`);
            }
        }
    });
};

const updatePlayer = () => {
    player.x = Math.max(0, Math.min(window.innerWidth - 50, player.x + player.dx));
    player.y = Math.max(0, Math.min(window.innerHeight - 50, player.y + player.dy));

    if (playerElement) {
        playerElement.style.left = `${player.x}px`;
        playerElement.style.top = `${player.y}px`;
        checkCollision();
    }
};

window.addEventListener("resize", updateJoystickCenter);

if (joystick && joystickHandle) {
    joystick.addEventListener("mousedown", startDrag);
    joystick.addEventListener("touchstart", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("touchmove", moveDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
}

document.addEventListener("DOMContentLoaded", () => {
    updateJoystickCenter();
    gameLoop();
});

const gameLoop = () => {
    updatePlayer();
    requestAnimationFrame(gameLoop);
};