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

ball = {
	x: game.canvas.width/2-5,
	y: game.canvas.height/2-5,
	vertical: 0,
	horizontal: 0,
	size: 10,
	line: [],
	// determines if the path the ball will follow will be stored in the ball.line array
	trackline: false,
	// randomizes the direction of a freshly served ball
	serve: function() {
		let rand1 = Math.random();
		let rand2 = Math.random();
		ball.vertical = game.playerSpeed * 1.5;
		ball.horizontal = game.playerSpeed * 1.5;

		if (rand1 < 0.5) {
			ball.vertical += -ball.vertical*2;
		}
		if (rand2 < 0.5) {
			ball.horizontal += -ball.horizontal*2;
		}

		ball.x = game.canvas.width/2-5;
		ball.y = game.canvas.height/2-5;

		player.xInt = false;
		playerTwo.xInt = false;
	},
	// bounces the ball if it hits a well, then applies horizontal and vertical speeds to the ball
	adjust: function() {
		if (ball.x < 0) {
			//console.log('bounce','ball.x: ' + ball.x);
			ball.horizontal += (ball.horizontal*-2);
			ball.x = Math.abs(ball.x);
			//console.log('ball.x: ' + ball.x);
		} else if (ball.x + ball.size > game.canvas.width) {
			ball.horizontal -= (ball.horizontal*2);
			ball.x = game.canvas.width-ball.size-(ball.x-(game.canvas.width-ball.size));
		}

		ball.x += ball.horizontal;	
		ball.y += ball.vertical;
	},
	// checks to see if the ball has hit a player
	collisionCheck: function() {
		//if (ball.x >= player.x && ball.x <= player.x + player.width && ball.y + ball.size >= player.y && ball.y <= player.y + player.height) {
		if ( (ball.x >= player.x && ball.x <= player.x + player.width && ball.y + ball.size >= player.y && ball.y + ball.size <= player.y + player.height) || 
			(ball.x + ball.size >= player.x && ball.x + ball.size <= player.x + player.width && ball.y + ball.size >= player.y && ball.y + ball.size <= player.y + player.height)) {
			ball.vertical -= (ball.vertical*2);

			/*
			if (ball.y < playerTwo.y + playerTwo.height) {
				ball.y = ball.y + ((playerTwo.y + playerTwo.height - ball.y) * 2);
			} else if (ball.y + ball.size > player.y) {
				ball.y = ball.y - (( (ball.y + ball.size) - player.y) * 2);
			}
			*/

			ball.y = ball.y - (( (ball.y + ball.size) - player.y) * 2);

			let ballRange = (ball.x + ball.size/2 - player.x - 20) / 10;
			if (Math.abs(ball.horizontal < 15)) {
				ball.horizontal += ballRange;
			}
			ball.horizontal.toFixed(4);

			//diff.innerHTML = Math.abs((ball.x + ball.size/2) - player.xInt);

			player.xInt = false;
			game.bounces++;
			game.score.innerHTML = game.bounces;
		} else if ((ball.x >= playerTwo.x && ball.x <= playerTwo.x + playerTwo.width && ball.y >= playerTwo.y && ball.y <= playerTwo.y + playerTwo.height) ||
			(ball.x + ball.size >= playerTwo.x && ball.x + ball.size <= playerTwo.x + playerTwo.width && ball.y >= playerTwo.y && ball.y <= playerTwo.y + playerTwo.height)) {
			ball.vertical += (ball.vertical*-2);

			ball.y = ball.y + ((playerTwo.y + playerTwo.height - ball.y) * 2);

			let ballRange = (ball.x + ball.size/2 - playerTwo.x - 20) / 10;
			ball.horizontal += ballRange;
			ball.horizontal.toFixed(4);

			//diff.innerHTML = Math.abs((ball.x + ball.size/2) - playerTwo.xInt)

			playerTwo.xInt = false;
			game.bounces++;
			game.score.innerHTML = game.bounces;
		}
		// ball.vertical += -ball.vertical * 2;
	},
	checkScore: function() {
		if (ball.y <= 0) {
			ball.serve();
			document.body.style.backgroundColor = 'blue';
			//game.active = !game.active;
			clearInterval(pongInterval)
		} else if (ball.y + ball.size >= game.canvas.height) {
			ball.serve();
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
		this.checkBallConst = function() {
			if (ball.x < this.x && (ball.vertical < 0 && this.y < game.canvas.height/2 || ball.vertical > 0 && this.y > game.canvas.height/2) ) {
				this.horizontal = -game.playerSpeed;
			} else if (ball.x > this.x + this.width && (ball.vertical < 0 && this.y < game.canvas.height/2 || ball.vertical > 0 && this.y > game.canvas.height/2) ) {
				this.horizontal = game.playerSpeed;
			} else if (ball.x > this.x + this.width/4 && ball.x < this.x + this.width * 0.75) {
				this.horizontal = 0;
			}
		}
		// checks player's xInt location in comparison to which side it intends to bounce the ball with and adjusts player accordingly
		this.checkBall = function() {
			if (this.xInt < 0 || this.xInt > game.canvas.width || !this.xInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y) ) {
				//console.log('xInt is false');
				this.dest();
			} else { //
				if (this.side) { // left
					if (this.x + ball.size/1.5 > this.xInt) {
						this.horizontal = -game.playerSpeed;
					} else if (this.x + ball.size*1.5 < this.xInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) {
						this.horizontal = game.playerSpeed;
					} else {
						this.horizontal = 0;
					}
				} else { // right
					if (this.x + this.width - ball.size/1.5 < this.xInt) {
						this.horizontal = game.playerSpeed;
					} else if (this.x + this.width - ball.size*1.5 > this.xInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) {
						this.horizontal = -game.playerSpeed;
					} else {
						this.horizontal = 0;
					}
				}
				/* keeps ball centered
				if (this.x + 22.5 < this.xInt) {
					this.horizontal = game.playerSpeed;
				} else if (this.x + 17.5 > this.xInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) {
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
			let h = ball.horizontal; 
			let v = Math.abs(ball.vertical);
			let yD = Math.abs(ball.y - this.y);
			yD -= ball.size/2;
			// 
			this.side = Math.random() > 0.5;

			let y = Math.round(yD/v);
			let x = ball.x;
			
			if (ball.trackline) {
				ball.line = [];
				var a = 0;
				let b = ball.y < game.canvas.height/2; // upper side

				if (b) {
					a = playerTwo.y + playerTwo.height;
				} else {
					a = player.y;
				}
			}

			for(let i=0;i<y;i++) {
				if (ball.trackline) {   
					a += ball.vertical;
					ball.line.push(
						{
							xa: x + ball.size/2,
							ya: a
						});
				}

				x += h;
				if (x + ball.size > w || x < 0) {
					h += -h*2;
					if (x < 0) {
						x += -x*2;
					} else {
						x = w-ball.size - (x - (w-ball.size) );
					}
				}
			}
			this.xInt = Math.round(x + ball.size/2);
		}

	}
}

// draws the path the ball will follow
function linedraw() {
	for(let prop in ball.line) {
		game.context.fillStyle = '#0FF';
		game.context.fillRect(ball.line[prop].xa,ball.line[prop].ya,1,1);
	}
}

let playerTwo = new Player(game.playerTwoPos);
let player = new Player(game.playerOnePos);

ball.serve();
pongInterval = setInterval(pong,game.speed);

function pong() {
	game.context.fillStyle = 'black';
	game.context.fillRect(0,0,game.canvas.width,game.canvas.height);

	game.context.fillStyle = 'white';
	game.context.fillRect(playerTwo.x,playerTwo.y,playerTwo.width,playerTwo.height);
	game.context.fillRect(player.x,player.y,player.width,player.height);

	game.context.fillRect(ball.x,ball.y,ball.size,ball.size);

	if (ball.trackline) {
		linedraw();
	}
	game.context.fillStyle = '#0F0';
	game.context.fillRect(ball.x+4,ball.y+4,2,2);

	player.checkBall();
	player.checkSide();

	player.x += player.horizontal;

	playerTwo.checkBall();
	playerTwo.checkSide();

	playerTwo.x += playerTwo.horizontal;

	ball.adjust();
	ball.collisionCheck();
	ball.checkScore();

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
		ball.trackline = !ball.trackline;
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
	ball.serve();
	document.body.style.backgroundColor = 'white';
}


game.canvas.onclick = function() {
	ball.trackline = !ball.trackline;
}
