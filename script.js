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
	speed: 7,
	coins: 0,
	firerate: 0,
	damage: 100,
	lastshot: 0,
	currentRoomId: 13,
	cycle: 1, //How many maps player has seen/played
};

//ITEMS START
let itemsEquipt = 0;

const items = [
	[
		{ name: "potato", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
		{ name: "NAME", damage: 0, speed: 0, health: 0, firerate: 0, armor: 0, color: "urmom", rarity: "common",},
	],
];
//ITEMS END
const enemies = [];

const keys = [];
document.addEventListener("keydown", (e) => {
	keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
	keys[e.key.toLowerCase()] = false;
});

const mouse = {
	x: 0,
	y: 0,
	down: false,
};

let playerProjectiles = [];

document.addEventListener("mousedown", () => {
	mouse.down = true;
});
document.addEventListener("mouseup", () => {
	mouse.down = false;
});

gameCanvas.addEventListener("mousemove", (e) => {
	const rect = gameCanvas.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
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
			if (!map[y][x].visited) {
				mapCtx.fillStyle = "rgb(75 75 75)";
			} else {
				mapCtx.fillStyle = map[y][x].color;
			}
			mapCtx.fillRect(50 * x + 5, 50 * y + 5, 40, 40);

			if (
				map[y][x].cleared == true &&
				map[y][x].type !== "shop" &&
				map[y][x].type !== "exit"
			) {
				mapCtx.fillStyle = "rgb(0 0 0 / .3)";
				mapCtx.fillRect(50 * x + 5, 50 * y + 5, 40, 40);
			}
			if (map[y][x].id == player.currentRoomId) {
				mapCtx.fillStyle = "rgb(100 100 230)";
				map[y][x].visited = true;
				// Adjacent
				if (y - 1 !== -1) {
					map[y - 1][x].visited = true;
				}
				if (y + 1 !== 5) {
					map[y + 1][x].visited = true;
				}
				if (x - 1 !== -1) {
					map[y][x - 1].visited = true;
				}
				if (x + 1 !== 5) {
					map[y][x + 1].visited = true;
				}
				mapCtx.fillRect(50 * x + 15, 50 * y + 15, 20, 20);
			}
		}
	}
}
function drawGame() {
	// Reset
	gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gameCtx.fillStyle = "rgba(210 210 210)";
	gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

	// Player Projectiles
	for (let i = 0; i < playerProjectiles.length; i++) {
		gameCtx.fillStyle = "rgb(0 0 0)";
		gameCtx.beginPath();
		gameCtx.arc(
			playerProjectiles[i].x,
			playerProjectiles[i].y,
			5,
			0,
			Math.PI * 2,
		);
		gameCtx.fill();
	}

	function clearScreen() {
		playerProjectiles = [];
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

	// Enemies
	for (let i = 0; i < enemies.length; i++) {
		gameCtx.fillStyle = "rgb(100 100 100)";
		gameCtx.fillRect(enemies[i].x, enemies[i].y, 50, 50);
		gameCtx.fillStyle = "rgb(0 0 0)";
		gameCtx.fillRect(enemies[i].x, enemies[i].y + 10, 50, 5);
		gameCtx.fillRect(enemies[i].x + 10, enemies[i].y + 15, 10, 5);
		gameCtx.fillRect(enemies[i].x + 30, enemies[i].y + 15, 10, 5);
		gameCtx.fillStyle = "rgb(75 75 75)";
		gameCtx.fillRect(enemies[i].x + 15, enemies[i].y + 30, 20, 3);
	}
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
				cleared: false,
				visited: false,
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
		visited: true,
	});
}

function addShop() {
	let xPosition = Math.floor(Math.random() * 5);
	let yPosition = Math.floor(Math.random() * 5);
	if (map[yPosition][xPosition].type == "empty") {
		map[yPosition].splice(xPosition, 1, {
			id: map[yPosition][xPosition].id,
			color: `rgb(255, 255, 100)`,
			type: "shop",
			enemies: 0,
			cleared: true,
			visited: false,
		});
	} else {
		addShop();
	}
}

function addExit() {
	let xPosition = Math.floor(Math.random() * 5);
	let yPosition = Math.floor(Math.random() * 5);
	if (map[yPosition][xPosition].type == "empty") {
		map[yPosition].splice(xPosition, 1, {
			id: map[yPosition][xPosition].id,
			color: `rgb(100, 255, 100)`,
			type: "exit",
			enemies: 0,
			cleared: true,
			visited: false,
		});
	} else {
		addExit();
	}
}
function addElite() {
	let xPosition = Math.floor(Math.random() * 5);
	let yPosition = Math.floor(Math.random() * 5);
	if (map[yPosition][xPosition].type == "empty") {
		map[yPosition].splice(xPosition, 1, {
			id: map[yPosition][xPosition].id,
			color: `rgb(255, 100, 100)`,
			type: "elite",
			enemies: 5 + player.cycle * 2 + Math.floor(Math.random() * 8),
			cleared: false,
			visited: false,
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

// oh boy
function playerWallCollision() {
	currentRoom = findCurrentRoom();
	if (currentRoom.cleared == true) {
		// Left
		if (currentRoom.id % 5 == 1) {
			if (player.x < 0) {
				player.x = 0;
			}
		} else {
			if (player.x < -35) {
				player.x = 984;
				player.currentRoomId -= 1;
				console.log(player.currentRoomId);
				createEnemies();
				playerProjectiles = [];
			}
		}
		// Right
		if (currentRoom.id % 5 == 0) {
			if (player.x > 950) {
				// Width -50
				player.x = 950;
			}
		} else {
			if (player.x > 984) {
				// width - 16
				player.x = -34;
				player.currentRoomId += 1;
				console.log(player.currentRoomId);
				createEnemies();
				playerProjectiles = [];
			}
		}
		// Up
		if (currentRoom.id <= 5) {
			if (player.y < 0) {
				player.y = 0;
			}
		} else {
			if (player.y < -35) {
				player.y = 659;
				player.currentRoomId -= 5;
				console.log(player.currentRoomId);
				createEnemies();
				playerProjectiles = [];
			}
		}
		// Down
		if (currentRoom.id >= 21) {
			if (player.y > 625) {
				player.y = 625;
			}
		} else {
			if (player.y > 659) {
				player.y = -34;
				player.currentRoomId += 5;
				console.log(player.currentRoomId);
				createEnemies();
				playerProjectiles = [];
			}
		}
	} else {
		if (player.x < 0) {
			if (player.x > -1 - player.speed) {
				player.x = 0;
			}
		}
		if (player.x > 950) {
			if (player.x > 951 + player.speed) {
				player.x = 950;
			}
		}
		if (player.y < 0) {
			if (player.y > -1 - player.speed) {
				player.y = 0;
			}
		}
		if (player.y > 625) {
			if (player.y > 626 + player.speed) {
				player.y = 625;
			}
		}
	}
	if (player.x < -50) {
		player.x = 0;
	}
	if (player.x > 1000) {
		player.x = 950;
	}
	if (player.y < -50) {
		player.y = 0;
	}
	if (player.y > 675) {
		player.y = 625;
	}

	drawMap();
	requestAnimationFrame(playerWallCollision);
}

// Find Current Room
function findCurrentRoom() {
	return map.flat().find((e) => e.id == player.currentRoomId);
}

// Projectiles

function createProjectile() {
	if (player.lastshot <= 0) {
		if (mouse.down) {
			playerProjectiles.push({
				x: player.x + 25,
				y: player.y + 25,
				angle: Math.atan2(
					mouse.y - (player.y + 25),
					mouse.x - (player.x + 25),
				),
				speed: 15,
			});
			player.lastshot = player.firerate;
			drawGame();
		}
	} else {
		player.lastshot--;
	}

	requestAnimationFrame(createProjectile);
}

function moveProjectiles() {
	for (let i = 0; i < playerProjectiles.length; i++) {
		playerProjectiles[i].x +=
			Math.cos(playerProjectiles[i].angle) * playerProjectiles[i].speed;
		playerProjectiles[i].y +=
			Math.sin(playerProjectiles[i].angle) * playerProjectiles[i].speed;
	}
	drawGame();
	requestAnimationFrame(moveProjectiles);
}

// Enemies

function createEnemies() {
	let currentRoom = findCurrentRoom();
	if (!currentRoom.cleared) {
		let enemiesSpawned = 0;
		let roomEnemies = currentRoom.enemies;
		for (let i = 0; i < roomEnemies; i++) {
			setTimeout(
				() => {
					enemies.push({
						x: Math.random() * 1100 - 50,
						y: Math.random() * 775 - 50,
						health: 100,
						speed: Math.random() * 3 + 2,
					});
					enemiesSpawned++;
					if (enemiesSpawned >= roomEnemies) {
						clearRoom();
					}
					drawGame();
				},
				1200 * (i + 1),
			);
		}
	}
}

function clearRoom() {
	if (enemies.length == 0) {
		let room = findCurrentRoom().id;
		console.log(room);
		let col = 0;
		let row = 0;
		while (room > 5) {
			room -= 5;
			row++;
		}
		while (room > 1) {
			room -= 1;
			col++;
		}
		map[row][col].cleared = true;
		console.log(map[row][col]);
		drawMap()
	} else {
		requestAnimationFrame(clearRoom);
	}
}

function moveEnemies() {
	for (let i = 0; i < enemies.length; i++) {
		let angle = Math.atan2(
			player.y - enemies[i].y,
			player.x - enemies[i].x,
		);
		enemies[i].x += Math.cos(angle) * enemies[i].speed;
		enemies[i].y += Math.sin(angle) * enemies[i].speed;
		enemies[i].speed += 0.004;
	}
	requestAnimationFrame(moveEnemies);
}

function projEnemyCol() {
	for (let i = 0; i < playerProjectiles.length; i++) {
		for (let k = 0; k < enemies.length; k++) {
			if (
				playerProjectiles[i].x > enemies[k].x &&
				playerProjectiles[i].x < enemies[k].x + 50 &&
				playerProjectiles[i].y > enemies[k].y &&
				playerProjectiles[i].y < enemies[k].y + 50
			) {
				console.log("hit");
				enemies[k].health -= player.damage;
				if (enemies[k].health <= 0) {
					enemies.splice(k, 1);
				}
				playerProjectiles.splice(i, 1);
				break;
			}
		}
	}
	requestAnimationFrame(projEnemyCol);
}

// Call Functions
makeMap();
drawGame();
requestAnimationFrame(playerMovement);
requestAnimationFrame(playerWallCollision);
requestAnimationFrame(createProjectile);
requestAnimationFrame(moveProjectiles);
requestAnimationFrame(moveEnemies);
requestAnimationFrame(projEnemyCol);

// To do list:
// enemies
//items
// working shop
// enemy health and collision with bullets (dear god)
// upgrades array
