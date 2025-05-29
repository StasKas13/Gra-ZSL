const joystick = document.getElementById("joystick");
const joystickHandle = document.getElementById("joystickHandle");
const blocks = document.querySelectorAll('.block');
const sale = document.getElementById("sale");
const hol = document.getElementById("hol");
const playerElement = document.getElementById("player");

let dragging = false;
let joystickCenter = { x: 0, y: 0 };

let lastRoom = null;
let hasAnswered = false; // Zmienna zapobiegająca wielokrotnemu losowaniu pytania
let lastQuizRoom = null;
let currentQuizQuestions = [];
let currentQuizIndex = 0;

let gameStartTime = null;
let gameEndTime = null;
let savedTime = 0;

let savedPoints = 0;
let sum_points = 0;
let punkty = 0;

document.addEventListener("DOMContentLoaded", () => {
    updateJoystickCenter();
    gameStartTime = Date.now(); // Start pomiaru czasu

    const stored = localStorage.getItem("punkty");
    if (stored) {
        savedPoints = parseInt(stored);
        sum_points = savedPoints;
    }
    const storedTime = localStorage.getItem("savedTime");
    if (storedTime) {
        savedTime = parseInt(storedTime);
    }


    updateScoreDisplay(); // pokazujemy sumę punktów (saved + sesja)
    gameLoop();
});

document.getElementById("resetPointsBtn").addEventListener("click", () => {
    if (confirm("Czy na pewno chcesz zresetować wszystkie punkty?")) {
        punkty = 0;
        savedPoints = 0;
        sum_points = 0;
        localStorage.setItem("punkty", "0");
        updateScoreDisplay();
        alert("Punkty zostały zresetowane.");
    }
});

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
    updateScoreDisplay(); // dzięki temu czas odświeża się cały czas

}

function updatePlayer() {
    // Najpierw ruch w osi X
    const proposedX = player.x + player.dx;
    const playerRectX = {
        left: proposedX,
        top: player.y,
        right: proposedX + playerElement.offsetWidth,
        bottom: player.y + playerElement.offsetHeight
    };

    if (isInsideAnyBlock(playerRectX)) {
        player.x = proposedX;
        playerElement.style.left = `${player.x}px`;
    } else {
        player.dx = 0; // Zatrzymanie ruchu w X
    }

    // Potem ruch w osi Y
    const proposedY = player.y + player.dy;
    const playerRectY = {
        left: player.x,
        top: proposedY,
        right: player.x + playerElement.offsetWidth,
        bottom: proposedY + playerElement.offsetHeight
    };

    if (isInsideAnyBlock(playerRectY)) {
        player.y = proposedY;
        playerElement.style.top = `${player.y}px`;
    } else {
        player.dy = 0; // Zatrzymanie ruchu w Y
    }

    checkCollision(); // Jeśli masz inne kolizje
    checkCollisionQuiz();
}


function isInsideAnyBlock(playerRect) {
    for (const block of blocks) {
        const blockRect = {
            left: block.offsetLeft,
            top: block.offsetTop,
            right: block.offsetLeft + block.offsetWidth,
            bottom: block.offsetTop + block.offsetHeight
        };

        // Jeśli którykolwiek fragment gracza wchodzi na blok
        if (
            playerRect.right > blockRect.left &&
            playerRect.left < blockRect.right &&
            playerRect.bottom > blockRect.top &&
            playerRect.top < blockRect.bottom
        ) {
            return true;
        }
    }
    return false;
}

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
const scoreBox = document.getElementById("scoreBox");
const checkAnswer = (chosenIndex, correctIndex) => {
    if (hasAnswered) return;
    hasAnswered = true;

    const buttons = answersContainer.querySelectorAll(".answer-button");

    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctIndex) {
            btn.style.backgroundColor = "green";
            btn.style.color = "white";
        }
        if (index === chosenIndex && index !== correctIndex) {
            btn.style.backgroundColor = "red";
            btn.style.color = "white";
        }
    });

    if (chosenIndex === correctIndex) {
        punkty++;                                       // zwiększ punkty sesyjne
        savedPoints = sum_points + punkty;              // zwiększ zapisane
        localStorage.setItem("punkty", savedPoints);    // zapisz w localStorage
        updateScoreDisplay();                           // pokaż wynik
    }

    setTimeout(() => {
        questionBox.style.display = "none";
    }, 2000);

    if(punkty == 25){
        alert("Możesz przejść do następnej klasy");
    }
    if (punkty >= 25) {
        const next_class = document.getElementById("nextClass");
        next_class.style.display = "flow";
    }
};
function updateScoreDisplay() {
    const now = Date.now();
    const sessionElapsed = Math.floor((now - gameStartTime) / 1000);
    const elapsed = savedTime + sessionElapsed;

    // Zapisz czas cały czas
    localStorage.setItem("savedTime", elapsed.toString());

    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    scoreBox.innerHTML = `Punkty: ${punkty} <br>
        Wszystkie punkty: ${savedPoints} <br>
        Czas: ${minutes}m ${seconds}s`;
}

// quiz
function showRoomPopup(subject) {
  if (document.querySelector('.room-popup')) return;
  const popup = document.createElement("div");
  popup.classList.add("room-popup");

  popup.innerHTML = `
    <div class="popup-content">
      <img src="${subject}.jpg" alt="${subject}" style="max-width: 300px; height: auto; display: block; margin: 0 auto;" />
      <p>Wchodzisz do sali: <strong>${subject}</strong></p>
      <button class="start-quiz">Rozpocznij quiz</button>
      <button class="close-popup">Zamknij</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Teraz znajdujemy przyciski tylko w ramach popupu
  const startButton = popup.querySelector(".start-quiz");
  const closeButton = popup.querySelector(".close-popup");

  startButton.addEventListener("click", () => {
    popup.remove();
    currentQuizQuestions = window.getQuestion?.(subject) || [];
    currentQuizIndex = 0;

    if (currentQuizQuestions.length > 0) {
        showNextQuizQuestion(subject);
    } else {
       console.warn("Brak pytań dla:", subject);
    }

  });

  closeButton.addEventListener("click", () => {
    popup.remove();
  });
}
function showNextQuizQuestion(subject) {
  if (currentQuizIndex >= currentQuizQuestions.length) {
    alert("Zakończono quiz z przedmiotu: " + subject);
    questionBox.style.display = "none";
    return;
  }

  const question = currentQuizQuestions[currentQuizIndex];
  hasAnswered = false;

  questionText.textContent = `Pytanie ${currentQuizIndex + 1}/${currentQuizQuestions.length} z ${subject}: ${question.pytanie}`;
  answersContainer.innerHTML = "";

  question.odpowiedzi.forEach((odp, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = odp;
    answerBtn.classList.add("answer-button");
    answerBtn.addEventListener("click", () => {
      checkAnswerQuiz(index, question.poprawna, subject);
    });
    answersContainer.appendChild(answerBtn);
  });

  questionBox.style.display = "block";
}


function checkCollisionQuiz() {
    const playerRect = {
        left: player.x,
        top: player.y,
        right: player.x + playerElement.offsetWidth,
        bottom: player.y + playerElement.offsetHeight
    };

    const rooms = document.querySelectorAll('.room2');
    let inQuizRoom = false;

    for (let room of rooms) {
        const roomRectRelative = {
            left: room.offsetLeft,
            top: room.offsetTop,
            right: room.offsetLeft + room.offsetWidth,
            bottom: room.offsetTop + room.offsetHeight
        };

        const collision = !(playerRect.right <= roomRectRelative.left ||
                            playerRect.left >= roomRectRelative.right ||
                            playerRect.bottom <= roomRectRelative.top ||
                            playerRect.top >= roomRectRelative.bottom);

        if (collision) {
            inQuizRoom = true;

            // Sprawdź, czy to nowy pokój quizu
            if (lastQuizRoom === room.id) return;

            lastQuizRoom = room.id; // Zapisujemy pokój, żeby nie pokazywać quizu wielokrotnie

            const subject = room.dataset.subject;
            const question = window.getQuestion = function(subject) {
                  return window.questions[subject] || [];
                };

            if (question) {
                showRoomPopup(subject);
            } else {
                console.warn("Brak pytania dla:", subject);
            }

            // Zatrzymaj ruch
            player.dx = 0;
            player.dy = 0;
            break;
        }
    }

    // Jeśli nie jesteśmy w żadnym pokoju – resetujemy
    if (!inQuizRoom) {
        lastQuizRoom = null;
    }
}


function showQuestionQuiz(subject, question) {
  //if (hasAnswered) return;

  questionText.textContent = `Pytanie z ${subject}: ${question.pytanie}`;
  answersContainer.innerHTML = "";

  question.odpowiedzi.forEach((odp, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = odp;
    answerBtn.classList.add("answer-button");
    answerBtn.addEventListener("click", () => checkAnswer(index, question.poprawna));
    answersContainer.appendChild(answerBtn);
  });

  questionBox.style.display = "block";
}

function checkAnswerQuiz(chosenIndex, correctIndex, subject) {
  if (hasAnswered) return;
  hasAnswered = true;

  const buttons = answersContainer.querySelectorAll(".answer-button");

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correctIndex) {
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
    }
    if (index === chosenIndex && index !== correctIndex) {
      btn.style.backgroundColor = "red";
      btn.style.color = "white";
    }
  });

  if (chosenIndex === correctIndex) {
    punkty += 2;
    scoreBox.textContent = `Punkty: ${punkty}`;
  }

  setTimeout(() => {
    currentQuizIndex++;
    showNextQuizQuestion(subject);
  }, 1500);

  if (punkty >= 25) {
    alert("Możesz przejść do następnej klasy");
    const next_class = document.getElementById("nextClass");
    next_class.style.display = "flow";
  }
}


// Rozszerzona wersja dla samokształceniowej sali

function startQuiz() {
  const question = window.currentQuestion;
  questionBox.innerHTML = `
    <p>${question.questionText}</p>
    <div>
      <button onclick="answerQuestion('${question.options[0]}')">${question.options[0]}</button>
      <button onclick="answerQuestion('${question.options[1]}')">${question.options[1]}</button>
    </div>
  `;
}

function closeQuiz() {
  questionBox.style.display = "none";
}

function answerQuestionQuiz(selectedAnswer) {
  if (hasAnswered) return;
  hasAnswered = true;

  const correct = selectedAnswer === window.currentQuestion.correctAnswer;
  alert(correct ? "Dobra odpowiedź!" : "Zła odpowiedź!");
  questionBox.style.display = "none";
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

    player.dx = Math.cos(angle) * (distance / 60) * player.speed;
    player.dy = Math.sin(angle) * (distance / 60) * player.speed;
}

function updateJoystickCenter() {
    const rect = joystick.getBoundingClientRect();
    joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

joystick.addEventListener("mousedown", startDrag);
joystick.addEventListener("touchstart", startDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("touchmove", moveDrag);
window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchend", stopDrag);