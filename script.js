const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const scoreText = document.getElementById("score");

const player = {
  x: 40,
  y: canvas.height / 2,
  width: 50,
  height: 20,
  speed: 5,
  recoil: 0
};

function drawGun() {
  // recoil animation
  if (player.recoil > 0) player.recoil -= 1;

  // Gun body
  ctx.fillStyle = "#444";
  ctx.fillRect(
    player.x - player.recoil,
    player.y,
    player.width,
    player.height
  );

  // Gun barrel
  ctx.fillStyle = "#222";
  ctx.fillRect(
    player.x + player.width - player.recoil,
    player.y + 6,
    20,
    6
  );

  // Gun handle
  ctx.fillStyle = "#333";
  ctx.fillRect(
    player.x + 10,
    player.y + player.height,
    8,
    15
  );
}

function drawMuzzleFlash() {
  ctx.beginPath();
  ctx.arc(
    player.x + player.width + 18,
    player.y + 10,
    6,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "orange";
  ctx.fill();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && player.y > 0)
    player.y -= player.speed;

  if (e.key === "ArrowDown" && player.y < canvas.height - player.height)
    player.y += player.speed;
});

let bullets = [];

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    bullets.push({
      x: player.x + player.width + 20,
      y: player.y + player.height / 2,
      speed: 8
    });
    player.recoil = 5;
    drawMuzzleFlash();
  }
});

function drawBullets() {
  bullets.forEach((b, i) => {
    b.x += b.speed;
    ctx.fillStyle = "cyan";
    ctx.fillRect(b.x, b.y, 14, 3);

    if (b.x > canvas.width) bullets.splice(i, 1);
  });
}

let enemies = [];

function spawnEnemy() {
  enemies.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 40),
    size: 30,
    speed: 3,
    floatOffset: 0
  });
}

setInterval(spawnEnemy, 1500);

function drawDevil(enemy) {
  enemy.floatOffset += 0.1;
  let floatY = Math.sin(enemy.floatOffset) * 5;

  // Extra Visual Boost (Optional)
  ctx.globalAlpha = 0.9 + Math.sin(enemy.floatOffset * 2) * 0.1;

  // Face
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y + floatY, enemy.size, 0, Math.PI * 2);
  ctx.fillStyle = "crimson";
  ctx.shadowColor = "red";
  ctx.shadowBlur = 15;
  ctx.fill();

  ctx.shadowBlur = 0;

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(enemy.x - 8, enemy.y - 5 + floatY, 4, 0, Math.PI * 2);
  ctx.arc(enemy.x + 8, enemy.y - 5 + floatY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(enemy.x - 8, enemy.y - 5 + floatY, 2, 0, Math.PI * 2);
  ctx.arc(enemy.x + 8, enemy.y - 5 + floatY, 2, 0, Math.PI * 2);
  ctx.fill();

  // Horns
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(enemy.x - 12, enemy.y - 20 + floatY);
  ctx.lineTo(enemy.x - 20, enemy.y - 35 + floatY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(enemy.x + 12, enemy.y - 20 + floatY);
  ctx.lineTo(enemy.x + 20, enemy.y - 35 + floatY);
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function drawEnemies() {
  enemies.forEach((enemy, i) => {
    enemy.x -= enemy.speed;
    drawDevil(enemy);

    if (enemy.x < 0) gameOver();
  });
}

function detectCollision() {
  bullets.forEach((b, bi) => {
    enemies.forEach((enemy, ei) => {
      if (
        b.x < enemy.x + enemy.size &&
        b.x + 10 > enemy.x - enemy.size &&
        b.y < enemy.y + enemy.size &&
        b.y + 4 > enemy.y - enemy.size
      ) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score++;
        scoreText.innerText = score;
      }
    });
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGun();
  drawBullets();
  drawEnemies();
  detectCollision();

  requestAnimationFrame(gameLoop);
}

gameLoop();

function gameOver() {
  alert("Game Over! Score: " + score);
  location.reload();
}
