const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Función para obtener texto traducido
function getTranslatedText(key) {
    const currentLanguage = localStorage.getItem('language') || 'es';
    return window.translations && window.translations[currentLanguage] && window.translations[currentLanguage][key] 
        ? window.translations[currentLanguage][key] 
        : key;
}

// Función para ajustar el canvas al tamaño de pantalla
function resizeCanvas() {
    // Mantener tamaño fijo como antes
    canvas.width = 400;
    canvas.height = 500;
    canvas.style.width = '400px';
    canvas.style.height = '500px';
}

// JS Logo
const jsIcon = new Image();
jsIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png';

// Estado inicial
let x = 50;
let y;
let gravity = 0.4;
let lift = -8;
let velocity = 0;

let pipes = [];
let frame = 0;
let started = false;
let gameRunning = true;
let lastJumpTime = 0;
let score = 0; // Puntuación actual
let highScore = localStorage.getItem('flappyHighScore') || 0; // Mejor puntuación guardada

// Inicializar posición vertical basada en el tamaño del canvas
function initGame() {
    resizeCanvas();
    y = canvas.height / 2 - 20;
    score = 0;
}

// Dibuja el personaje
function drawJS() {
    if (jsIcon.complete) {
        ctx.drawImage(jsIcon, x, y, 40, 40);
    } else {
        // Fallback si la imagen no carga
        ctx.fillStyle = "#f0db4f";
        ctx.fillRect(x, y, 40, 40);
        ctx.fillStyle = "#323330";
        ctx.font = "20px bold sans-serif";
        ctx.fillText("JS", x + 8, y + 28);
    }
}

// Dibujar marcador
function drawScore() {
    ctx.font = "24px bold sans-serif";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    
    // Puntuación actual
    ctx.strokeText(score, 20, 40);
    ctx.fillText(score, 20, 40);
    
    // Mejor puntuación (solo si hay una)
    if (highScore > 0) {
        ctx.font = "16px sans-serif";
        const bestText = `${getTranslatedText('juego-mejor')} ${highScore}`;
        ctx.strokeText(bestText, 20, 65);
        ctx.fillText(bestText, 20, 65);
    }
}

// Obstáculo tipo <div>
function Pipe() {
    this.top = Math.random() * (canvas.height * 0.3) + 50;
    this.bottom = Math.random() * (canvas.height * 0.3) + 50;
    this.x = canvas.width;
    this.width = 40;
    this.speed = 2;
    this.passed = false; // Para contar puntos una sola vez

    this.draw = () => {
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);

        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.fillText("<div>", this.x + 5, this.top - 5);
        ctx.fillText("</div>", this.x + 2, canvas.height - this.bottom + 15);
    };

    this.update = () => {
        this.x -= this.speed;
        
        // Incrementar puntuación cuando el jugador pasa el obstáculo
        if (!this.passed && this.x + this.width < x) {
            this.passed = true;
            score++;
            
            // Actualizar mejor puntuación
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('flappyHighScore', highScore);
            }
        }
    };
}

// Pantalla de game over
function showGameOver() {
    gameRunning = false;
    
    // Actualizar el contenido del modal con la puntuación traducida
    const gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.innerHTML = `
        <h3>${getTranslatedText('juego-game-over')}</h3>
        <p><strong>${getTranslatedText('juego-puntuacion')} ${score}</strong></p>
        <p>${getTranslatedText('juego-mejor-puntuacion')} ${highScore}</p>
        <p>${getTranslatedText('juego-intentar')}</p>
        <button onclick="restartGame()">${getTranslatedText('juego-reiniciar')}</button>
    `;
    
    gameOverDiv.style.display = 'block';
}

// Loop principal
function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!started) {
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(getTranslatedText('juego-empezar'), canvas.width / 2, canvas.height / 2);
        
        // Mostrar mejor puntuación en la pantalla de inicio
        if (highScore > 0) {
            ctx.font = "16px sans-serif";
            ctx.fillText(`${getTranslatedText('juego-mejor-puntuacion')} ${highScore}`, canvas.width / 2, canvas.height / 2 + 30);
        }
        
        ctx.textAlign = "left";
        drawJS();
        requestAnimationFrame(update);
        return;
    }

    // Aplicar física
    velocity += gravity;
    y += velocity;

    // Limitar velocidad máxima de caída
    if (velocity > 10) {
        velocity = 10;
    }

    drawJS();
    drawScore(); // Dibujar marcador

    // Generar pipes
    if (frame % 120 === 0) {
        pipes.push(new Pipe());
    }

    // Actualizar y dibujar pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].draw();

        // Colisión
        const hitX = x + 40 > pipes[i].x && x < pipes[i].x + pipes[i].width;
        const hitTop = y < pipes[i].top;
        const hitBottom = y + 40 > canvas.height - pipes[i].bottom;

        if (hitX && (hitTop || hitBottom)) {
            showGameOver();
            return;
        }

        // Remover pipes que salieron de pantalla
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }
    }

    // Verificar límites del canvas
    if (y > canvas.height - 40 || y < 0) {
        showGameOver();
        return;
    }

    frame++;
    requestAnimationFrame(update);
}

// Control de salto mejorado
function jump(e) {
    const currentTime = Date.now();
    
    // Prevenir múltiples saltos muy rápidos
    if (currentTime - lastJumpTime < 150) {
        e.preventDefault();
        return;
    }
    
    lastJumpTime = currentTime;

    if (!started) {
        started = true;
        velocity = lift;
    } else if (gameRunning) {
        velocity = lift;
    }
    
    e.preventDefault();
}

// Event listeners mejorados
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump(e);
    }
});

// Para mouse y touch, asegurarse de que solo responda al canvas
canvas.addEventListener('click', jump);
canvas.addEventListener('touchstart', jump, { passive: false });

// Prevenir el comportamiento por defecto en el canvas
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
}, { passive: false });

// Reiniciar juego
function resetGame() {
    started = false;
    gameRunning = true;
    x = 50;
    y = canvas.height / 2 - 20;
    velocity = 0;
    pipes = [];
    frame = 0;
    lastJumpTime = 0;
    score = 0; // Resetear puntuación
    document.getElementById('gameOver').style.display = 'none';
    update();
}

// Función para reiniciar desde el botón
window.restartGame = resetGame;

// Función para resetear el high score (opcional)
window.resetHighScore = function() {
    localStorage.removeItem('flappyHighScore');
    highScore = 0;
    console.log('High score reseteado');
};

// Función para actualizar traducciones cuando cambie el idioma
function updateGameTranslations() {
    // Si el juego está en la pantalla de game over, actualizar el contenido
    const gameOverDiv = document.getElementById('gameOver');
    if (gameOverDiv.style.display === 'block') {
        gameOverDiv.innerHTML = `
            <h3>${getTranslatedText('juego-game-over')}</h3>
            <p><strong>${getTranslatedText('juego-puntuacion')} ${score}</strong></p>
            <p>${getTranslatedText('juego-mejor-puntuacion')} ${highScore}</p>
            <p>${getTranslatedText('juego-intentar')}</p>
            <button onclick="restartGame()">${getTranslatedText('juego-reiniciar')}</button>
        `;
    }
}

// Escuchar cambios de idioma
window.addEventListener('languageChanged', updateGameTranslations);

// Redimensionar canvas cuando cambie el tamaño de ventana
window.addEventListener('resize', function() {
    resizeCanvas();
    if (!started) {
        y = canvas.height / 2 - 20;
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // Iniciar cuando la imagen esté cargada
    jsIcon.onload = () => {
        update();
    };
    
    // Si la imagen ya está cargada
    if (jsIcon.complete) {
        update();
    }
});