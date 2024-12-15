// Get canvas and context
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

// Game variables
var stickman = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 50,
    speed: 10
};

var balls = [];
var score = 0;
var gameOver = false;

// Ball class
class Ball {
    constructor() {
        this.radius = 15;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = -this.radius;
        this.speed = Math.random() * 3 + 2;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.y += this.speed;
    }
}

// Draw stickman
function drawStickman() {
    ctx.fillStyle = 'yellow';
    
    // Head
    ctx.beginPath();
    ctx.arc(stickman.x, stickman.y - stickman.height/2, stickman.width/2, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(stickman.x, stickman.y - stickman.height/2);
    ctx.lineTo(stickman.x, stickman.y + stickman.height/2);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(stickman.x, stickman.y);
    ctx.lineTo(stickman.x - stickman.width, stickman.y);
    ctx.lineTo(stickman.x + stickman.width, stickman.y);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(stickman.x, stickman.y + stickman.height/2);
    ctx.lineTo(stickman.x - stickman.width/2, stickman.y + stickman.height);
    ctx.lineTo(stickman.x + stickman.width/2, stickman.y + stickman.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Spawn balls
function spawnBalls() {
    if (Math.random() < 0.02 && balls.length < 10) {
        balls.push(new Ball());
    }
}

// Check collision
function checkCollision() {
    balls.forEach((ball, index) => {
        const dx = ball.x - stickman.x;
        const dy = ball.y - stickman.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + stickman.width/2) {
            gameOver = true;
        }

        // Remove balls that go off screen
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
            score++;
        }
    });
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Spawn and update balls
        spawnBalls();
        balls.forEach(ball => {
            ball.update();
            ball.draw();
        });

        // Draw stickman
        drawStickman();

        // Check collisions
        checkCollision();

        // Display score with enhanced visibility
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white background
        ctx.fillRect(10, 10, 150, 40); // Create a background for the score text
        
        ctx.fillStyle = 'black';
        ctx.font = 'bold 24px Arial'; // Larger, bold font
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 20, 35); // Adjusted position
    } else {
        // Game over screen with improved visibility
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 50);
        
        ctx.font = 'bold 30px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
        
        ctx.font = '20px Arial';
        ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 70);
    }

    // Continue animation
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
    if (!gameOver) {
        switch(e.key) {
            case 'ArrowLeft':
                if (stickman.x > stickman.width) 
                    stickman.x -= stickman.speed;
                break;
            case 'ArrowRight':
                if (stickman.x < canvas.width - stickman.width) 
                    stickman.x += stickman.speed;
                break;
            case 'ArrowUp':
                if (stickman.y > stickman.height) 
                    stickman.y -= stickman.speed;
                break;
            case 'ArrowDown':
                if (stickman.y < canvas.height - stickman.height) 
                    stickman.y += stickman.speed;
                break;
        }
    } else if (e.key === 'r' || e.key === 'R') {
        // Restart game
        balls = [];
        score = 0;
        gameOver = false;
        stickman.x = canvas.width / 2;
        stickman.y = canvas.height - 50;
    }
});

// Start game loop
gameLoop();