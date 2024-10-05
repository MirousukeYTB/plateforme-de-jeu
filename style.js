// Sélectionner le canvas et le contexte
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Variables du jeu
let player;
let platforms = [];
let collectibles = [];
let enemies = [];
let gravity = 0.5;

// Créer le joueur
function createPlayer() {
    player = {
        x: 50,
        y: canvas.height - 70,
        width: 50,
        height: 50,
        color: "#00ff00",
        speed: 5,
        dx: 0,
        dy: 0,
        jump: -10,
        grounded: false,
    };
}

// Créer des plateformes
function createPlatforms() {
    platforms.push({ x: 0, y: canvas.height - 20, width: canvas.width, height: 20, color: "#27ae60" });
    platforms.push({ x: 100, y: 300, width: 150, height: 10, color: "#27ae60" });
    platforms.push({ x: 400, y: 250, width: 150, height: 10, color: "#27ae60" });
}

// Créer des collectibles
function createCollectibles() {
    collectibles.push({ x: 150, y: 280, width: 20, height: 20, color: "#ffcc00" });
}

// Créer des ennemis
function createEnemies() {
    enemies.push({ x: 600, y: 270, width: 40, height: 40, color: "#ff0000" });
}

// Mettre à jour la physique du joueur
function updatePlayer() {
    player.dy += gravity; // Appliquer la gravité
    player.y += player.dy; // Mettre à jour la position verticale

    if (player.y + player.height >= canvas.height - 20) {
        player.y = canvas.height - player.height - 20; // Rester sur la plateforme
        player.dy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    player.x += player.dx; // Mettre à jour la position horizontale

    // Vérifier les collisions avec les plateformes
    for (let platform of platforms) {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height) {
            player.y = platform.y - player.height; // Coller au dessus de la plateforme
            player.dy = 0;
            player.grounded = true;
        }
    }
}

// Dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dessiner les plateformes
function drawPlatforms() {
    for (let platform of platforms) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

// Dessiner les collectibles
function drawCollectibles() {
    for (let collectible of collectibles) {
        ctx.fillStyle = collectible.color;
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
    }
}

// Dessiner les ennemis
function drawEnemies() {
    for (let enemy of enemies) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// Détecter les collisions avec les collectibles
function detectCollectibleCollision() {
    for (let i = 0; i < collectibles.length; i++) {
        const collectible = collectibles[i];
        if (player.x < collectible.x + collectible.width &&
            player.x + player.width > collectible.x &&
            player.y < collectible.y + collectible.height &&
            player.y + player.height > collectible.y) {
            collectibles.splice(i, 1); // Supprimer le collectible
        }
    }
}

// Détecter les collisions avec les ennemis
function detectEnemyCollision() {
    for (let enemy of enemies) {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            alert("Game Over!");
            document.location.reload(); // Recharge la page si collision
        }
    }
}

// Afficher le jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    drawPlatforms();
    drawPlayer();
    drawCollectibles();
    drawEnemies();
}

// Boucle principale du jeu
function gameLoop() {
    updatePlayer();
    detectCollectibleCollision();
    detectEnemyCollision();
    draw();
    requestAnimationFrame(gameLoop); // Boucle de mise à jour
}

// Gestion des contrôles du joueur
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        player.dx = player.speed; // Déplacer à droite
    }
    if (event.key === "ArrowLeft") {
        player.dx = -player.speed; // Déplacer à gauche
    }
    if (event.key === "ArrowUp" && player.grounded) {
        player.dy += player.jump; // Sauter
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        player.dx = 0; // Arrêter le déplacement horizontal
    }
});

// Initialiser le jeu
createPlayer();
createPlatforms();
createCollectibles();
createEnemies();
gameLoop(); // Démarrer la boucle du jeu
