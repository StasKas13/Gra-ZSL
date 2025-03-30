const playerElement = document.getElementById("player");
const joystick = document.getElementById("joystick");
const joystickHandle = document.getElementById("joystickHandle");

let dragging = false, joystickCenter = { x: 0, y: 0 };
let player = { x: 625, y: 790, speed: 6, dx: 0, dy: 0 };
let lastRoom = null;
let hasAnswered = false; // Zmienna zapobiegająca wielokrotnemu losowaniu pytania

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
    if (!playerElement || questionBox.style.display === "block") return; // Nie pokazuj nowego pytania, jeśli jedno już trwa


    const charRect = playerElement.getBoundingClientRect();
    const rooms = document.querySelectorAll(".room");

    let inRoom = false;

    rooms.forEach((room) => {
        
        const roomRect = room.getBoundingClientRect();
        if (
            charRect.left < roomRect.right &&
            charRect.right > roomRect.left &&
            charRect.top < roomRect.bottom &&
            charRect.bottom > roomRect.top
        ) {
            inRoom = true;
            if (lastRoom === room.id) return; // Jeśli już byliśmy w tym pokoju, nie losujemy nowego pytania
            lastRoom = room.id; // Zapisujemy pokój, żeby nie losować kolejnego pytania
            hasAnswered = false; // Resetujemy odpowiedź po wejściu do nowej sali

            const subject = room.dataset.subject;
            const question = window.getQuestion(subject);
            if (question) {
                showQuestion(subject, question); // Wyświetl jedno pytanie
            } else {
                alert(`Brak pytań dla ${subject}`);
            }
        }
        
    });

    if (!inRoom) {
        lastRoom = null; // Gracz opuścił pokój, resetujemy lastRoom, żeby mógł odpowiedzieć na nowe pytanie
    }
};

// ** Pytania i sprawdzanie odpowiedzi **
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answers");

const showQuestion = (subject, question) => {
    if (hasAnswered) return; // Jeśli już odpowiedzieliśmy, nie pokazujemy kolejnego pytania

    questionText.textContent = `Pytanie z ${subject}: ${question.pytanie}`;
    answersContainer.innerHTML = ""; // Czyścimy poprzednie odpowiedzi

    question.odpowiedzi.forEach((odp, index) => {
        const answerBtn = document.createElement("button");
        answerBtn.textContent = odp;
        answerBtn.classList.add("answer-button");
        answerBtn.addEventListener("click", () => checkAnswer(index, question.poprawna));
        answersContainer.appendChild(answerBtn);
    });

    questionBox.style.display = "block"; // Pokazujemy pytanie
};

// Funkcja sprawdzająca poprawność odpowiedzi
const checkAnswer = (chosenIndex, correctIndex) => {
    if (hasAnswered) return; // Zapobiegamy wielokrotnemu odpowiadaniu

    hasAnswered = true; // Oznaczamy, że odpowiedzieliśmy

    if (chosenIndex === correctIndex) {
        alert("✅ Poprawna odpowiedź!");
    } else {
        alert("❌ Zła odpowiedź!");
    }

    questionBox.style.display = "none"; // Ukrywamy pytanie po odpowiedzi
};

// ** Obsługa joysticka **
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

// ** Główna pętla gry **
const gameLoop = () => {
    updatePlayer();
    requestAnimationFrame(gameLoop);
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
