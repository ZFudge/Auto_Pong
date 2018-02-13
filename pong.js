document.addEventListener("keydown",pushedKey);

const pong = {
	active: true,
	ms: 50,
	canvas: document.getElementById('pong-canvas'),
	bounce: document.getElementById('bounce'),
	bounces: 0,
	p2Score: document.getElementById('p2'),
	p1Score: document.getElementById('p1'),
	playerSpeed: 5,
	playerWidth: 12,
	playerHeight: 50,
	pauseUnpause() {
		(this.active) ? clearInterval(pongInterval) : pongInterval = setInterval(mainFunction,this.ms);
		this.active = !this.active;
	},
	linedraw() {	// draws the path the ball will follow
		for(let prop in ball.line) {
			pong.context.fillStyle = '#0F0';
			pong.context.fillRect(ball.line[prop].xdot,ball.line[prop].ydot, 1, 1);
			/*   * /pong.context.beginPath();
		    pong.context.arc(ball.line[prop].xdot, ball.line[prop].xdot, 1, 0, 2 * Math.PI);
		    pong.context.fill();// */
		}
	},
	drawCharacters() {
		pong.context.clearRect(0,0,pong.canvas.width,pong.canvas.height);
		//pong.context.fillStyle = '#0F0'; //pong.context.fillRect(ball.x+4,ball.y+4,2,2);
		pong.context.fillStyle = 'white';
		playerTwo.draw();
		player.draw();
		ball.draw();
	}
}
pong.context = pong.canvas.getContext('2d');
pong.playerOnePos = 20;
pong.playerTwoPos = pong.canvas.width - 20 - pong.playerWidth;

function mainFunction() {
	if (ball.trackline) pong.linedraw();
	player.checkBall();
	player.checkSide();
	player.adjust();
	playerTwo.checkBall();
	playerTwo.checkSide();
	playerTwo.adjust();
	ball.adjust();
	if (ball.x + ball.size/2 > pong.canvas.width * 0.88) ball.collisionCheck(playerTwo);
	if (ball.x + ball.size/2 < pong.canvas.width * 0.12) ball.collisionCheck(player);
	ball.checkScore();
	pong.drawCharacters();
}
 
const diff = document.getElementById('diff');

const ball = {
	x: pong.canvas.width/2-5,
	y: pong.canvas.height/2-5,
	vertical: 0,
	horizontal: 0,
	size: 10,
	line: [],
	trackline: false,	// determines if the ball's path will be stored in the ball.line array
	serve: function() {
		ball.vertical = 1 + Math.random()
		ball.horizontal = 1 + Math.random()

		if (Math.random() < 0.5) ball.vertical *= -1;
		if (Math.random() < 0.5) ball.horizontal *= -1;

		ball.x = pong.canvas.width/2 - ball.size/2;
		ball.y = pong.canvas.height/2 - ball.size/2;

		player.yInt = false;
		playerTwo.yInt = false;
	},
	// bounces the ball if it hits a well, then applies horizontal and vertical speeds to the ball
	adjust: function() {
		if (ball.y < 0) {
			ball.vertical *= -1;
			ball.y *= -1;
		} else if (ball.y + ball.size > pong.canvas.height) {
			ball.vertical *= -1;
			ball.y = pong.canvas.height-ball.size-(ball.y-(pong.canvas.height - ball.size));
		}
		ball.x += ball.horizontal;
		ball.y += ball.vertical;
	},
	collisionCheck: function(object) {
		console.log(object);
		if (ball.y + ball.size/2 >= object.y && 
			ball.y + ball.size/2 <= object.y + object.height && 
			((ball.x >= object.x && ball.x <= object.x + object.width) || (ball.x + ball.size >= object.x && ball.x + ball.size <= object.x + object.width) )
			) {
			console.log('OH YEAH', ball.x);
			ball.horizontal *= -1;
			// ball.x = ball.x - (( (ball.x + ball.size) - player.x) * 2);
			(ball.x < pong.canvas.width/2) ? ball.x += (Math.abs(20 + pong.playerWidth - ball.x)) : ball.x -= Math.abs((pong.canvas.width-20-pong.playerWidth) - (ball.x + ball.size));
			console.log('OH NO?', ball.x);
			let ballRange = (ball.y + ball.size/2 - player.y - 20) / 10;
			if (Math.abs(ball.vertical < 15)) {
				ball.vertical += ballRange;
			}
			ball.vertical.toFixed(4);

			player.yInt = false;

			pong.bounces++;
			pong.bounce.innerHTML = pong.bounces;
		} else if ((ball.y >= playerTwo.y && ball.y + ball.size <= playerTwo.y + playerTwo.height && ball.x >= playerTwo.x && ball.x <= playerTwo.x + playerTwo.width) ||
			(ball.y + ball.size >= playerTwo.y && ball.y + ball.size <= playerTwo.y + playerTwo.height && ball.x >= playerTwo.x && ball.x <= playerTwo.x + playerTwo.width)) {
			console.log('collided', ball.x);

			ball.horizontal *= -1;
			ball.x = ball.x + ((playerTwo.x + playerTwo.height - ball.x) * 2);
			let ballRange = (ball.y + ball.size/2 - playerTwo.y - 20) / 10;
			ball.vertical += ballRange;
			ball.vertical.toFixed(4);
		}
	},
	// checks if ball has scored on a player
	checkScore: function() {
		if (ball.x <= 0 || ball.x + ball.size >= pong.canvas.width) {
			(ball.x <= 0) ? pong.p1Score.innerHTML++ : pong.p2Score.innerHTML++;
			console.log('served', ball.x);
			ball.serve();
			//document.body.style.backgroundColor = 'blue'; clearInterval(pongInterval);
		}
	},
	draw() {
		pong.context.fillRect(this.x,this.y,this.size,this.size);
	}
}

class Player {
	constructor(x) {
		this.x = x;
		this.y = pong.canvas.height/2 - pong.playerHeight/2;
		this.width = pong.playerWidth;
		this.height = pong.playerHeight;
		this.vertical = 0;
		this.yInt = false; // stores the location of the y-axis where the ball will be when intersecting with the player's y axis 
		this.side = null; // this.side stores the random side the player intends to bounce the ball with, true for left, false for right

		this.checkSide = function() {	// checks for contact with top and bottom walls
			if (this.y + this.height >= pong.canvas.height && this.vertical > 0 || this.y <= 0 && this.vertical < 0) this.vertical = 0;
		}
		// checks player's yInt location in comparison to which side it intends to bounce the ball with and adjusts player accordingly
		this.checkBall = function() {
			if (this.yInt < 0 || this.yInt > pong.canvas.height || !this.yInt && (ball.horizontal > 0 && ball.y < this.y || ball.horizontal < 0 && ball.y > this.y) ) {
				this.setDestination();
			} else {
				if (this.side) { // left
					if (this.y + ball.size/1.5 > this.yInt && typeof this.yInt == 'number') {
						this.vertical = -pong.playerSpeed;
					} else if (this.y + ball.size*1.5 < this.yInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) {
						this.vertical = pong.playerSpeed;
					} else {
						this.vertical = 0;
					}
				} else { // right
					if (this.y + this.height - ball.size/1.5 < this.yInt) {
						this.vertical = pong.playerSpeed;
					} else if (this.y + this.height - ball.size*1.5 > this.yInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) {
						this.vertical = -pong.playerSpeed;
					} else {
						this.vertical = 0;
					}
				}
				/* keeps ball centered
				(this.x + 22.5 < this.yInt) ? this.horizontal = pong.playerSpeed : (this.x + 17.5 > this.yInt && (ball.vertical > 0 && ball.y < this.y || ball.vertical < 0 && ball.y > this.y)) ? this.horizontal = -pong.playerSpeed : this.horizontal = 0;
				*/
			}
		}
		this.draw = function() {
			pong.context.fillRect(this.x,this.y,this.width,this.height);
		};
		this.adjust = function() {
			this.y += this.vertical;
		}
		// uses the distance from the ball as well as the horizontal and vertical speeds of the ball
		// to calculate where the ball will intersect with the player
		this.setDestination = function() {
			let d = pong.canvas.height;
			let v = ball.vertical; 
			let h = Math.abs(ball.horizontal);
			let horizontalRange = Math.abs(ball.x - this.x);
			horizontalRange -= ball.size/2;

			//randomly determines which side the player will hit the ball with
			this.side = Math.random() > 0.5;

			let y = ball.y;
			let x = Math.round(horizontalRange/h);
			let dot;
			
			if (ball.trackline) {
				ball.line = [];
				dot = ball.x + ball.size/2; // used to plot the path the ball will follow. 
			}

			for (let i = 0; i < h; i++) {
				if (ball.trackline) {   
					dot += ball.horizontal;
					ball.line.push(
						{
							ydot: parseFloat(y + ball.size/2).toFixed(0),
							xdot: dot
						});
				}

				y += v;
				if (y + ball.size > d || y < 0) { // bounces line off walls
					v *= -1;
					(y < 0) ? y *= -1 : y = d - ball.size - (y - (d - ball.size) ); // bounce
				}
			}
			this.yInt = Math.round(y + ball.size/2);
		}
	}
}

const playerTwo = new Player(pong.playerTwoPos);
playerTwo.name = 'player-two';
const player = new Player(pong.playerOnePos);
player.name = 'player-one';

ball.serve();
let pongInterval = setInterval(mainFunction,pong.ms);

function pushedKey(btn) {
	if (btn.keyCode === 82) refresh();
	if (btn.keyCode === 76) ball.trackline = !ball.trackline;
	if (btn.keyCode === 32) pong.pauseUnpause();
	/* // player arrow keys input
	if (btn.keyCode === 37) player.horizontal = -1;
	if (btn.keyCode === 38 || btn.keyCode === 40) player.horizontal = 0;
	if (btn.keyCode === 39) player.horizontal = 1;
	*/
}

function refresh() {
	ball.line = [];
	ball.serve();
	pong.p1Score.innerHTML = 0;
	pong.p2Score.innerHTML = 0;
	pong.bounce.innerHTML = 0;
	pong.bounces = 0;
}

pong.canvas.onclick = function() {
	if (ball.trackline) ball.line = [];
	ball.trackline = !ball.trackline;
}
