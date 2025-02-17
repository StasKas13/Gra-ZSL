const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const game = {
      width: canvas.width,
      height: canvas.height,
      running: true,
    };

    // Gracz
    const player = {
      x: 400,
      y: 300,
      width: 50,
      height: 50,
      color: 'blue',
      speed: 3,
      dx: 0, // kierunek x
      dy: 0, // kierunek y
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

    // Obsługa dotyku na joysticku (dla kompatybilności)
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
      player.dx = Math.cos(angle) * (distance / 75) * player.speed; // Prędkość w proporcji
      player.dy = Math.sin(angle) * (distance / 75) * player.speed;
    }

    function resetJoystick() {
      joystickHandle.style.transform = 'translate(-50%, -50%)';
      player.dx = 0;
      player.dy = 0;
    }

    // Aktualizacja gracza
    function updatePlayer() {
      player.x += player.dx;
      player.y += player.dy;

      // Ogranicz gracza do canvasu
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > game.width) player.x = game.width - player.width;
      if (player.y < 0) player.y = 0;
      if (player.y + player.height > game.height) player.y = game.height - player.height;
    }

    // Renderowanie
    function drawPlayer() {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, game.width, game.height);
    }

    // Pętla gry
    function gameLoop() {
      if (!game.running) return;

      clearCanvas(); // Czyść ekran
      updatePlayer(); // Zaktualizuj stan gracza
      drawPlayer(); // Narysuj gracza

      requestAnimationFrame(gameLoop); // Kontynuuj pętlę
    }

    // Start gry
    gameLoop();

    // Ponowne obliczenie joysticka w razie zmiany rozmiaru okna
    window.addEventListener('resize', updateJoystickCenter);