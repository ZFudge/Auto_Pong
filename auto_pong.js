document.addEventListener("keydown",pushedKey);

game = {
	canvas: document.getElementById('canv'),
	context: null,
	speed: 10,
	bounces: 0,
	score: document.getElementById('score'),
	playerSpeed: 2,
	playerWidth: 40,
	playerHeight: 10,
	playerTwoPos: 20,
	playerOnePos: 320,
	active: true
}
game.context = game.canvas.getContext('2d');

let diff = document.getElementById('diff');

//ball object
ping = {
	x: game.canvas.width/2-5,
	y: game.canvas.height/2-5,
	vertical: 0,
	horizontal: 0,
	size: 10,
	line: [],
	// counts each position that the ball cross and stores them in the ping.line array
	lineage: false,
	serve: function() {
		let rand1 = Math.random();
		let rand2 = Math.random();
		ping.vertical = game.playerSpeed * 1.5;
		ping.horizontal = game.playerSpeed * 1.5;

		if (rand1 < 0.5) {
			ping.vertical += -ping.vertical*2;
		}
		if (rand2 < 0.5) {
			ping.horizontal += -ping.horizontal*2;
		}

		ping.x = game.canvas.width/2-5;
		ping.y = game.canvas.height/2-5;

		player.xInt = false;
		playerTwo.xInt = false;
	},
	adjust: function() {
		if (ping.x < 0) {
			//console.log('bounce','ping.x: ' + ping.x);
			ping.horizontal += (ping.horizontal*-2);
			ping.x = Math.abs(ping.x);
			//console.log('ping.x: ' + ping.x);
		} else if (ping.x + ping.size > game.canvas.width) {
			ping.horizontal -= (ping.horizontal*2);
			ping.x = game.canvas.width-ping.size-(ping.x-(game.canvas.width-ping.size));
		}

		ping.x += ping.horizontal;	
		ping.y += ping.vertical;
	},
	collisionCheck: function() {
		//if (ping.x >= player.x && ping.x <= player.x + player.width && ping.y + ping.size >= player.y && ping.y <= player.y + player.height) {
		if ( (ping.x >= player.x && ping.x <= player.x + player.width && ping.y + ping.size >= player.y && ping.y + ping.size <= player.y + player.height) || 
			(ping.x + ping.size >= player.x && ping.x + ping.size <= player.x + player.width && ping.y + ping.size >= player.y && ping.y + ping.size <= player.y + player.height)) {
			ping.vertical -= (ping.vertical*2);

			/*
			if (ping.y < playerTwo.y + playerTwo.height) {
				ping.y = ping.y + ((playerTwo.y + playerTwo.height - ping.y) * 2);
			} else if (ping.y + ping.size > player.y) {
				ping.y = ping.y - (( (ping.y + ping.size) - player.y) * 2);
			}
			*/

			ping.y = ping.y - (( (ping.y + ping.size) - player.y) * 2);

			let pingRange = (ping.x + ping.size/2 - player.x - 20) / 10;
			if (Math.abs(ping.horizontal < 15)) {
				ping.horizontal += pingRange;
			}
			ping.horizontal.toFixed(4);

			//diff.innerHTML = Math.abs((ping.x + ping.size/2) - player.xInt);

			player.xInt = false;
			game.bounces++;
			game.score.innerHTML = game.bounces;
		} else if ((ping.x >= playerTwo.x && ping.x <= playerTwo.x + playerTwo.width && ping.y >= playerTwo.y && ping.y <= playerTwo.y + playerTwo.height) ||
			(ping.x + ping.size >= playerTwo.x && ping.x + ping.size <= playerTwo.x + playerTwo.width && ping.y >= playerTwo.y && ping.y <= playerTwo.y + playerTwo.height)) {
			ping.vertical += (ping.vertical*-2);

			ping.y = ping.y + ((playerTwo.y + playerTwo.height - ping.y) * 2);

			let pingRange = (ping.x + ping.size/2 - playerTwo.x - 20) / 10;
			ping.horizontal += pingRange;
			ping.horizontal.toFixed(4);

			//diff.innerHTML = Math.abs((ping.x + ping.size/2) - playerTwo.xInt)

			playerTwo.xInt = false;
			game.bounces++;
			game.score.innerHTML = game.bounces;
		}
		// ping.vertical += -ping.vertical * 2;
	},
	checkScore: function() {
		if (ping.y <= 0) {
			ping.serve();
			document.body.style.backgroundColor = 'blue';
			//game.active = !game.active;
			clearInterval(pongInterval)
		} else if (ping.y + ping.size >= game.canvas.height) {
			ping.serve();
			document.body.style.backgroundColor = 'blue';
			//game.active = !game.active;
			clearInterval(pongInterval)
		}
	}
}

class Player {
	constructor(y) {
		this.y = y;
		this.x = game.canvas.width/2 - game.playerWidth/2;
		this.width = game.playerWidth;
		this.height = game.playerHeight;
		this.horizontal = 0;
		// stores the location of the x-axis where the ball will be when intersecting with the player's y axis 
		this.xInt = false;

		this.side = null;
		// checks for contact with walls
		this.checkSide = function() {
			if (this.x + this.width >= game.canvas.width && this.horizontal > 0 || this.x <= 0 && this.horizontal < 0) this.horizontal = 0;
		}
		// continuously checks the position of the ball's x axis and adjusts the player accordingly
		this.checkPingConst = function() {
			if (ping.x < this.x && (ping.vertical < 0 && this.y < game.canvas.height/2 || ping.vertical > 0 && this.y > game.canvas.height/2) ) {
				this.horizontal = -game.playerSpeed;
			} else if (ping.x > this.x + this.width && (ping.vertical < 0 && this.y < game.canvas.height/2 || ping.vertical > 0 && this.y > game.canvas.height/2) ) {
				this.horizontal = game.playerSpeed;
			} else if (ping.x > this.x + this.width/4 && ping.x < this.x + this.width * 0.75) {
				this.horizontal = 0;
			}
		}
		// checks player's xInt location in comparison to which side it intends to bounce the ball with and adjusts player accordingly
		this.checkPing = function() {
			if (this.xInt < 0 || this.xInt > game.canvas.width || !this.xInt && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y) ) {
				//console.log('xInt is false');
				this.dest();
			} else { //
				if (this.side) { // left
					if (this.x + ping.size/1.5 > this.xInt) {
						this.horizontal = -game.playerSpeed;
					} else if (this.x + ping.size*1.5 < this.xInt && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y)) {
						this.horizontal = game.playerSpeed;
					} else {
						this.horizontal = 0;
					}
				} else { // right
					if (this.x + this.width - ping.size/1.5 < this.xInt) {
						this.horizontal = game.playerSpeed;
					} else if (this.x + this.width - ping.size*1.5 > this.xInt && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y)) {
						this.horizontal = -game.playerSpeed;
					} else {
						this.horizontal = 0;
					}
				}
				/* keeps ball centered
				if (this.x + 22.5 < this.xInt) {
					this.horizontal = game.playerSpeed;
				} else if (this.x + 17.5 > this.xInt && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y)) {
					this.horizontal = -game.playerSpeed;
				} else {
					this.horizontal = 0;
				}
				*/
			}
		}
		// uses the distance from the ball as well as the horizontal and vertical speeds of the ball
		// to calculate where the ball will intersect with the goal
		this.dest = function() {
			let w = game.canvas.width;
			let h = ping.horizontal; 
			let v = Math.abs(ping.vertical);
			let yD = Math.abs(ping.y - this.y);
			yD -= ping.size/2;
			// 
			this.side = Math.random() > 0.5;

			let y = Math.round(yD/v);
			let x = ping.x;
			
			if (ping.lineage) {
				ping.line = [];
				let a = 0;
				let b = ping.y < game.canvas.height/2; // upper side

				if (b) {
					a = playerTwo.y + playerTwo.height;
				} else {
					a = player.y;
				}
			}

			for(let i=0;i<y;i++) {
				if (ping.lineage) {   
					a += ping.vertical;
					ping.line.push(
						{
							xa: x + ping.size/2,
							ya: a
						});
				}

				x += h;
				if (x + ping.size > w || x < 0) {
					h += -h*2;
					if (x < 0) {
						x += -x*2;
					} else {
						x = w-ping.size - (x - (w-ping.size) );
					}
				}
			}
			this.xInt = Math.round(x + ping.size/2);
		}

	}
}

// draws the path the ball will follow
function linedraw() {
	for(let prop in ping.line) {
		game.context.fillStyle = '#0FF';
		game.context.fillRect(ping.line[prop].xa,ping.line[prop].ya,1,1);
	}
}

let playerTwo = new Player(game.playerTwoPos);
let player = new Player(game.playerOnePos);

ping.serve();
pongInterval = setInterval(pong,game.speed);

function pong() {
	game.context.fillStyle = 'black';
	game.context.fillRect(0,0,game.canvas.width,game.canvas.height);

	game.context.fillStyle = 'white';
	game.context.fillRect(playerTwo.x,playerTwo.y,playerTwo.width,playerTwo.height);
	game.context.fillRect(player.x,player.y,player.width,player.height);

	game.context.fillRect(ping.x,ping.y,ping.size,ping.size);

	if (ping.lineage) {
		linedraw();
	}
	game.context.fillStyle = '#0F0';
	game.context.fillRect(ping.x+4,ping.y+4,2,2);

	player.checkPing();
	player.checkSide();

	player.x += player.horizontal;

	playerTwo.checkPing();
	playerTwo.checkSide();

	playerTwo.x += playerTwo.horizontal;

	ping.adjust();
	ping.collisionCheck();
	ping.checkScore();

	//console.log('pong');
}

function pushedKey(btn) {
	if (btn.keyCode === 82) {
		refresh();
	}
	
	if (btn.keyCode === 37) {
		player.horizontal = -1;
	} else if (btn.keyCode === 38 || btn.keyCode === 40) {
		player.horizontal = 0;
	} else if (btn.keyCode === 39) {
		player.horizontal = 1;
	} else if (btn.keyCode === 76) {
		ping.lineage = !ping.lineage;
	}

	if (btn.keyCode === 32) {
		stopAndGo();
	} else if (btn.keyCode === 84) {
		test();
	}
}

function test() {
	console.log('test');
	document.body.style.backgroundColor = 'blue';
}

function stopAndGo() {
	if (game.active) {
		clearInterval(pongInterval);
	} else {
		pongInterval = setInterval(pong,game.speed);
	}
	game.active = !game.active;
}

function refresh() {
	ping.serve();
	document.body.style.backgroundColor = 'white';
}


game.canvas.onclick = function() {
	ping.lineage = !ping.lineage;
}
