const mapCanvas = document.getElementById("mapCanvas");
const mapSize = mapCanvas.getBoundingClientRect();
const mapCtx = mapCanvas.getContext("2d");

const mainDisplay = document.getElementById("gameCanvas");
const gameSize = gameCanvas.getBoundingClientRect();
const gameCtx = gameCanvas.getContext("2d");

let eliteNum = 0;
let percent = 0;

const map = [[], [], [], [], []];
let roomFloorColor = `rgb(200 200 200)`

const player = {
	x: 100,
	y: 100,
	health: 6,
	maxHealth: 6,
	speed: 7,
	coins: 0,
	firerate: 14,
	damage: 25,
	armor: 0,
	lastshot: 0,
	currentRoomId: 13,
	lastRoomId: 13,
	iframes: 0,
	allowedIFrames: 30,
	cycle: 1, //How many maps player has seen/played
};

//ITEMS START
let itemsEquipt = 0;

// Fire rate is applied as -(e/2) to avoid player confusion
const items = [
	[
		//common
		{ name: "Potato", damage: 10, speed: -1, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Its a Potato...", color: "#965", rarity: "common", },
		{ name: "Lab Rat", damage: 5, speed: 1, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Looks Chewy", color: "#aaa", rarity: "common", },
		{ name: "Overclock", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 1, armor: 0, allowedIFrames: 0, description: "110%", color: "#aaf", rarity: "common", },
		{ name: "Test", damage: 0, get speed() {return player.speed}, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "DESC", color: "#000", rarity: "template", },
	],
	[
		{ name: "Tanto", damage: 20, speed: 0, health: -2, maxHealth: -2, firerate: 0, armor: 0, allowedIFrames: 0, description: "-2 Max Health", color: "#000", rarity: "rare", },
	],
	[
		{ name: "Holy Grail", damage: 0, speed: 0, health: 1, maxHealth: 1, firerate: 0, armor: 0, allowedIFrames: 0, description: "Gives +1 Max Health", color: "#FFD700", rarity: "legendary", },
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "DESC", color: "#000", rarity: "template", },
	]
];

const equippedItems = []
let droppedItems = []
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
	gameCtx.fillStyle = roomFloorColor;
	gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

	// Dropped Items
	for (let i = 0; i < droppedItems.length; i++) {
		gameCtx.fillStyle = droppedItems[i].item.item.color;
		gameCtx.fillRect(droppedItems[i].x, droppedItems[i].y, 30, 30);
		gameCtx.fillStyle = "#000";
		gameCtx.textAlign = "center"
		gameCtx.textBaseline = "middle";
		gameCtx.font = "16px monospace";
		gameCtx.fillText(droppedItems[i].item.item.name, droppedItems[i].x + 15, droppedItems[i].y - 10)
		/* gameCtx.font = "12px monospace";
		gameCtx.fillText(droppedItems[i].item.item.description, droppedItems[i].x + 15, droppedItems[i].y + 40) */
	}

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
				enemies: (player.cycle * 2) + 5 + Math.floor(Math.random() * 5),
				cleared: false,
				visited: false,
			});
		}
	}
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
			enemies: (player.cycle * 3) + 7 + Math.floor(Math.random() * 5),
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

function clearScreen() {
	playerProjectiles = [];
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

function healthCheck(change) {
	if (player.iframes == 0) {
		player.health += change
		document.getElementById("displayHealth").innerHTML = ""
		for (let i = 0; i < player.health; i++) {
			document.getElementById("displayHealth").innerHTML += "❤️"
		}
		for (let i = 0; i < player.maxHealth - player.health; i++) {
			document.getElementById("displayHealth").innerHTML += "🖤"
		}
		player.iframes = player.allowedIFrames;
	}
	if (player.health <= 0) {
		player.health = 0
	}
}

function iframeCheck() {
	if (player.iframes > 0) {
		player.iframes -= 1
	}
	requestAnimationFrame(iframeCheck)
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
				createEnemies();
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
				createEnemies();

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
				createEnemies();

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
				createEnemies();

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

// onRoomChange
function onRoomChange() {
	if (player.currentRoomId != player.lastRoomId) {
		playerProjectiles = []
		droppedItems = []
		/* roomFloorColor = `rgb(${Math.floor(Math.random() * 51) + 150} ${Math.floor(Math.random() * 51) + 150} ${Math.floor(Math.random() * 51) + 150})` */
		player.lastRoomId = player.currentRoomId
		drawGame()
		drawMap()
	}
	requestAnimationFrame(onRoomChange)
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
					let spawnX = Math.ceil(Math.random() * 2)
					if (spawnX == 1) {
						spawnX = -50
					} else {
						spawnX = 1050
					}
					enemies.push({
						x: spawnX,
						y: Math.random() * 775 - 50,
					health: 50 + (50 * player.cycle),
						speed: Math.random() * 3 + 2,
					});
					enemiesSpawned++;
					if (enemiesSpawned >= roomEnemies) {
						clearRoom();
					}
					drawGame();
				},
				(1200 - (50 * player.cycle)) * (i + 1),
			);
		}
	}
}

function clearRoom() {
	if (enemies.length == 0) {
		let room = findCurrentRoom().id;
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
		setTimeout(() => {map[row][col].cleared = true; drawMap();},1000)
		spawnItem()
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

function playerEnemyCol() {
	for (let i = 0; i < enemies.length; i++) {
		if (player.x + 25 > enemies[i].x && player.x + 25 < enemies[i].x + 50 && player.y + 25 > enemies[i].y && player.y + 25 < enemies[i].y + 50) {
			healthCheck(-1)
		}
	}
	requestAnimationFrame(playerEnemyCol)
}

// Upgrade time baby
function upgrade(item) {
	let upgrade = items[0].find((e) => (e.name == item))
	player.health += upgrade.health
	player.maxHealth += upgrade.maxHealth
	player.speed += upgrade.speed
	player.firerate -= (upgrade.firerate / 2)
	player.damage += upgrade.damage
	player.allowedIFrames += upgrade.allowedIFrames
	player.armor += upgrade.armor
	healthCheck(0)
	equippedItems.push(upgrade.name)
	updateItemList()
}

function spawnItem() {
	droppedItems.push({ item: { item: items[0][Math.floor(Math.random() * items[0].length)] }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
}
function pickupItem() {
	if (keys["e"]) {
		for (let i = droppedItems.length - 1; i >= 0; i--) {
			if (droppedItems[i].x + 15 > player.x && droppedItems[i].x + 15 < player.x + 50 && droppedItems[i].y + 15 > player.y && droppedItems[i].y + 15 < player.y + 50) {
				upgrade(droppedItems[i].item.item.name)
				droppedItems.splice(i, 1)
				break;
			}
		}
	}
	requestAnimationFrame(pickupItem)
}
function updateItemList() {
	let html = ""
		for (let i = 0; i < equippedItems.length; i++) {
			html += `<p>${equippedItems[i]}</p>`
		}
	document.getElementById("itemList").innerHTML = html
}
function viewItem() {
	let nameDisplay = ""
	let statDisplay = ""
	for (let i = 0; i < droppedItems.length; i++) {
		if (droppedItems[i].x + 15 > player.x && droppedItems[i].x + 15 < player.x + 50 && droppedItems[i].y + 15 > player.y && droppedItems[i].y + 15 < player.y + 50) {
			nameDisplay = `${droppedItems[i].item.item.name}`
			statDisplay = `<u>${droppedItems[i].item.item.description}</u><br/>atk: ${droppedItems[i].item.item.damage} spd: ${droppedItems[i].item.item.speed} fr: ${droppedItems[i].item.item.firerate}`
		} else {
			nameDisplay = ""
			statDisplay = ""
		}
	}
	document.getElementById("itemNameDisplay").innerHTML = nameDisplay;
	document.getElementById("itemStatDisplay").innerHTML = statDisplay;
	requestAnimationFrame(viewItem)
}
spawnItem()
// Call Functions
makeMap();
drawGame();
requestAnimationFrame(iframeCheck)
requestAnimationFrame(playerMovement);
requestAnimationFrame(playerWallCollision);
requestAnimationFrame(createProjectile);
requestAnimationFrame(moveProjectiles);
requestAnimationFrame(moveEnemies);
requestAnimationFrame(projEnemyCol);
requestAnimationFrame(onRoomChange)
requestAnimationFrame(playerEnemyCol)
requestAnimationFrame(pickupItem)
requestAnimationFrame(viewItem)

// To do list:
// working shop & exit
// upgrades array

//localStorage.setItem("test", 15);
console.log(localStorage.getItem("test"));
