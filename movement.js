const joystick = document.getElementById("joystick");
const joystickHandle = document.getElementById("joystickHandle");
const blocks = document.querySelectorAll('.block');
const sale = document.getElementById("sale");
const hol = document.getElementById("hol");
const playerElement = document.getElementById("player");

let dragging = false;
let joystickCenter = { x: 0, y: 0 };

let player = {
    x: sale ? sale.offsetLeft : 625,
    y: sale ? sale.offsetTop : 790,
    dx: 0,
    dy: 0,
    speed: 4
};

playerElement.style.left = `${player.x}px`;
playerElement.style.top = `${player.y}px`;

function updateJoystickCenter() {
    const rect = joystick.getBoundingClientRect();
    joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}
window.addEventListener("resize", updateJoystickCenter);

document.addEventListener("DOMContentLoaded", () => {
    updateJoystickCenter();
    gameLoop();
});

function gameLoop() {
    updatePlayer();
    requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    const proposedX = player.x + player.dx;
    const proposedY = player.y + player.dy;

    const playerRect = {
        left: proposedX,
        top: proposedY,
        right: proposedX + playerElement.offsetWidth,
        bottom: proposedY + playerElement.offsetHeight
    };

    if (isInsideAnyBlock(playerRect)) {
        player.x = proposedX;
        player.y = proposedY;
        playerElement.style.left = `${player.x}px`;
        playerElement.style.top = `${player.y}px`;
    }

}

function isInsideAnyBlock(playerRect) {
    for (const block of blocks) {
        const rect = block.getBoundingClientRect();
        const blockRect = {
            left: block.offsetLeft,
            top: block.offsetTop,
            right: block.offsetLeft + block.offsetWidth,
            bottom: block.offsetTop + block.offsetHeight
        };

        if (
            playerRect.left >= blockRect.left &&
            playerRect.right <= blockRect.right &&
            playerRect.top >= blockRect.top &&
            playerRect.bottom <= blockRect.bottom
        ) {
            return true;
        }
    }
    return false;
}

function startDrag(event) {
    dragging = true;
    event.preventDefault();
}

function stopDrag(event) {
    dragging = false;
    player.dx = 0;
    player.dy = 0;
    joystickHandle.style.transform = `translate(0px, 0px)`;
}

function moveDrag(event) {
    if (!dragging) return;

    const evt = event.touches ? event.touches[0] : event;
    const dx = evt.clientX - joystickCenter.x;
    const dy = evt.clientY - joystickCenter.y;

    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
    const angle = Math.atan2(dy, dx);

    const handleX = distance * Math.cos(angle);
    const handleY = distance * Math.sin(angle);

    joystickHandle.style.transform = `translate(${handleX}px, ${handleY}px)`;

    player.dx = Math.cos(angle) * (distance / 40) * player.speed;
    player.dy = Math.sin(angle) * (distance / 40) * player.speed;
}

joystick.addEventListener("mousedown", startDrag);
joystick.addEventListener("touchstart", startDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("touchmove", moveDrag);
window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchend", stopDrag);



// const playerElement = document.getElementById("player");
// const joystick = document.getElementById("joystick");
// const joystickHandle = document.getElementById("joystickHandle");
// const blocks = document.querySelectorAll('.block');

// let dragging = false, joystickCenter = { x: 0, y: 0 };
// const sale = document.getElementById("sale");
// let player = {
//     x: sale ? sale.offsetLeft : 625,
//     y: sale ? sale.offsetTop : 790,
//     speed: 6,
//     dx: 0,
//     dy: 0
// };

// playerElement.style.left = `${player.x}px`;
// playerElement.style.top = `${player.y}px`;
// const updateJoystickCenter = () => {
//     const rect = joystick.getBoundingClientRect();
//     joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
// };

// const handleJoystickMove = (x, y) => {
//     if (!dragging) return;
//     const dx = x - joystickCenter.x, dy = y - joystickCenter.y;
//     const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75);
//     const angle = Math.atan2(dy, dx);
   
//     joystickHandle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
   
//     player.dx = Math.cos(angle) * (distance / 75) * player.speed;
//     player.dy = Math.sin(angle) * (distance / 75) * player.speed;
// };


// let lastRoom = null;
// let hasAnswered = false; // Zmienna zapobiegająca wielokrotnemu losowaniu pytania

//  const updateJoystickCenter = () => {
//      const rect = joystick.getBoundingClientRect();
//      joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
//  };

//  const handleJoystickMove = (x, y) => {
//      if (!dragging) return;
//      const dx = x - joystickCenter.x, dy = y - joystickCenter.y;
//      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 75);
//      const angle = Math.atan2(dy, dx);
    
//      joystickHandle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    
//      player.dx = Math.cos(angle) * (distance / 75) * player.speed;
//      player.dy = Math.sin(angle) * (distance / 75) * player.speed;
//  };

// const startDrag = (e) => {
//     dragging = true;
//     const touch = e.touches ? e.touches[0] : e;
//     handleJoystickMove(touch.clientX, touch.clientY);
// };

// const moveDrag = (e) => {
//     if (!dragging) return;
//     const touch = e.touches ? e.touches[0] : e;
//     handleJoystickMove(touch.clientX, touch.clientY);
// };

// const stopDrag = () => {
//     joystickHandle.style.transform = "translate(-50%, -50%)";
//     player.dx = player.dy = 0;
//     dragging = false;
// };

// const checkCollision = () => {
//     if (!playerElement || questionBox.style.display === "block") return; // Nie pokazuj nowego pytania, jeśli jedno już trwa


//     const charRect = playerElement.getBoundingClientRect();
//     const rooms = document.querySelectorAll(".room");

//     let inRoom = false;

//     rooms.forEach((room) => {
        
//         const roomRect = room.getBoundingClientRect();
//         if (
//             charRect.left < roomRect.right &&
//             charRect.right > roomRect.left &&
//             charRect.top < roomRect.bottom &&
//             charRect.bottom > roomRect.top
//         ) {
//             inRoom = true;
//             if (lastRoom === room.id) return; // Jeśli już byliśmy w tym pokoju, nie losujemy nowego pytania
//             lastRoom = room.id; // Zapisujemy pokój, żeby nie losować kolejnego pytania
//             hasAnswered = false; // Resetujemy odpowiedź po wejściu do nowej sali

//             const subject = room.dataset.subject;
//             const question = window.getQuestion(subject);
//             if (question) {
//                 showQuestion(subject, question); // Wyświetl jedno pytanie
//             } else {
//                 alert(`Brak pytań dla ${subject}`);
//             }
//         }
        
//     });

//     if (!inRoom) {
//         lastRoom = null; // Gracz opuścił pokój, resetujemy lastRoom, żeby mógł odpowiedzieć na nowe pytanie
//     }
// };

// // ** Pytania i sprawdzanie odpowiedzi **
// const questionBox = document.getElementById("questionBox");
// const questionText = document.getElementById("questionText");
// const answersContainer = document.getElementById("answers");

// const showQuestion = (subject, question) => {
//     if (hasAnswered) return; // Jeśli już odpowiedzieliśmy, nie pokazujemy kolejnego pytania

//     questionText.textContent = `Pytanie z ${subject}: ${question.pytanie}`;
//     answersContainer.innerHTML = ""; // Czyścimy poprzednie odpowiedzi

//     question.odpowiedzi.forEach((odp, index) => {
//         const answerBtn = document.createElement("button");
//         answerBtn.textContent = odp;
//         answerBtn.classList.add("answer-button");
//         answerBtn.addEventListener("click", () => checkAnswer(index, question.poprawna));
//         answersContainer.appendChild(answerBtn);
//     });

//     questionBox.style.display = "block"; // Pokazujemy pytanie
// };

// // Funkcja sprawdzająca poprawność odpowiedzi
// const checkAnswer = (chosenIndex, correctIndex) => {
//     if (hasAnswered) return; // Zapobiegamy wielokrotnemu odpowiadaniu

//     hasAnswered = true; // Oznaczamy, że odpowiedzieliśmy

//     const buttons = answersContainer.querySelectorAll(".answer-button");

//     buttons.forEach((btn, index) => {
//         btn.disabled = true; // Blokujemy przyciski po odpowiedzi
//         if (index === correctIndex) {
//             btn.style.backgroundColor = "green"; // Poprawna odpowiedź -> zielony
//             btn.style.color = "white";
//         }
//         if (index === chosenIndex && index !== correctIndex) {
//             btn.style.backgroundColor = "red"; // Zła odpowiedź -> czerwony
//             btn.style.color = "white";
//         }
//     });

//     // Po 2 sekundach zamykamy okno pytania
//     setTimeout(() => {
//         questionBox.style.display = "none";
//     }, 2000);
// };


// ** Obsługa joysticka **
// window.addEventListener("resize", updateJoystickCenter);

// if (joystick && joystickHandle) {
//     joystick.addEventListener("mousedown", startDrag);
//     joystick.addEventListener("touchstart", startDrag);
//     window.addEventListener("mousemove", moveDrag);
//     window.addEventListener("touchmove", moveDrag);
//     window.addEventListener("mouseup", stopDrag);
//     window.addEventListener("touchend", stopDrag);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     updateJoystickCenter();
//     gameLoop();
// });

// // ** Główna pętla gry **
// const gameLoop = () => {
//     updatePlayer();
//     requestAnimationFrame(gameLoop);
// };

// const updatePlayer = () => {
//     const proposedX = player.x + player.dx;
//     const proposedY = player.y + player.dy;

//     const playerRect = {
//         left: proposedX,
//         top: proposedY,
//         right: proposedX + 50,
//         bottom: proposedY + 50
//     };

//     // Jeżeli gracz mieści się w którymkolwiek z dozwolonych bloków, przesuń
//     if (isInsideAnyBlock(playerRect)) {
//         player.x = proposedX;
//         player.y = proposedY;

//         if (playerElement) {
//             playerElement.style.left = `${player.x}px`;
//             playerElement.style.top = `${player.y}px`;
//         }
//     }

//     checkCollision(); // Jeśli masz inne kolizje
// };


// // granice
// function isInsideAnyBlock(playerRect) {
//     for (const block of blocks) {
//         const blockRect = block.getBoundingClientRect();

//         if (
//             playerRect.left >= blockRect.left &&
//             playerRect.right <= blockRect.right &&
//             playerRect.top >= blockRect.top &&
//             playerRect.bottom <= blockRect.bottom
//         ) {
//             return true;
//         }
//     }
//     return false;
// }
// function startDrag(event) {
//     dragging = true;
//     event.preventDefault();
// }

// function stopDrag(event) {
//     dragging = false;
//     player.dx = 0;
//     player.dy = 0;
// }

// function moveDrag(event) {
//     if (!dragging) return;

//     const evt = event.touches ? event.touches[0] : event;
//     const dx = evt.clientX - joystickCenter.x;
//     const dy = evt.clientY - joystickCenter.y;

//     const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 40); // max radius
//     const angle = Math.atan2(dy, dx);

//     const handleX = distance * Math.cos(angle);
//     const handleY = distance * Math.sin(angle);

//     joystickHandle.style.transform = `translate(${handleX}px, ${handleY}px)`;

//     // ruch gracza
//     player.dx = Math.cos(angle) * player.speed;
//     player.dy = Math.sin(angle) * player.speed;
// }

// function updateJoystickCenter() {
//     const rect = joystick.getBoundingClientRect();
//     joystickCenter = {
//         x: rect.left + rect.width / 2,
//         y: rect.top + rect.height / 2
//     };
// }
