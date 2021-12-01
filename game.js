let canvas;
let ctx;
let time;
let farmer = {
	position: {
		x: 0,
		y: 0,
	},
	sprite: {

	},
	speed: 7
};

let keys = {
	up: false,
	down: false,
	right: false,
	left: false,
}

let ground = {
	sprite: {

	}
}

let plant_sprites = [
	plant_grow1,
	plant_grow2,
	plant_fruit1,
	plant_fruit2,
	plant_dead,
]

let plants = []
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);



function keyDownHandler(e) {
	// Handle key down event
	if (e.key == "Right" || e.key == "ArrowRight") {
		keys.right = true;
	} else if (e.key == "Left" || e.key == "ArrowLeft") {
		keys.left = true;
	} else if (e.key == "Up" || e.key == "ArrowUp") {
		keys.up = true;
	} else if (e.key == "Down" || e.key == "ArrowDown") {
		keys.down = true;
	}
}
function keyUpHandler(e) {
	// Handle key up event
	if (e.key == "Right" || e.key == "ArrowRight") {
		keys.right = false;
	} else if (e.key == "Left" || e.key == "ArrowLeft") {
		keys.left = false;
	} else if (e.key == "Up" || e.key == "ArrowUp") {
		keys.up = false;
	} else if (e.key == "Down" || e.key == "ArrowDown") {
		keys.down = false;
	}
}

function generatePlants() {
	// Generate an new plant on a time interval
	setInterval(() => {
		plants.push({
			x: 32 * Math.floor(Math.random() * 1024 / 32),
			y: 32 * Math.floor(Math.random() * 512 / 32),
			state: 0,
			last_updated: time,
		})
	}, 1000)
}

function updatePlants() {
	plants.forEach((plant, index) => {
		if (time - plant.last_updated >= 2000) {
			if (plant.state == 4) {
				plants.splice(index, 1);
			} else {
				plant.state += 1;
				plant.last_updated = time;
			}
		}
	})
}

function physics() {
	// Update the physics
	farmer.position.x += keys.right ? farmer.speed : 0;
	farmer.position.x -= keys.left ? farmer.speed : 0;
	farmer.position.y -= keys.up ? farmer.speed : 0;
	farmer.position.y += keys.down ? farmer.speed : 0;

	if (farmer.position.x >= 1024 - 32) {
		farmer.position.x = 1024 - 32
	}
	if (farmer.position.x <= 0) {
		farmer.position.x = 0
	}
	if (farmer.position.y >= 512 - 32) {
		farmer.position.y = 512 - 32
	}
	if (farmer.position.y <= 0) {
		farmer.position.y = 0
	}
}

function collide(plant, farmer) {
	if (farmer.position.x > plant.position.x - 32 || farmer.position.x < plant.position.x + 32) {
		console.log('collide')
	}
}

function harvest() {
	plants.forEach((plant) => {
		collide(plant, farmer);
	})
}

function drawPlants() {
	// Draw the plants
	plants.forEach(plant => {
		ctx.drawImage(plant_sprites[plant.state], plant.x, plant.y);
	});
}

function drawFarmer() {
	// Draw the farmer
	ctx.drawImage(farmer.sprite, farmer.position.x, farmer.position.y);
}

function drawground() {
	// Draw the ground
	for (let j = 0; j < 512 / 32; j++) {
		for (let i = 0; i < 1024 / 32; i++) {
			ctx.drawImage(ground.sprite, i * 32, j * 32);
		}
	}
}


function erase() {
	// Erases the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function preload() {
	// Load assets into memory
	farmer.sprite = document.getElementById("farmer");
	ground.sprite = document.getElementById("ground");
	plant_sprites.plant_grow1 = document.getElementById("plant_grow1");
	plant_sprites.plant_grow2 = document.getElementById("plant_grow2");
	plant_sprites.plant_fruit1 = document.getElementById("plant_fruit1");
	plant_sprites.plant_fruit2 = document.getElementById("plant_fruit2");
	plant_sprites.plant_dead = document.getElementById("plant_dead");
}

function init() {
	// Initialize the game
	drawground();
	drawFarmer();
	generatePlants()
}

function eventLoop(t) {
	// This runs once every frame
	time = t;
	erase();
	physics();
	drawground();
	updatePlants();
	drawPlants();
	drawFarmer();
	requestAnimationFrame(eventLoop);
}



preload(); // First Preload the assets
init(); // Then initialize the game
eventLoop(); // call the event loop
