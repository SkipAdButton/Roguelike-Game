const mapCanvas = document.getElementById("mapCanvas");
const mapSize = mapCanvas.getBoundingClientRect();
const mapCtx = mapCanvas.getContext("2d");

const mainDisplay = document.getElementById("gameCanvas");
const gameSize = gameCanvas.getBoundingClientRect();
const gameCtx = gameCanvas.getContext("2d");

let eliteNum = 0;
let percent = 0;

let map = [[], [], [], [], []];
let roomFloorColor = `rgb(167, 167, 167)`

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

function correctValues() {
	if (player.health > player.maxHealth) {
		player.health = player.maxHealth
	}
	if (player.speed < 1) {
		player.speed = 1
	}
	if (player.damage < 1) {
		player.damage = 1
	}
	requestAnimationFrame(correctValues)
	healthCheck(0)
}
//ITEMS START
let itemsEquipt = 0;

// Fire rate is applied as -(x/2) to avoid player confusion
const items = [
	[
		//common
		{ name: "Potato", damage: 7, speed: -1, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Pretty Filling", color: "#965", rarity: "common", coins: 0, },
		{ name: "Overclock", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 2, armor: 0, allowedIFrames: 0, description: "110%", color: "#aaf", rarity: "common", coins: 0, },
		{ name: "Bandage", damage: 0, speed: 0, health: 1, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Heals 1 Health", color: "#ddc", rarity: "common", coins: 0, },
		{ name: "Running Shoes", damage: 0, speed: 1, health: 0, maxHealth: 0, firerate: 1, armor: 0, allowedIFrames: 0, description: "Limited Edition!", color: "#f44", rarity: "common", coins: 0, },
		{ name: "Box of Rocks", damage: 0, speed: -3, health: 0, maxHealth: 0, firerate: 6, armor: 0, allowedIFrames: 0, description: "Stand Your Ground", color: "#667", rarity: "common", coins: 0, },
		{ name: "Happy Feet", damage: -5, speed: 3, health: 0, maxHealth: 0, firerate: -2, armor: 0, allowedIFrames: 0, description: "Move Your Ground", color: "#ffa", rarity: "common", coins: 0, },
		{ name: "Guardian Angel ", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 10, description: "More Time Between Hits Taken", color: "#ffe", rarity: "common", coins: 0, },
		{ name: "Cheese", damage: 0, speed: 0, get health() { return Math.floor(Math.random() * 13) - 6 }, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "May Have Mold", color: "#FFD766", rarity: "common", coins: 0, },
		{ name: "Dead Rat", damage: -1, speed: -1, health: 0, maxHealth: 0, firerate: -1, armor: 0, allowedIFrames: 0, description: "I Wouldn't Eat That", color: "#0001", rarity: "common", coins: 0, },
		{ name: "A Platypus", damage: 3, speed: 1, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Where did Perry Go?", color: "#00B1B1", rarity: "common", coins: 0, },
		{ name: "Tub of Lard", damage: 0, speed: -3, health: 0, maxHealth: 0, firerate: 0, armor: 2, allowedIFrames: 0, description: "Could Take a Hit", color: "#F5F5DC", rarity: "common", coins: 0, },
		{ name: "Left Boxing Glove", damage: 0, speed: 1, health: 0, maxHealth: 0, firerate: 0, armor: 1, allowedIFrames: 0, description: "Left Hook!!", color: "#960f0f", rarity: "common", coins: 0, },
		{ name: "Right Boxing Glove", damage: 5, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Uppercut!!", color: "#960f0f", rarity: "common", coins: 0, },
		{ name: "Small Bag of Coins", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Don't Spend it all in One Place", color: "#4A2C2A", rarity: "common", coins: 20, },
		{ name: "Medium Bag of Coins", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Many a Coin", color: "#6B4423", rarity: "rare", coins: 50, },
		{ name: "Pick-Me-Up", damage: 0, speed: 0, health: 1, maxHealth: 0, firerate: 0, armor: 1, allowedIFrames: 0, description: "Back on Your feet", color: "#e77", rarity: "template", coins: 0, },

	],
	[
		{ name: "Tanto", damage: 20, speed: 0, health: -2, maxHealth: -2, firerate: 0, armor: 0, allowedIFrames: 0, description: "Commit Seppuku", color: "#A67B5B", rarity: "rare", coins: 0, },
		{ name: "Suspicious Syringe", damage: 0, speed: 0, health: 0, maxHealth: -2, firerate: 0, armor: 5, allowedIFrames: 0, description: "Use at Own Risk", color: "#cdc", rarity: "rare", coins: 0, },
		{ name: "Chug Jug", damage: 0, speed: 0, get health() { return player.maxHealth - player.health}, maxHealth: 0, firerate: 0, armor: 1, allowedIFrames: 0, description: "I really want to...", color: "#4EE5CF", rarity: "rare", coins: 0, },
		{ name: "Life Crystal", damage: 0, speed: 0, health: 1, maxHealth: 1, firerate: 0, armor: 0, allowedIFrames: 0, description: "Watch Out for Darts", color: "#D5384F", rarity: "rare", coins: 0, },
		{ name: "Focus Shot", damage: 65, speed: 0, health: 0, maxHealth: 0, firerate: -40, armor: 0, allowedIFrames: 0, description: "Don't Miss", color: "#224", rarity: "rare", coins: 0, },
		{ name: "Compound V", damage: 0, get speed() { return Math.floor(Math.random() * 10) - 2 }, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Side Effects Included", color: "#00F", rarity: "rare", coins: 0, },
		{ name: "Stuffed Potato", damage: 25, speed: -3, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Very Filling", color: "#B87", rarity: "rare", coins: 0, },

	],
	[
		{ name: "Holy Grail", damage: 0, speed: 0, health: 3, maxHealth: 3, firerate: 0, armor: 0, allowedIFrames: 0, description: "Good Movie, Too", color: "#FFD700", rarity: "legendary", coins: 0, },
		{ name: "Pack-a-Punch", get damage() { return player.damage }, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "Insta-Kill! (not really)", color: "#afa", rarity: "legendary", coins: 0, },
		{ name: "Terraspark Boots", damage: 0, speed: 5, health: 0, maxHealth: 0, firerate: 0, armor: 2, allowedIFrames: 0, description: "Just Fight WoF Already", color: "#81F240", rarity: "legendary", coins: 0, },
	],
	[
		{ name: "NAME", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "DESC", color: "#000", rarity: "template", coins: 0, },
		{ name: "Test", damage: 0, get speed() { return player.speed }, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "DESC", color: "#000", rarity: "template", coins: 0, },
		{ name: "Dev Bag", damage: 0, speed: 0, health: 0, maxHealth: 0, firerate: 0, armor: 0, allowedIFrames: 0, description: "You Shouldn't Have This", color: "#ff8", rarity: "template", coins: 10000, },
		{ name: "Orange Zapinator", damage: 999999, speed: 0, health: 0, maxHealth: 0, get firerate() { return player.firerate * 2 }, armor: 0, allowedIFrames: 0, description: "You Shouldn't Have This", color: "#FFBF00", rarity: "template", coins: 0, },
	]
];

const equippedItems = []
let droppedItems = []
let shopItems = []
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
let enemyProjectiles = [];

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
	gameCtx.clearRect(-5, -5, gameCanvas.width + 10, gameCanvas.height + 10);
	gameCtx.fillStyle = "rgb(167 167 167)";
	gameCtx.fillRect(-5, -5, gameCanvas.width + 10, gameCanvas.height + 10);
	let currentRoom = findCurrentRoom()

	// Exit Room
	if (currentRoom.type == "exit") {
		gameCtx.fillStyle = "rgb(100 100 100)";
		gameCtx.fillRect(450, 230, 100, 100);
		gameCtx.fillStyle = "rgb(0 0 20)";
		gameCtx.fillRect(460, 240, 80, 90);
		gameCtx.fillStyle = "rgb(150 150 150)";
		gameCtx.fillRect(460, 310, 80, 20);
		gameCtx.fillStyle = "rgb(120 120 120)";
		gameCtx.fillRect(465, 300, 70, 10);
		gameCtx.fillStyle = "rgb(60 60 60)";
		gameCtx.fillRect(470, 293, 60, 7);
		gameCtx.fillStyle = "rgb(30 30 30)";
		gameCtx.fillRect(475, 288, 50, 5);
	}

	// Items
	for (let i = 0; i < droppedItems.length; i++) {
		gameCtx.fillStyle = droppedItems[i].item.item.color;
		gameCtx.fillRect(droppedItems[i].x, droppedItems[i].y, 30, 30);
		gameCtx.fillStyle = "#000";
		gameCtx.textAlign = "center"
		gameCtx.textBaseline = "middle";
		gameCtx.font = "16px monospace";
		gameCtx.fillText(droppedItems[i].item.item.name, droppedItems[i].x + 15, droppedItems[i].y - 10)
	}
	if (currentRoom.type == "shop") {
		for (let i = 0; i < shopItems.length; i++) {
			gameCtx.fillStyle = shopItems[i].item.item.color;
			gameCtx.fillRect(shopItems[i].x, shopItems[i].y, 30, 30);
			gameCtx.fillStyle = "#000";
			gameCtx.textAlign = "center"
			gameCtx.textBaseline = "middle";
			gameCtx.font = "16px monospace";
			gameCtx.fillText(shopItems[i].item.item.name, shopItems[i].x + 15, shopItems[i].y - 10)
			gameCtx.fillText("Cost: ¢" + shopItems[i].cost, shopItems[i].x + 15, shopItems[i].y + 40)
		}
	}

	// Player Projectiles
	for (let i = 0; i < playerProjectiles.length; i++) {
		gameCtx.fillStyle = "#000038";
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
	// Enemy Projectiles
	for (let i = 0; i < enemyProjectiles.length; i++) {
		gameCtx.fillStyle = "rgb(0 0 0)";
		gameCtx.beginPath();
		gameCtx.arc(
			enemyProjectiles[i].x,
			enemyProjectiles[i].y,
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
		if (enemies[i].type == 1) {
			gameCtx.fillStyle = "rgb(100 100 100)";
			gameCtx.fillRect(enemies[i].x, enemies[i].y, 50, 50);
			gameCtx.fillStyle = "rgb(0 0 0)";
			gameCtx.fillRect(enemies[i].x, enemies[i].y + 10, 50, 5);
			gameCtx.fillRect(enemies[i].x + 10, enemies[i].y + 15, 10, 5);
			gameCtx.fillRect(enemies[i].x + 30, enemies[i].y + 15, 10, 5);
			gameCtx.fillStyle = "rgb(75 75 75)";
			gameCtx.fillRect(enemies[i].x + 15, enemies[i].y + 30, 20, 3);
		} else {
			gameCtx.fillStyle = "rgb(25 25 25)";
			gameCtx.fillRect(enemies[i].x, enemies[i].y, 50, 50);
			gameCtx.fillStyle = "rgb(150 150 150)";
			gameCtx.fillRect(enemies[i].x, enemies[i].y + 10, 50, 5);
			gameCtx.fillRect(enemies[i].x + 10, enemies[i].y + 14, 10, 6);
			gameCtx.fillRect(enemies[i].x + 30, enemies[i].y + 14, 10, 6);
			gameCtx.fillStyle = "rgb(10 10 10)";
			gameCtx.fillRect(enemies[i].x + 15, enemies[i].y + 30, 20, 3);
		}
	}
	// border 
	if (currentRoom.type !== "empty") {
		gameCtx.strokeStyle = roomFloorColor;
		gameCtx.strokeRect(1, 1, gameCanvas.width - 2, gameCanvas.height - 2);
		gameCtx.strokeRect(2, 2, gameCanvas.width - 4, gameCanvas.height - 4);
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
			enemies: ((player.cycle * 2) + 5 + Math.floor(Math.random() * 5)) * 2,
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
		eliteNum = 1;
	} else {
		eliteNum = 2;
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
	change = change * -1
	if (player.iframes == 0) {
		for (let i = 0; i < change; i++) {
			if (player.armor > 0) {
				player.armor -= 1
			} else {
				player.health -= 1
			}
		}
		document.getElementById("displayHealth").innerHTML = ""
		for (let i = 0; i < player.health; i++) {
			document.getElementById("displayHealth").innerHTML += "❤️"
		}
		for (let i = 0; i < player.armor; i++) {
			document.getElementById("displayHealth").innerHTML += "💛"
		}
		for (let i = 0; i < player.maxHealth - (player.health + player.armor); i++) {
			document.getElementById("displayHealth").innerHTML += "🖤"
		}
		if (change != 0) {
			player.iframes = player.allowedIFrames;
		}
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
	let currentRoom = findCurrentRoom()
	if (player.currentRoomId != player.lastRoomId) {
		playerProjectiles = []
		droppedItems = []
		/* roomFloorColor = `rgb(${Math.floor(Math.random() * 51) + 150} ${Math.floor(Math.random() * 51) + 150} ${Math.floor(Math.random() * 51) + 150})` */
		player.lastRoomId = player.currentRoomId
		if (currentRoom.type == "shop") {
			
			roomFloorColor = "rgb(255 255 0)"
		}else if(currentRoom.type == "elite"){
			roomFloorColor = "rgb(255 0 0)"
		}else if(currentRoom.type == "exit"){
			roomFloorColor = "rgb(0 255 0)"
		}else{
			roomFloorColor = `rgb(167, 167, 167)`
		}
		
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
	for (let i = 0; i < enemyProjectiles.length; i++) {
		enemyProjectiles[i].x +=
			Math.cos(enemyProjectiles[i].angle) * enemyProjectiles[i].speed;
		enemyProjectiles[i].y +=
			Math.sin(enemyProjectiles[i].angle) * enemyProjectiles[i].speed;
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
					let type = Math.ceil(Math.random() * 2)
					if (type == 1) {
						enemies.push({
							x: spawnX,
							y: Math.random() * 775 - 50,
							health: (100 * player.cycle),
							speed: Math.random() * 3 + 2,
							type: type
						});
					} else {
						enemies.push({
							x: spawnX,
							y: Math.random() * 775 - 50,
							health: (125 * player.cycle),
							speed: Math.random() * 2.5,
							type: type
						});console.log("type two created")
					}
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
		setTimeout(() => { map[row][col].cleared = true; drawMap(); }, 1000)
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
		if (enemies[i].type == 1) {
			enemies[i].speed += 0.004;
		}
	}
	requestAnimationFrame(moveEnemies);
}

function enemyShooting() {
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].type == 2) {
			let random = Math.floor(Math.random() * 100) + 1
			if (random == 1) {
				enemyProjectiles.push({
					angle: Math.atan2(
						player.y - enemies[i].y,
						player.x - enemies[i].x,
					),
					x: enemies[i].x + 25,
					y: enemies[i].y + 25,
					speed: 8,
				})
			}
		}
	}
	requestAnimationFrame(enemyShooting)
}

function playerEnemyProjCol() {
	for (let i = 0; i < enemyProjectiles.length; i++) {
		if (enemyProjectiles[i].x > player.x &&
			enemyProjectiles[i].x < player.x + 50 &&
			enemyProjectiles[i].y > player.y &&
			enemyProjectiles[i].y < player.y + 50) {
			healthCheck(-1)
			enemyProjectiles.splice(i,1)
		}
	}
	requestAnimationFrame(playerEnemyProjCol)
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
					player.coins++
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
	let upgrade = items.flat().find((e) => (e.name == item))
	player.health += upgrade.health
	player.maxHealth += upgrade.maxHealth
	player.speed += upgrade.speed
	player.firerate -= (upgrade.firerate / 2)
	player.damage += upgrade.damage
	player.allowedIFrames += upgrade.allowedIFrames
	player.armor += upgrade.armor
	player.coins += upgrade.coins
	healthCheck(0)
	equippedItems.push(upgrade.name)
	updateItemList()
}

function spawnItem() {
	let currentRoom = findCurrentRoom();
	console.log(currentRoom)
	let getItem = Math.floor(Math.random() * 4) + 1
	let random = Math.floor(Math.random() * 101)
	if (currentRoom.type == "elite") {
		if (random > 90) {
			droppedItems.push({ item: { item: items[2][Math.floor(Math.random() * items[2].length)] }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
		} else {
			droppedItems.push({ item: { item: items[1][Math.floor(Math.random() * items[1].length)] }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
		}
	} else {
		if (getItem !== 1) {
			if (random > 98) {
				droppedItems.push({ item: { item: items[2][Math.floor(Math.random() * items[2].length)] }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
			} else {
				if (random > 95) {
					droppedItems.push({ item: { item: items[1][Math.floor(Math.random() * items[1].length)] }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
				} else {
					droppedItems.push({ item: { item: items[0][Math.floor(Math.random() * items[0].length)] }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
				}
			}
		}
	}
}

document.addEventListener("keydown", (e) => { if (e.key == "i") { devSpawnItem(prompt("What Item do You Want to Spawn in?")) } })

function devSpawnItem(name) {
	let itemSearch = items.flat().find((e) => (e.name == name))
	if (itemSearch !== undefined) {
		droppedItems.push({ item: { item: items.flat().find((e) => (e.name == name)) }, x: Math.floor(Math.random() * 951), y: Math.floor(Math.random() * 626), })
	} else {
		alert("That is not a valid spelling of an item, caps matter.")
	}
}

function pickupItem() {
	let currentRoom = findCurrentRoom()
	if (keys["e"]) {
		for (let i = droppedItems.length - 1; i >= 0; i--) {
			if (droppedItems[i].x + 15 > player.x && droppedItems[i].x + 15 < player.x + 50 && droppedItems[i].y + 15 > player.y && droppedItems[i].y + 15 < player.y + 50) {
				upgrade(droppedItems[i].item.item.name)
				droppedItems.splice(i, 1)
				break;
			}
		}
		if (currentRoom.type == "shop") {
			for (let i = shopItems.length - 1; i >= 0; i--) {
			if (shopItems[i].x + 15 > player.x && shopItems[i].x + 15 < player.x + 50 && shopItems[i].y + 15 > player.y && shopItems[i].y + 15 < player.y + 50 && player.coins >= shopItems[i].cost) {
				upgrade(shopItems[i].item.item.name)
				player.coins -= shopItems[i].cost
				shopItems.splice(i, 1)
				break;
			}
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
	let currentRoom = findCurrentRoom()
	let nameDisplay = ""
	let statDisplay = ""
	for (let i = 0; i < droppedItems.length; i++) {
		if (droppedItems[i].x + 15 > player.x && droppedItems[i].x + 15 < player.x + 50 && droppedItems[i].y + 15 > player.y && droppedItems[i].y + 15 < player.y + 50) {
			nameDisplay = `${droppedItems[i].item.item.name}`
			statDisplay = `<u>${droppedItems[i].item.item.description}</u><br/>ATK: ${droppedItems[i].item.item.damage} SPD: ${droppedItems[i].item.item.speed} FR: ${droppedItems[i].item.item.firerate}<br/> HP: ${droppedItems[i].item.item.health} MAXHP: ${droppedItems[i].item.item.maxHealth} AR: ${droppedItems[i].item.item.armor}`
			break
		} else {
			nameDisplay = ""
			statDisplay = ""
		}
	}
	if (currentRoom.type == "shop") {
		for (let i = 0; i < shopItems.length; i++) {
		if (shopItems[i].x + 15 > player.x && shopItems[i].x + 15 < player.x + 50 && shopItems[i].y + 15 > player.y && shopItems[i].y + 15 < player.y + 50) {
			nameDisplay = `${shopItems[i].item.item.name}`
			statDisplay = `<u>${shopItems[i].item.item.description}</u><br/>ATK: ${shopItems[i].item.item.damage} SPD: ${shopItems[i].item.item.speed} FR: ${shopItems[i].item.item.firerate}<br/> HP: ${shopItems[i].item.item.health} MAXHP: ${shopItems[i].item.item.maxHealth} AR: ${shopItems[i].item.item.armor}`
			break
		} else {
			nameDisplay = ""
			statDisplay = ""
		}
	}
	}
	document.getElementById("itemNameDisplay").innerHTML = nameDisplay;
	document.getElementById("itemStatDisplay").innerHTML = statDisplay;
	requestAnimationFrame(viewItem)
}

//Shop
function spawnShopItems() {
	shopItems = []
	let random = Math.floor(Math.random() * 101)
	if (random > 66) {
		shopItems.push({ item: { item: items[2][Math.floor(Math.random() * items[2].length)] }, x: 300, y: 500, cost: Math.floor(Math.random() * 150) + 450})
	} else {
		shopItems.push({ item: { item: items[1][Math.floor(Math.random() * items[1].length)] }, x: 300, y: 500, cost: Math.floor(Math.random() * 150) + 150})
	}
	random = Math.floor(Math.random() * 101)
	if (random > 66) {
		shopItems.push({ item: { item: items[2][Math.floor(Math.random() * items[2].length)] }, x: 500, y: 500, cost: Math.floor(Math.random() * 150) + 450})
	} else {
		shopItems.push({ item: { item: items[1][Math.floor(Math.random() * items[1].length)] }, x: 500, y: 500, cost: Math.floor(Math.random() * 150) + 150})
	}
	random = Math.floor(Math.random() * 101)
	if (random > 66) {
		shopItems.push({ item: { item: items[2][Math.floor(Math.random() * items[2].length)] }, x: 700, y: 500, cost: Math.floor(Math.random() * 150) + 450})
	} else {
		shopItems.push({ item: { item: items[1][Math.floor(Math.random() * items[1].length)] }, x: 700, y: 500, cost: Math.floor(Math.random() * 150) + 150})
	}
}

function displayCoins() {
	document.getElementById("coinDisplay").innerHTML = `Coins: ${player.coins}`
	requestAnimationFrame(displayCoins)
}

// Exit Room
function exitFloor() {
	let currentRoom = findCurrentRoom()
	if (keys["e"] && currentRoom.type === "exit") {
		if (player.x + 25 > 450 && player.x + 25 < 550 && player.y + 25 > 230 && player.y + 25 < 330 ) {
				player.cycle++
				map = [[], [], [], [], []];
				player.currentRoomId = 13
				player.x = 50
				player.y = 50
				player.health += 2;
				spawnShopItems()
				makeMap()
				drawMap()
			}
	}
	requestAnimationFrame(exitFloor)
}

// Call Functions
makeMap();
drawGame();
spawnShopItems()
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
requestAnimationFrame(correctValues)
requestAnimationFrame(enemyShooting)
requestAnimationFrame(playerEnemyProjCol)
requestAnimationFrame(exitFloor)
requestAnimationFrame(displayCoins)
// To do list:
// working shop & exit
// upgrades array

//localStorage.setItem("test", 15);
console.log(localStorage.getItem("test"));
