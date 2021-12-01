let canvas;
let ctx;
let time;
let score = 0;


let ground = {
	sprite: {

	}
};

let farmer = {
	sprite: {

	},
	position: {
		x: 0,
		y: 0,
	},
	speed: 7,
};

let keys = {
	up: false,
	down: false,
	right: false,
	left: false,
};

let plant_sprites = [
	plant_grow1,
	plant_grow2,
	plant_fruit1,
	plant_fruit2,
	plant_dead,
];

let plants = [];

canvas = document.getElementById('myCanvas')
ctx = canvas.getContext('2d')
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
	if (e.key === 'Right' || e.key === 'ArrowRight') {
		keys.right = true;
	} else if (e.key === 'Left' || e.key === 'ArrowLeft') {
		keys.left = true;
	} else if (e.key === 'Down' || e.key === 'ArrowDown') {
		keys.down = true;
	} else if (e.key === 'Up' || e.key === 'ArrowUp') {
		keys.up = true;
	}
}

function keyUpHandler(e) {
	if (e.key === 'Right' || e.key === 'ArrowRight') {
		keys.right = false;
	} else if (e.key === 'Left' || e.key === 'ArrowLeft') {
		keys.left = false;
	} else if (e.key === 'Down' || e.key === 'ArrowDown') {
		keys.down = false;
	} else if (e.key === 'Up' || e.key === 'ArrowUp') {
		keys.up = false;
	}
}

function boundFarmer() {
	if (farmer.position.x >= 1024 - 32) {
		farmer.position.x = 1024 - 32;
	}
	if (farmer.position.x <= 0) {
		farmer.position.x = 0;
	}
	if (farmer.position.y >= 512 - 32) {
		farmer.position.y = 512 - 32;
	}
	if (farmer.position.y <= 0) {
		farmer.position.y = 0;
	}
}

function preload() {
	ground.sprite = document.getElementById('ground');
	farmer.sprite = document.getElementById('farmer');
	plant_sprites.plant_grow1 = document.getElementById('plant_grow1');
	plant_sprites.plant_grow2 = document.getElementById('plant_grow2');
	plant_sprites.plant_fruit1 = document.getElementById('plant_fruit1');
	plant_sprites.plant_fruit2 = document.getElementById('plant_fruit2');
	plant_sprites.plant_dead = document.getElementById('plant_dead');
}

function init() {
	document.getElementById('score').innerHTML = 'Score: 0';
	drawGround();
	drawPlants();
}

function drawFarmer() {
	ctx.drawImage(farmer.sprite, farmer.position.x, farmer.position.y);
}

function generatePlants() {
	setInterval(() => {
		plants.push({
			x: 32 * Math.floor(Math.random() * 1024 / 32),
			y: 32 * Math.floor(Math.random() * 512 / 32),
			state: 0,
			last_updated: time,
		})
	}, 1000)
}

function checkCollision() {
	plants.forEach((plant, index) => {
		if (farmer.position.x >= plant.x - 32
			&& farmer.position.x <= plant.x + 32
			&& farmer.position.y >= plant.y - 32
			&& farmer.position.y <= plant.y + 32
			&& plant.state === 3) {
			plants.splice(index, 1);
			score += 1;
			document.getElementById('score').innerHTML = 'Score: ' + score;
		}
	})
}

function growPlants() {
	plants.forEach((plant, index) => {
		if (time - plant.last_updated >= 2000) {
			if (plant.state === 4) {
				plants.splice(index, 1);
			} else {
				plant.state += 1;
				plant.last_updated = time;
			}
		}
	})
}

function drawPlants() {
	plants.forEach(plant => {
		ctx.drawImage(plant_sprites[plant.state], plant.x, plant.y);
	})
}

function drawGround() {
	for (let i = 0; i < 1024 / 32; i++) {
		for (let j = 0; j < 512 / 32; j++) {
			ctx.drawImage(ground.sprite, i * 32, j * 32);
		}
	}
}

function updateFarmer() {
	farmer.position.x += keys.right ? farmer.speed : 0;
	farmer.position.x -= keys.left ? farmer.speed : 0;
	farmer.position.y -= keys.up ? farmer.speed : 0;
	farmer.position.y += keys.down ? farmer.speed : 0;
}

function eraseCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function eventLoop(t) {
	time = t;
	eraseCanvas();
	updateFarmer();
	boundFarmer();
	drawGround();
	checkCollision();
	growPlants();
	drawPlants();
	drawFarmer();
	requestAnimationFrame(eventLoop)
}

preload();
init();
generatePlants();
eventLoop();