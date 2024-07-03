const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById('bgMusic');

// Game objects
const fluffy = {
    x: 400,
    y: 500,
    width: 60,
    height: 40,
    speed: 5,
    img: new Image()
};
fluffy.img.src = '/static/pochacco.png';

const butterflies = [];
const rabbits = [];

// Game state
let score = 0;
let timeLeft = 30;
let gameStarted = false;

// Key states
const keys = {};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    bgMusic.play();
    gameStarted = true;
    gameLoop();
});

function gameLoop() {
    if (gameStarted) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    if (gameStarted) {
        // Move Fluffy
        if (keys['ArrowLeft'] && fluffy.x > 0) fluffy.x -= fluffy.speed;
        if (keys['ArrowRight'] && fluffy.x < canvas.width - fluffy.width) fluffy.x += fluffy.speed;
        if (keys['ArrowUp'] && fluffy.y > 0) fluffy.y -= fluffy.speed;
        if (keys['ArrowDown'] && fluffy.y < canvas.height - fluffy.height) fluffy.y += fluffy.speed;

        // Update butterflies
        if (Math.random() < 0.02 && butterflies.length < 10) {
            butterflies.push({
                x: Math.random() * canvas.width,
                y: 0,
                size: 20 + Math.random() * 10,
                speed: 1 + Math.random() * 2,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }

        // Update rabbits
        if (Math.random() < 0.02 && rabbits.length < 10) {
            rabbits.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height - 100),
                size: 30 + Math.random() * 10,
                speed: 1 + Math.random() * 2,
                color: '#A52A2A'
            });
        }

        // Move rabbits and check for collisions
        rabbits.forEach((rabbit, index) => {
            rabbit.y += rabbit.speed;
            if (rabbit.y > canvas.height) {
                rabbits.splice(index, 1);
            }
            // Simple collision detection
            if (fluffy.x < rabbit.x + rabbit.size &&
                fluffy.x + fluffy.width > rabbit.x &&
                fluffy.y < rabbit.y + rabbit.size &&
                fluffy.y + fluffy.height > rabbit.y) {
                rabbits.splice(index, 1);
                score++;
            }
        });

        // Update butterflies
        butterflies.forEach((butterfly, index) => {
            butterfly.y += butterfly.speed;
            if (butterfly.y > canvas.height) {
                butterflies.splice(index, 1);
            }
            // Simple collision detection
            if (fluffy.x < butterfly.x + butterfly.size &&
                fluffy.x + fluffy.width > butterfly.x &&
                fluffy.y < butterfly.y + butterfly.size &&
                fluffy.y + fluffy.height > butterfly.y) {
                butterflies.splice(index, 1);
                score++;
            }
        });

        // Update time
        if (timeLeft > 0) {
            timeLeft -= 1/60; // Assuming 60 FPS
        } else {
            gameStarted = false;
            bgMusic.pause();
            alert(`Time's up! Your score is ${score}`);
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw sun
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2);
    ctx.fill();

    // Draw grass
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 500, canvas.width, 100);

    // Draw flowers
    for (let i = 0; i < 10; i++) {
        drawFlower(Math.random() * canvas.width, 520 + Math.random() * 60);
    }

    // Draw Fluffy
    ctx.drawImage(fluffy.img, fluffy.x, fluffy.y, fluffy.width, fluffy.height);

    // Draw butterflies
    butterflies.forEach(butterfly => {
        drawButterfly(butterfly.x, butterfly.y, butterfly.size, butterfly.color);
    });

    // Draw rabbits
    rabbits.forEach(rabbit => {
        drawRabbit(rabbit.x, rabbit.y, rabbit.size, rabbit.color);
    });

    // Draw score and time
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Time: ${Math.ceil(timeLeft)}`, canvas.width - 120, 30);
}

function drawFlower(x, y) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'pink';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(i * Math.PI * 2/5) * 10, 
                    y + Math.sin(i * Math.PI * 2/5) * 10, 
                    7, 3, i * Math.PI * 2/5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawButterfly(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, size/2, size/4, Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y, size/2, size/4, -Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
}

