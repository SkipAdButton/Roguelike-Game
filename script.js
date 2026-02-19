const mapCanvas = document.getElementById("mapCanvas");
const mapSize = mapCanvas.getBoundingClientRect();
const mapCtx = mapCanvas.getContext("2d");

const mainDisplay = document.getElementById("gameCanvas");
const gameSize = gameCanvas.getBoundingClientRect();
const gameCtx = gameCanvas.getContext("2d");

let eliteNum = 0
let percent = 0

const map = [
    [],
    [],
    [],
    [],
    []
]

const player = {
    x: 100,
    y: 100,
    health: 100,
    speed: 10,
    currentRoomId: 13,
    cycle: 1 //How many maps player has seen/played
}

const keys = [];
document.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
document.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

// Draw Screen
function drawMap() {
    // Reset
    mapCtx.clearRect(0, 0, 250, 250)
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
            mapCtx.fillRect((50 * x) + 5, (50 * y) + 5, 40, 40);
        }
    }
}
function drawGame() {
    // Reset
    gameCtx.clearRect(0, 0, 250, 250)
    gameCtx.fillStyle = "rgb(210 210 210)";
    gameCtx.fillRect(0, 0, 500, 500);

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
            map[y].push({ id: (y * 5) + (x + 1), color: `rgb(200 200 200)`, type: "empty", enemies: (player.cycle + 5 + (Math.floor(Math.random() * 5))), cleared: true })
        }
    }
    console.log(map)
    addSpawn()
    addShop()
    addExit()
    getNumElite()
    drawMap()
}
//Add stuff to map
function addSpawn() {
    map[2].splice(2, 1, { id: 13, color: `rgb(200 200 200)`, type: "spawn", enemies: 0, cleared: true })
}
function addShop() {
    let xPosition = (Math.floor(Math.random() * 5))
    let yPosition = (Math.floor(Math.random() * 5))
    if (map[xPosition][yPosition].type == "empty") {
        map[yPosition].splice(xPosition, 1, { id: map[yPosition][xPosition].id, color: `rgb(255, 255, 100)`, type: "shop", enemies: 0, cleared: true })
    } else {
        addShop()
    }
}
function addExit() {
    let xPosition = (Math.floor(Math.random() * 5))
    let yPosition = (Math.floor(Math.random() * 5))
    if (map[xPosition][yPosition].type == "empty") {
        map[yPosition].splice(xPosition, 1, { id: map[yPosition][xPosition].id, color: `rgb(100, 255, 100)`, type: "exit", enemies: 0, cleared: true })
    } else {
        addExit()
    }
}
function addElite() {
    let xPosition = (Math.floor(Math.random() * 5))
    let yPosition = (Math.floor(Math.random() * 5))
    if (map[xPosition][yPosition].type == "empty") {
        map[yPosition].splice(xPosition, 1, { id: map[yPosition][xPosition].id, color: `rgb(255, 100, 100)`, type: "elite", enemies: (5 + player.cycle * 2 + (Math.floor(Math.random() * 8))), cleared: false })
    } else {
        addElite()
    }
}
//Random num of elite
function getNumElite() {
    percent = Math.floor(Math.random() * 100)
    if (percent > 90) {
        eliteNum = 3
    } else if (percent > 70) {
        eliteNum = 2
    } else {
        eliteNum = 1
    }
    for(let i = eliteNum; i>0; i--) {
        addElite()
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
    requestAnimationFrame(playerMovement)
}

// oh boy
function playerWallCollision() {
    currentRoom = map.flat().find(e => e.id == player.currentRoomId);
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
                console.log(player.currentRoomId)
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
                console.log(player.currentRoomId)
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
                console.log(player.currentRoomId)
            }
        }
        // Down
        if (currentRoom.id >= 21) {
            if (player.y >   450) {
                player.y = 450;

            }
        } else {
            if (player.y > 485) {
                player.y = -34;
                player.currentRoomId += 5;
                console.log(player.currentRoomId)
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

    drawMap()
    requestAnimationFrame(playerWallCollision)
}


//Here
/* function draw(timestamp) {
  // Log the current frame time
  console.log('Running animation frame at', timestamp);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw); */

// Call Functions
makeMap()
drawGame()
requestAnimationFrame(playerMovement)
requestAnimationFrame(playerWallCollision)



// To do list:
// player shooting
// enemies
// working shop
// enemy health and collision with bullets (dear god)
// upgrades array
