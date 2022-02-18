// Helper Functions
// -----------------------------------------
function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
};

var arrowCodes = {37: "left", 38: "up", 39: "right"};
function trackKeys(codes) {
	var pressed = Object.create(null);
	function handler(event) {
		if(codes.hasOwnProperty(event.keyCode)) {
			var down = event.type == "keydown";
			pressed[codes[event.keyCode]] = down;
			event.preventDefault();
		}
	}
	addEventListener("keydown", handler);
	addEventListener("keyup", handler);
	return pressed;
}

function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

// Animation interface
// -----------------------------------------
function runAnimation(frameFunc) {
	var lastTime = null;
	function frame(time) {
		var stop = false;
		if(lastTime != null) {
			var timeStep = Math.min(time - lastTime, 100) / 1000;
			stop = frameFunc(timeStep) === false;
		}
		lastTime = time;
		if(!stop)
			requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);
function runLevel(level, Display, andThen) {
	var display = new Display(document.body, level);
	runAnimation(function(step) {
		level.animate(step, 0.05, arrows);
		display.drawFrame(step);
		if(level.isFinished()) {
			display.clear();
			if(andThen)
				andThen(level.status);
			return false;
		}
	});
}

function runGame(plans, Display) {
	function startLevel(n) {
		runLevel(new Level(plans[n]), Display, function(status) {
			if(status == "lost")
				startLevel(n);
			else if(n < plans.length - 1)
				startLevel(n + 1);
			else
				console.log("You win!");
		});
	}
	startLevel(0);
}

// DOM Display
// -----------------------------------------
function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;
  this.scale = 30;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}
DOMDisplay.prototype.drawBackground = function() {
	var table = elt("table", "background");
	table.style.width = this.level.width * this.scale + "px";
	this.level.grid.forEach(function(row) {
		var rowElt = table.appendChild(elt("tr"));
		rowElt.style.height = this.scale + "px";
		row.forEach(function(type) {
			rowElt.appendChild(elt("td", type));
		});
	}, this);
	return table;
};
DOMDisplay.prototype.drawActors = function() {
	var wrap = elt("div");
	this.level.actors.forEach(function(actor) {
		var rect = wrap.appendChild(elt("div", "actor " + actor.type));
		rect.style.width = actor.size.x * this.scale + "px";
		rect.style.height = actor.size.y * this.scale + "px";
		rect.style.left = actor.pos.x * this.scale + "px"
		rect.style.top = actor.pos.y * this.scale + "px";
	}, this);
	return wrap;
};
DOMDisplay.prototype.drawFrame = function() {
	if(this.actorLayer)
		this.wrap.removeChild(this.actorLayer);
	this.actorLayer = this.wrap.appendChild(this.drawActors());
	this.wrap.className = "game " + (this.level.status || "");
	this.scrollPlayerIntoView();
};
DOMDisplay.prototype.scrollPlayerIntoView = function() {
	var width = this.wrap.clientWidth;
	var height = this.wrap.clientHeight;
	var margin = width / 3;

	// The viewport
	var left = this.wrap.scrollLeft,
		right = left + width,
		top = this.wrap.scrollTop,
		bottom = top + height;

	var player = this.level.player;
	var center = player.pos.plus(player.size.times(0.5)).times(this.scale);

	// Horizontal scroll
	if(center.x < left + margin)
		this.wrap.scrollLeft = center.x - margin;
	else if(center.x > right - margin)
		this.wrap.scrollLeft = center.x + margin - width;

	// Vertical scroll
	if(center.y < top + margin)
		this.wrap.scrollTop = center.y - margin;
	else if(center.y > bottom - margin)
		this.wrap.scrollTop = center.y + margin - height;

};
DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};


// Canvas Display
// -----------------------------------------
function CanvasDisplay(parent, level) {
	// This needs to be the same size as the tile size
	this.scale = 20;

	this.canvas = document.createElement("canvas");
	this.canvas.width = Math.min(600, level.width * this.scale);
	this.canvas.height = Math.min(450, level.height * this.scale);
	parent.appendChild(this.canvas);
	this.cx = this.canvas.getContext("2d");

	this.level = level;
	this.animationTime = 0;
	this.flipPlayer = false;
	this.sprites = document.createElement("img");
	this.sprites.src = "img/bg_sprites.png";
	this.sprites = document.createElement("img");
	this.sprites.src = "img/bg_sprites.png";
	this.playerSprite = document.createElement("img");
	this.playerSprite.src = "img/avatar-sprite.png"; //<---
	this.playerXOverlap = 4;

	this.viewport = {
		left: 0,
		top: 0,
		width: this.canvas.width / this.scale,
		height: this.canvas.height / this.scale
	};

	this.drawFrame(0);
}
CanvasDisplay.prototype.clear = function() {
	this.canvas.parentNode.removeChild(this.canvas);
};
CanvasDisplay.prototype.drawFrame = function(step) {
	this.animationTime += step;

	this.updateViewport();
	this.clearDisplay();
	this.drawBackground();
	this.drawActors();
};
CanvasDisplay.prototype.updateViewport = function() {
	var view = this.viewport, margin = view.width / 3
	var player = this.level.player;
	var center = player.pos.plus(player.size.times(0.5));

	if(center.x < view.left + margin)
		view.left = Math.max(center.x - margin, 0);
	else if(center.x > view.left + view.width - margin)
		view.left = Math.min(center.x + margin - view.width, this.level.width - view.width);

	if(center.y < view.top + margin)
		view.top = Math.max(center.y - margin, 0);
	else if(center.y > view.top + view.height - margin)
		view.top = Math.min(center.y + margin - view.height, this.level.height - view.height);
};
CanvasDisplay.prototype.clearDisplay = function() {
	if(this.level.status == "won")
		this.cx.fillStyle = "rgb(68, 191, 255)";
	else if(this.level.status == "lost")
		this.cx.fillStyle = "rgb(44, 136, 214)";
	else
		this.cx.fillStyle = "rgb(52, 166, 251)";
	this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};
CanvasDisplay.prototype.drawBackground = function() {
	var view = this.viewport;
	var xStart = Math.floor(view.left);
	var xEnd = Math.ceil(view.left + view.width);
	var yStart = Math.floor(view.top);
	var yEnd = Math.ceil(view.top + view.height);

	for(var y = yStart; y < yEnd; y++) {
		for(var x = xStart; x < xEnd; x++) {
			var tile = this.level.grid[y][x];
			if(tile == null) continue;
			var screenX = (x - view.left) * this.scale;
			var screenY = (y - view.top) * this.scale;
			var tileX = tile == "lava" ? this.scale : 0;
			this.cx.drawImage(this.sprites, tileX, 0, this.scale, this.scale, screenX, screenY, this.scale, this.scale)
		}
	}
};
CanvasDisplay.prototype.drawPlayer = function(x, y, width, height) {
	var sprite = 8, player = this.level.player;
	width += this.playerXOverlap * 2;
	x -= this.playerXOverlap;

	if(player.speed.x != 0)
		this.flipPlayer = player.speed.x < 0;

	if(player.speed.y != 0)
		sprite = 9;
	else if(player.speed.x != 0)
		sprite = Math.floor(this.animationTime * 12) % 8;

	this.cx.save();

	if(this.flipPlayer)
		flipHorizontally(this.cx, x + width / 2);

	this.cx.drawImage(this.playerSprite, sprite * width, 0, width, height, x, y, width, height);

	this.cx.restore();
};
CanvasDisplay.prototype.drawActors = function() {
	this.level.actors.forEach(function(actor) {
		var width = actor.size.x * this.scale;
		var height = actor.size.y * this.scale;
		var x = (actor.pos.x - this.viewport.left) * this.scale;
		var y = (actor.pos.y - this.viewport.top) * this.scale;

		if(actor.type == "player")
			this.drawPlayer(x, y, width, height);
		else {
			var tileX = (actor.type == "coin" ? 2 : 1) * this.scale;
			this.cx.drawImage(this.sprites, tileX, 0, width, height, x, y, width, height);
		}
	}, this);
};