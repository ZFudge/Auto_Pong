document.addEventListener("keydown",pushedKey);

const game = {
	canvas: document.getElementById('canv'),
	context: null,
	speed: 10,
	bounces: 0,
	bounce: document.getElementById('bounce'),
	playerSpeed: 5,
	playerWidth: 50,
	playerHeight: 12,
	p2Score: document.getElementById('p2'),
	p1Score: document.getElementById('p1'),
	active: true
}
game.context = game.canvas.getContext('2d');
game.playerTwoPos = 20;
game.playerOnePos = game.canvas.height - 20 - game.playerHeight;

const diff = document.getElementById('diff');

const ball = {
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
		ball.vertical = game.playerSpeed;
		ball.horizontal = game.playerSpeed * (Math.random() * 3);

		if (Math.random() < 0.5) ball.vertical += -ball.vertical*2;
		if (Math.random() < 0.5) ball.horizontal += -ball.horizontal*2;

		ball.x = game.canvas.width/2 - ball.size/2;
		ball.y = game.canvas.height/2 - ball.size/2;

		player.xInt = false;
		playerTwo.xInt = false;
	},
	// bounces the ball if it hits a well, then applies horizontal and vertical speeds to the ball
	adjust: function() {
		if (ball.x < 0) {
			ball.horizontal += (ball.horizontal*-2);
			ball.x = Math.abs(ball.x);
		} else if (ball.x + ball.size > game.canvas.width) {
			ball.horizontal -= (ball.horizontal*2);
			ball.x = game.canvas.width-ball.size-(ball.x-(game.canvas.width-ball.size));
		}
		ball.x += ball.horizontal;	
		ball.y += ball.vertical;
	},
	// checks to see if the ball has hit a player
	collisionCheck: function() {
		if ( (ball.x >= player.x && ball.x <= player.x + player.width && ball.y + ball.size >= player.y && ball.y + ball.size <= player.y + player.height) || 
			(ball.x + ball.size >= player.x && ball.x + ball.size <= player.x + player.width && ball.y + ball.size >= player.y && ball.y + ball.size <= player.y + player.height)) {

			ball.vertical -= (ball.vertical*2);
			ball.y = ball.y - (( (ball.y + ball.size) - player.y) * 2);
			let ballRange = (ball.x + ball.size/2 - player.x - 20) / 10;
			if (Math.abs(ball.horizontal < 15)) {
				ball.horizontal += ballRange;
			}
			ball.horizontal.toFixed(4);

			player.xInt = false;

			game.bounces++;
			game.bounce.innerHTML = game.bounces;
		} else if ((ball.x >= playerTwo.x && ball.x <= playerTwo.x + playerTwo.width && ball.y >= playerTwo.y && ball.y <= playerTwo.y + playerTwo.height) ||
			(ball.x + ball.size >= playerTwo.x && ball.x + ball.size <= playerTwo.x + playerTwo.width && ball.y >= playerTwo.y && ball.y <= playerTwo.y + playerTwo.height)) {

			ball.vertical += (ball.vertical*-2);
			ball.y = ball.y + ((playerTwo.y + playerTwo.height - ball.y) * 2);
			let ballRange = (ball.x + ball.size/2 - playerTwo.x - 20) / 10;
			ball.horizontal += ballRange;
			ball.horizontal.toFixed(4);

			playerTwo.xInt = false;

			game.bounces++;
			game.bounce.innerHTML = game.bounces;
		}
	},
	// checks if ball has scored on a player
	checkScore: function() {
		if (ball.y <= 0 || ball.y + ball.size >= game.canvas.height) {
			(ball.y <= 0) ? game.p1Score.innerHTML++ : game.p2Score.innerHTML++;
			ball.serve();
			//document.body.style.backgroundColor = 'blue'; clearInterval(pongInterval);
		}
	}
}

class Player {
	constructor(y) {
		this.y = y;
		this.x = game.canvas.width/2 - game.playerWidth/2;
		this.width = game.playerWidth;
		this.height = game.playerHeight;
		this.horizontal = 0; // sets horizontal direction
		// stores the location of the x-axis where the ball will be when intersecting with the player's y axis 
		this.xInt = false;
		// this.side stores the random side the player intends to bounce the ball with, true for left, false for right
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
				this.setDestination();
			} else {
				if (this.side) { // left
					if (this.x + ball.size/1.5 > this.xInt && typeof this.xInt == 'number') {
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
				(this.x + 22.5 < this.xInt) ? this.horizontal = game.playerSpeed : (this.x + 17.5 > this.xInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) ? this.horizontal = -game.playerSpeed : this.horizontal = 0;
				*/
			}
		}
		// uses the distance from the ball as well as the horizontal and vertical speeds of the ball
		// to calculate where the ball will intersect with the player
		this.setDestination = function() {
			let w = game.canvas.width;
			let h = ball.horizontal; 
			let v = Math.abs(ball.vertical);
			let verticalRange = Math.abs(ball.y - this.y);
			verticalRange -= ball.size/2;

			//randomly determines which side the player will hit the ball with
			this.side = Math.random() > 0.5;

			let y = Math.round(verticalRange/v);
			let x = ball.x;
			let dot;
			
			if (ball.trackline) {
				ball.line = [];
				dot = ball.y + ball.size/2; // used to plot the path the ball will follow. 
			}

			for (let i = 0; i < y; i++) {
				if (ball.trackline) {   
					dot += ball.vertical;
					ball.line.push(
						{
							xdot: parseFloat(x + ball.size/2).toFixed(0),
							ydot: dot
						});
				}

				x += h;
				if (x + ball.size > w || x < 0) { // bounces line off walls
					h += -h*2;
					(x < 0) ? x += -x*2 : x = w-ball.size - (x - (w-ball.size) ); // bounce
				}
			}
			this.xInt = Math.round(x + ball.size/2);
		}
	}
}

// draws the path the ball will follow
function linedraw() {
	for(let prop in ball.line) {
		game.context.fillStyle = '#0F0';
		game.context.fillRect(ball.line[prop].xdot,ball.line[prop].ydot, 1, 1);
		/*   * /
		game.context.beginPath();
	    game.context.arc(ball.line[prop].xdot, ball.line[prop].xdot, 1, 0, 2 * Math.PI);
	    game.context.fill();
	    // */
	}
}

const playerTwo = new Player(game.playerTwoPos);
playerTwo.name = 'player-two';
const player = new Player(game.playerOnePos);
player.name = 'player-one';

ball.serve();
let pongInterval = setInterval(pong,game.speed);

function pong() {
	game.context.fillStyle = 'black';
	game.context.fillRect(0,0,game.canvas.width,game.canvas.height);

	game.context.fillStyle = 'white';
	game.context.fillRect(playerTwo.x,playerTwo.y,playerTwo.width,playerTwo.height);
	game.context.fillRect(player.x,player.y,player.width,player.height);

	game.context.fillRect(ball.x,ball.y,ball.size,ball.size);

	if (ball.trackline) linedraw();

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
	if (btn.keyCode === 82) refresh();
	if (btn.keyCode === 76) ball.trackline = !ball.trackline;
	if (btn.keyCode === 32) stopAndGo();
	if (btn.keyCode === 84) test();
	/* // player arrow keys input
	if (btn.keyCode === 37) player.horizontal = -1;
	if (btn.keyCode === 38 || btn.keyCode === 40) player.horizontal = 0;
	if (btn.keyCode === 39) player.horizontal = 1;
	*/
}

function test() {
	document.body.style.backgroundColor = 'blue';
}

function stopAndGo() {
	(game.active) ? clearInterval(pongInterval) : pongInterval = setInterval(pong,game.speed);
	game.active = !game.active;
}

function refresh() {
	ball.line = [];
	ball.serve();
	game.p1Score.innerHTML = 0;
	game.p2Score.innerHTML = 0;
	game.bounce.innerHTML = 0;
	game.bounces = 0;
}

game.canvas.onclick = function() {
	if (ball.trackline) ball.line = [];
	ball.trackline = !ball.trackline;
}