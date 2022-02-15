function Vector(x, y) {
  this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

var actorChars = {
	"@": Player,
	"o": Coin,
	"=": Lava, "|": Lava, "v": Lava 
};

function Level(plan) {
	this.width = plan[0].length;
	this.height = plan.length;
	this.grid = [];
	this.actors = [];
	this.gravity = 30;

	for(var y = 0; y < this.height; y++) {
		var line = plan[y], gridLine = [];
		for(var x = 0; x < this.width; x++) {
			var ch = line[x], fieldType = null;
			var Actor = actorChars[ch];
			if(Actor)
				this.actors.push(new Actor(new Vector(x, y), ch));
			else if(ch == "x")
				fieldType = "wall";
			else if(ch == "!")
				fieldType = "lava";
			gridLine.push(fieldType);
		}
		this.grid.push(gridLine);
	}

	this.player = this.actors.filter(function(actor) {
		return actor.type == "player";
	})[0];
	this.status = this.finishDelay = null;
}
Level.prototype.isFinished = function() {
	return this.status != null && this.finishDelay < 0;
};
Level.prototype.obstacleAt = function(pos, size) {
	var xStart = Math.floor(pos.x);
	var xEnd = Math.ceil(pos.x + size.x);
	var yStart = Math.floor(pos.y);
	var yEnd = Math.ceil(pos.y + size.y);

	if(xStart < 0 || xEnd > this.width || yStart < 0)
		return "wall";
	if(yEnd > this.height)
		return "lava";
	for(var y = yStart; y < yEnd; y++) {
		for(var x = xStart; x < xEnd; x++) {
			var fieldType = this.grid[y][x];
			if(fieldType) return fieldType;
		}
	}

};
Level.prototype.actorAt = function(actor) {
	for(var i = 0; i < this.actors.length; i++) {
		var other = this.actors[i];
		if(other != actor &&
		   actor.pos.x + actor.size.x > other.pos.x &&
		   actor.pos.y + actor.size.y > other.pos.y &&
		   actor.pos.x < other.pos.x + other.size.x &&
		   actor.pos.y < other.pos.y + other.size.y)
			return other;
	}
};
Level.prototype.animate = function(step, maxStep, keys) {
	if(this.status != null)
		this.finishDelay -= step;

	while(step > 0) {
		var thisStep = Math.min(step, maxStep);
		this.actors.forEach(function(actor) {
			actor.act(thisStep, this, keys);
		}, this);
		step -= thisStep;
	}
};
Level.prototype.playerTouched = function(type, actor) {
	if(type == "lava" && this.status == null) {
		this.status = "lost";
		this.finishDelay = 1;
	} 
	else if(type == "coin") {
		this.actors = this.actors.filter(function(other) {
			return other != actor;
		});
		if(!this.actors.some(function(actor) {
			return actor.type == "coin";
		})) {
			this.status = "won";
			this.finishDelay = 1;
		}
	}
};

function Player(pos) {
	this.pos = pos.plus(new Vector(0, -0.5));
	this.size = new Vector(0.8, 1.5);
	this.speed = new Vector(0, 0);
	this.xSpeed = 7;
	this.ySpeed = 17;
}
Player.prototype.moveX = function(step, level, keys) {
	this.speed.x = 0;
	if(keys.left) this.speed.x -= this.xSpeed;
	if(keys.right) this.speed.x += this.xSpeed;

	var motion = new Vector(this.speed.x * step, 0);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if(obstacle)
		level.playerTouched(obstacle);
	else
		this.pos = newPos;
};
Player.prototype.moveY = function(step, level, keys) {
	this.speed.y += step * level.gravity;
	var motion = new Vector(0, this.speed.y * step);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if(obstacle) {
		level.playerTouched(obstacle);
		if(keys.up && this.speed.y > 0)
			this.speed.y = -this.ySpeed;
		else
			this.speed.y = 0;
	} 
	else {
		this.pos = newPos;
	}

};
Player.prototype.act = function(step, level, keys) {
	this.moveX(step, level, keys);
	this.moveY(step, level, keys);

	var otherActor = level.actorAt(this);
	if(otherActor)
		level.playerTouched(otherActor.type, otherActor);

	// Losing animation
	if(level.status == "lost") {
		this.pos.y += step;
		this.size.y -= step;
	}
};
Player.prototype.type = "player";

function Lava(pos, ch) {
	this.pos = pos;
	this.size = new Vector(1, 1);
	if(ch == "=") {
		this.speed = new Vector(2, 0);
	} 
	else if(ch == "|") {
		this.speed = new Vector(0, 2);
	} 
	else if(ch == "v") {
		this.speed = new Vector(0, 3);
		this.repeatPos = pos;
	}
}
Lava.prototype.act = function(step, level) {
	var newPos = this.pos.plus(this.speed.times(step));
	if(!level.obstacleAt(newPos, this.size))
		this.pos = newPos;
	else if(this.repeatPos)
		this.pos = this.repeatPos;
	else
		this.speed = this.speed.times(-1);
};
Lava.prototype.type = "lava"

function Coin(pos) {
	this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
	this.size = new Vector(0.6, 0.6);
	this.wobble = Math.random() * Math.PI * 2;
	this.wobbleSpeed = 8;
	this.wobbleDist = 0.07;
}
Coin.prototype.act = function(step) {
	this.wobble += step * this.wobbleSpeed;
	var wobblePos = Math.sin(this.wobble) * this.wobbleDist;
	this.pos = this.basePos.plus(new Vector(0, wobblePos));
};
Coin.prototype.type = "coin";