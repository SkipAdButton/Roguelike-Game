const mapCanvas = document.getElementById("mapCanvas");
const mapSize = mapCanvas.getBoundingClientRect();
const mapCtx = mapCanvas.getContext("2d");

const mainDisplay = document.getElementById("gameCanvas");
const gameSize = gameCanvas.getBoundingClientRect();
const gameCtx = gameCanvas.getContext("2d");

let eliteNum = 0;
let percent = 0;

const map = [[], [], [], [], []];

const player = {
	x: 100,
	y: 100,
	health: 100,
	speed: 10,
	coins: 0,
	firerate: 50,
	lastshot: 0,
	currentRoomId: 13,
	cycle: 1, //How many maps player has seen/played
};

const mouse = {
	x: 0,
	y: 0,
	down: false,
};

const playerProjectiles = [];

document.addEventListener("mousedown", () => {
	mouse.down = true;
});
document.addEventListener("mouseup", () => {
	mouse.down = false;
});

const keys = [];
document.addEventListener("keydown", (e) => {
	keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
	keys[e.key.toLowerCase()] = false;
});

// Draw Screen
function drawMap() {
	// Reset
	mapCtx.clearRect(0, 0, 250, 250);
	mapCtx.fillStyle = "rgb(100 100 100)";
	mapCtx.fillRect(0, 0, 250, 250);

	// Tiles
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x].id == player.currentRoomId) {
				mapCtx.fillStyle = "rgb(100 255 255)";
			} else {
				mapCtx.fillStyle = map[y][x].color;
			}
			mapCtx.fillRect(50 * x + 5, 50 * y + 5, 40, 40);
		}
	}
}
function drawGame() {
	// Reset
	gameCtx.clearRect(0, 0, 250, 250);
	gameCtx.fillStyle = "rgb(210 210 210)";
	gameCtx.fillRect(0, 0, 500, 500);

	// Player Projectiles
	for (let i = 0; i < playerProjectiles.length; i++) {
		gameCtx.fillStyle = "rgb(0 0 0)";
		gameCtx.beginPath();
		gameCtx.arc(playerProjectiles[i].x, playerProjectiles[i].y, 5, 0, Math.PI * 2);
		gameCtx.fill();
	}
	
	// Player (guess who's back)
	gameCtx.fillStyle = "rgb(240 50 50)";
	gameCtx.fillRect(player.x, player.y, 50, 50);
	gameCtx.fillStyle = "rgb(255 255 255)";
	gameCtx.fillRect(player.x + 10, player.y + 10, 10, 10);
	gameCtx.fillRect(player.x + 30, player.y + 10, 10, 10);
	gameCtx.fillStyle = "rgb(0 0 0)";
	gameCtx.fillRect(player.x + 14, player.y + 14, 5, 5);
	gameCtx.fillRect(player.x + 31, player.y + 14, 5, 5);
	gameCtx.fillStyle = "rgb(75 0 0)";
	gameCtx.fillRect(player.x + 10, player.y + 32, 30, 3);
	gameCtx.fillStyle = "rgb(255 255 255)";
	gameCtx.fillRect(player.x + 19, player.y + 35, 5, 5);
	gameCtx.fillRect(player.x + 26, player.y + 35, 5, 5);
}
// Create Map
function makeMap() {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < 5; x++) {
			map[y].push({
				id: y * 5 + (x + 1),
				color: `rgb(200 200 200)`,
				type: "empty",
				enemies: player.cycle + 5 + Math.floor(Math.random() * 5),
				cleared: true,
			});
		}
	}
	console.log(map);
	addSpawn();
	addShop();
	addExit();
	getNumElite();
	drawMap();
}
//Add stuff to map
function addSpawn() {
	map[2].splice(2, 1, {
		id: 13,
		color: `rgb(200 200 200)`,
		type: "spawn",
		enemies: 0,
		cleared: true,
	});
}
function addShop() {
	let xPosition = Math.floor(Math.random() * 5);
	let yPosition = Math.floor(Math.random() * 5);
	if (map[xPosition][yPosition].type == "empty") {
		map[yPosition].splice(xPosition, 1, {
			id: map[yPosition][xPosition].id,
			color: `rgb(255, 255, 100)`,
			type: "shop",
			enemies: 0,
			cleared: true,
		});
	} else {
		addShop();
	}
}
function addExit() {
	let xPosition = Math.floor(Math.random() * 5);
	let yPosition = Math.floor(Math.random() * 5);
	if (map[xPosition][yPosition].type == "empty") {
		map[yPosition].splice(xPosition, 1, {
			id: map[yPosition][xPosition].id,
			color: `rgb(100, 255, 100)`,
			type: "exit",
			enemies: 0,
			cleared: true,
		});
	} else {
		addExit();
	}
}
function addElite() {
	let xPosition = Math.floor(Math.random() * 5);
	let yPosition = Math.floor(Math.random() * 5);
	if (map[xPosition][yPosition].type == "empty") {
		map[yPosition].splice(xPosition, 1, {
			id: map[yPosition][xPosition].id,
			color: `rgb(255, 100, 100)`,
			type: "elite",
			enemies: 5 + player.cycle * 2 + Math.floor(Math.random() * 8),
			cleared: false,
		});
	} else {
		addElite();
	}
}
//Random num of elite
function getNumElite() {
	percent = Math.floor(Math.random() * 100);
	if (percent > 90) {
		eliteNum = 3;
	} else if (percent > 70) {
		eliteNum = 2;
	} else {
		eliteNum = 1;
	}
	for (let i = eliteNum; i > 0; i--) {
		addElite();
	}
}

// We can play the game now

function playerMovement() {
	if (keys["w"] || keys["arrowup"]) {
		player.y -= player.speed;
	}
	if (keys["a"] || keys["arrowleft"]) {
		player.x -= player.speed;
	}
	if (keys["s"] || keys["arrowdown"]) {
		player.y += player.speed;
	}
	if (keys["d"] || keys["arrowright"]) {
		player.x += player.speed;
	}
	drawGame();
	requestAnimationFrame(playerMovement);
}

// Shooting
gameCanvas.addEventListener("mousemove", (e) => {
	const rect = gameCanvas .getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
});

function createBullet() {
	if (player.lastshot <= 0) {
		if (mouse.down) {
			playerProjectiles.push({
				x: player.x + 25,
				y: player.y +25,
				angle: Math.atan2(mouse.y - (player.y + 25), mouse.x - (player.x + 25)),
				speed: 7,
			});
			player.lastshot = player.firerate;
			drawGame();
			console.log(playerProjectiles.length);
		}
	} else {
		player.lastshot--;
		console.log(player.lastshot);
	}

	requestAnimationFrame(createBullet);
}

function moveProjectiles() {
	for (let i = 0; i < projectiles.length; i++) {
		projectiles[i].x +=
			Math.cos(projectiles[i].angle) * projectiles[i].speed;
		projectiles[i].y +=
			Math.sin(projectiles[i].angle) * projectiles[i].speed;
	}
	draw();
	requestAnimationFrame(moveProjectiles);
}
// oh boy
function playerWallCollision() {
	currentRoom = map.flat().find((e) => e.id == player.currentRoomId);
	if (currentRoom.cleared == true) {
		// Left
		if (currentRoom.id % 5 == 1) {
			if (player.x < 0) {
				player.x = 0;
			}
		} else {
			if (player.x < -35) {
				player.x = 484;
				player.currentRoomId -= 1;
				console.log(player.currentRoomId);
			}
		}
		// Right
		if (currentRoom.id % 5 == 0) {
			if (player.x > 450) {
				player.x = 450;
			}
		} else {
			if (player.x > 485) {
				player.x = -34;
				player.currentRoomId += 1;
				console.log(player.currentRoomId);
			}
		}
		// Up
		if (currentRoom.id <= 5) {
			if (player.y < 0) {
				player.y = 0;
			}
		} else {
			if (player.y < -35) {
				player.y = 484;
				player.currentRoomId -= 5;
				console.log(player.currentRoomId);
			}
		}
		// Down
		if (currentRoom.id >= 21) {
			if (player.y > 450) {
				player.y = 450;
			}
		} else {
			if (player.y > 485) {
				player.y = -34;
				player.currentRoomId += 5;
				console.log(player.currentRoomId);
			}
		}
	} else {
		if (player.x < 0) {
			if (player.x > -1 - player.speed) {
				player.x = 0;
			}
		}
		if (player.x > 450) {
			if (player.x > 451 + player.speed) {
				player.x = 450;
			}
		}
		if (player.y < 0) {
			if (player.y > -1 - player.speed) {
				player.y = 0;
			}
		}
		if (player.y > 450) {
			if (player.y > 451 + player.speed) {
				player.y = 450;
			}
		}
	}
	if (player.x < -50) {
		player.x = 0;
	}
	if (player.x > 500) {
		player.x = 450;
	}
	if (player.y < -50) {
		player.y = 0;
	}
	if (player.y > 500) {
		player.y = 450;
	}
	drawMap();
	requestAnimationFrame(playerWallCollision);
}

function movePlayerProjectiles() {
            for (let i = 0; i < playerProjectiles.length; i++) {
                playerProjectiles[i].x += Math.cos(playerProjectiles[i].angle) * playerProjectiles[i].speed;
                playerProjectiles[i].y += Math.sin(playerProjectiles[i].angle) * playerProjectiles[i].speed;
            }
			drawGame()
            requestAnimationFrame(movePlayerProjectiles)
        }
// Call Functions
makeMap();
drawGame();
requestAnimationFrame(playerMovement);
requestAnimationFrame(playerWallCollision);
requestAnimationFrame(createBullet);
requestAnimationFrame(movePlayerProjectiles)

// To do list:
// player shooting
// enemies
// working shop
// enemy health and collision with bullets (dear god)
// upgrades array
