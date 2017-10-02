document.addEventListener("keydown",pushedKey);

var canvas = document.getElementById('canv');
var context = canvas.getContext('2d');
var speed = 10;
var playerSpeed = 2;
var bounces = 0;
var score = document.getElementById('score');

game = {
	playerWidth: 40,
	playerHeight: 10,
	playerTwoPos: 20,
	playerOnePos: canvas.height-30,
	active: true
}

//var diff = document.getElementById('diff');

ping = {
	x: canvas.width/2-5,
	y: canvas.height/2-5,
	vertical: 0,
	horizontal: 0,
	size: 10,
	line: [],
	lineage: false,
	serve: function() {
		var rand1 = Math.random();
		var rand2 = Math.random();
		ping.vertical = playerSpeed * 1.5;
		ping.horizontal = playerSpeed * 1.5;

		if (rand1 < 0.5) {
			ping.vertical += -ping.vertical*2;
		}
		if (rand2 < 0.5) {
			ping.horizontal += -ping.horizontal*2;
		}

		ping.x = canvas.width/2-5;
		ping.y = canvas.height/2-5;

		player.spot = false;
		playerTwo.spot = false;
	},
	adjust: function() {
		if (ping.x < 0) {
			//console.log('bounce','ping.x: ' + ping.x);
			ping.horizontal += (ping.horizontal*-2);
			ping.x = Math.abs(ping.x);
			//console.log('ping.x: ' + ping.x);
		} else if (ping.x + ping.size > canvas.width) {
			ping.horizontal -= (ping.horizontal*2);
			ping.x = canvas.width-ping.size-(ping.x-(canvas.width-ping.size));
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

			var pingRange = (ping.x + ping.size/2 - player.x - 20) / 10;
			if (Math.abs(ping.horizontal < 15)) {
				ping.horizontal += pingRange;
			}
			ping.horizontal.toFixed(4);

			//diff.innerHTML = Math.abs((ping.x + ping.size/2) - player.spot);
			//console.log('uh');
			//console.log(ping.x + ping.size/2);
			//console.log(player.spot);
			player.spot = false;
			bounces++;
			score.innerHTML = bounces;
		} else if ((ping.x >= playerTwo.x && ping.x <= playerTwo.x + playerTwo.width && ping.y >= playerTwo.y && ping.y <= playerTwo.y + playerTwo.height) ||
			(ping.x + ping.size >= playerTwo.x && ping.x + ping.size <= playerTwo.x + playerTwo.width && ping.y >= playerTwo.y && ping.y <= playerTwo.y + playerTwo.height)) {
			ping.vertical += (ping.vertical*-2);

			ping.y = ping.y + ((playerTwo.y + playerTwo.height - ping.y) * 2);

			var pingRange = (ping.x + ping.size/2 - playerTwo.x - 20) / 10;
			ping.horizontal += pingRange;
			ping.horizontal.toFixed(4);

			var dif = Math.abs((ping.x + ping.size/2) - playerTwo.spot)
			//diff.innerHTML = dif.toFixed(4);
			//console.log('oh');
			//console.log(ping.x + ping.size/2);
			//console.log(playerTwo.spot);
			playerTwo.spot = false;
			bounces++;
			score.innerHTML = bounces;
		}

		// ping.vertical += -ping.vertical * 2;
	},
	checkScore: function() {
		if (ping.y <= 0) {
			ping.serve();
			document.body.style.backgroundColor = 'blue';
			//game.active = !game.active;
			clearInterval(pongInterval)
		} else if (ping.y + ping.size >= canvas.height) {
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
		this.x = canvas.width/2 - game.playerWidth/2;
		this.width = game.playerWidth;
		this.height = game.playerHeight;
		this.horizontal = 0;
		this.spot = false;
		this.side = null;
		this.checkSide = function() {
			if (this.x + this.width >= canvas.width && this.horizontal > 0 || this.x <= 0 && this.horizontal < 0) {
				this.horizontal = 0;
			}
		}
		this.checkPings = function() {
			if (ping.x < this.x && (ping.vertical < 0 && this.y < canvas.height/2 || ping.vertical > 0 && this.y > canvas.height/2) ) {
				this.horizontal = -playerSpeed;
			} else if (ping.x > this.x + this.width && (ping.vertical < 0 && this.y < canvas.height/2 || ping.vertical > 0 && this.y > canvas.height/2) ) {
				this.horizontal = playerSpeed;
			} else if (ping.x > this.x + this.width/4 && ping.x < this.x + this.width * 0.75) {
				this.horizontal = 0;
			}
		}
		this.checkPing = function() {
			if (this.spot < 0 || this.spot > canvas.width || !this.spot && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y) ) {
				//console.log('spot is false');
				this.dest();
			} else { //
				if (this.side) { // left
					if (this.x + ping.size/1.5 > this.spot) {
						this.horizontal = -playerSpeed;
					} else if (this.x + ping.size*1.5 < this.spot && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y)) {
						this.horizontal = playerSpeed;
					} else {
						this.horizontal = 0;
					}
				} else {
					if (this.x + this.width - ping.size/1.5 < this.spot) {
						this.horizontal = playerSpeed;
					} else if (this.x + this.width - ping.size*1.5 > this.spot && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y)) {
						this.horizontal = -playerSpeed;
					} else {
						this.horizontal = 0;
					}
				}
				/*
				if (this.x + 22.5 < this.spot) {
					this.horizontal = playerSpeed;
				} else if (this.x + 17.5 > this.spot && (ping.vertical > 0 && ping.y < this.y || ping.vertical < 0 && ping.y > this.y)) {
					this.horizontal = -playerSpeed;
				} else {
					this.horizontal = 0;
				}
				*/
			}
		}
		this.dest = function() {
			//console.log('setting destination')
			var w = canvas.width;
			var h = ping.horizontal; 
			var v = Math.abs(ping.vertical);
			var yD = Math.abs(ping.y - this.y);
			yD -= ping.size/2;
			this.side = Math.random() > 0.5;
			/*
			if (ping.x > canvas.height/2) {
				yD -= canvas.size/2;
			} else {
				yD -= canvas.size/2;

			} */
			var y = Math.round(yD/v);
			var x = ping.x;
			
			if (ping.lineage) {
				ping.line = [];
				var a = 0;
				var b = ping.y < canvas.height/2; // upper side

				if (b) {
					a = playerTwo.y + playerTwo.height;
				} else {
					a = player.y;
				}
			}

			for(var i=0;i<y;i++) {
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
			this.spot = Math.round(x + ping.size/2);
		}

	}
}

function linedraw() {
	for(var prop in ping.line) {
		context.fillStyle = '#0FF';
		context.fillRect(ping.line[prop].xa,ping.line[prop].ya,1,1);
	}
}

var playerTwo = new Player(game.playerTwoPos);
var player = new Player(game.playerOnePos);

ping.serve();
pongInterval = setInterval(pong,speed);

function pong() {
	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width,canvas.height);

	context.fillStyle = 'white';
	context.fillRect(playerTwo.x,playerTwo.y,playerTwo.width,playerTwo.height);
	context.fillRect(player.x,player.y,player.width,player.height);

	context.fillRect(ping.x,ping.y,ping.size,ping.size);

	if (ping.lineage) {
		linedraw();
	}
	context.fillStyle = '#0F0';
	context.fillRect(ping.x+4,ping.y+4,2,2);


	//player.checkPings();
	player.checkPing();
	player.checkSide();

	player.x += player.horizontal;

	//playerTwo.checkPing();
	playerTwo.checkPing();
	playerTwo.checkSide();

	playerTwo.x += playerTwo.horizontal;

	ping.adjust();
	ping.collisionCheck();
	ping.checkScore();


	console.log('pong')

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
		pongInterval = setInterval(pong,speed);
	}
	game.active = !game.active;
}

function refresh() {
	ping.serve();
	document.body.style.backgroundColor = 'white';
}


canvas.onclick = function() {
	ping.lineage = !ping.lineage;
}
