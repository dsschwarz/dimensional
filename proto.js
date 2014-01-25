// TODO: Split this up once a module system is chosen. Maybe use require.js

// 'Class' definitions
// spec is the options hash passed to each 'constructor'

var TILE_SIZE = 20;
/**
 * @class map
 * Creates a map holding tiles and objects.
 * @param  {Object} spec = {size: {rows: <int>, cols: <int>}}
 * 						size => size of tile array
 */
function map(spec) {
	var that = {
			rows: spec.size.rows || 1,
			cols: spec.size.cols || 1,
			tiles: [],
			objects: []
		}

	// Create tile array
	if (spec.size) {
		for (var i = 0; i < that.rows; i++) {
			for (var j = 0; j < that.cols; j++) {
				that.tiles.push(tile( {pos: [i, j]} ))
			};
		};
	}

	/**
	 * draws tiles, then objects to canvas
	 * @param  {Context} ctx
	 */
	that.draw = function (ctx) {
		for (var i = 0; i < that.tiles.length; i++) {
			that.tiles[i].draw(ctx)
		};
		for (var i = 0; i < that.objects.length; i++) {
			that.objects[i].draw(ctx)
		};
	}

	/**
	 * update all objects
	 * @param  {int} ms Time elapsed in ms since last call
	 */
	that.update = function (ms) {
		for (var i = 0; i < that.objects.length; i++) {
			that.objects[i].update(ms)
		};
	}

	/**
	 * Gets an object by id. Returns null if not found
	 * @param  {int/String} id
	 */
	that.getObjById = function (id) {
		for (var i = 0; i < that.objects.length; i++) {
			if (that.objects[i].id === id) {
				return that.objects[i]
			}
		};
		return null;
	}

	that.addObj = function (object) {
		that.objects.push(object);
	}

	that.delObj = function (id) {
		if (!id) {
			console.log("No id given to delObj")
			return;
		}
		var index = -1;
		for (var i = 0; i < that.objects.length; i++) {
			if (that.objects[i].id === id) {
				index = i;
				break;
			}
		};
		if (index >= 0) {
			that.objects.splice(index, 1);
		}
	}
	return that;
}

/**
 * Creates a single tile
 * @param  {Object} spec = {pos: [row, col]} row and col should be type <int>
 */
function tile(spec) {
	var that = {
		pos: spec.pos || [0,0] // Format [row, col]
	}
	that.draw = function (ctx) {
		var x = that.pos[1] * TILE_SIZE,
			y = that.pos[0] * TILE_SIZE;
		ctx.fillStyle = "#ddd";
		ctx.fillRect (x, y, TILE_SIZE, TILE_SIZE);
	}
	return that;
}

/**
 * Create an object that can move.
 * @param  {Object} spec = {id: <int/String>, map: <map>, moving: <bool>, direction: <string>, moveDelay: <int>}
 * id and map required. moveDelay is time in ms before can move again
 * 
 */
function object(spec) {
	var row = spec.pos[0] || 0,
		col = spec.pos[1] || 0;
	var that = {
		moving: spec.moving || false,
		direction: spec.direction || "down",
		pos: [row, col],
		map: spec.map,
		id: objectId++
	}
	var moveTimer = 0; // Can only move when timer hits 0

	that.update = function (ms) {
		if (that.moving) {
			if (moveTimer < 0) {
				console.log("moving");
				var dir = that.direction;
				if (dir === "up") {
					if (that.pos[0] > 0)
						that.pos[0] -= 1;
				} else if (dir === "right") {
					if (that.pos[1] < that.map.cols - 1)
						that.pos[1] += 1;
				} else if (dir === "down") {
					if (that.pos[0] < that.map.rows - 1)
						that.pos[0] += 1;
				} else if (dir === "left") {
					if (that.pos[1] > 0)
						that.pos[1] -= 1;
				} else {
					console.log("Unknown direction - " + that.direction)
				}
				moveTimer = spec.moveDelay || 200;
			} else {
				moveTimer -= ms;
			}
		}
	}

	that.draw = function (ctx) {
		var x = that.pos[1] * TILE_SIZE,
			y = that.pos[0] * TILE_SIZE;
		ctx.fillStyle = "#141";
		ctx.fillRect (x, y, TILE_SIZE, TILE_SIZE);
	}
	return that;
}
var objectId = 0;
function laser(spec) {
	var MAX_TIMER = 300;
	var timer = MAX_TIMER,
		row = spec.pos[0] || 0,
		col = spec.pos[1] || 0,
		map = spec.map,
		dir = spec.direction;
	var that = {
		id: objectId++
	};
	console.log(dir)
	that.update = function(ms) {
		console.log(dir, row, col)
		timer -= ms;
		if (timer <= 0) {
			map.delObj(that.id)
		}
	};
	that.draw = function(ctx) {
		console.log(dir)
		var x, y, width, height;
		if (dir === "left") {
			x = 0;
			y = row * TILE_SIZE + 1;
			width = col * TILE_SIZE;
			height = TILE_SIZE - 2;
		} else if (dir === "right") {
			x = (col + 1) * TILE_SIZE;
			y = row * TILE_SIZE + 1;
			width = (map.cols - 1 - col) * TILE_SIZE;
			height = TILE_SIZE - 2;
		} else if (dir === "up") {
			x = col * TILE_SIZE + 1;
			y = 0;
			width = TILE_SIZE - 2;
			height = row * TILE_SIZE;
		} else if (dir === "down") {
			x = col * TILE_SIZE + 1;
			y = (row + 1) * TILE_SIZE;
			width = TILE_SIZE - 2;
			height = (map.cols - 1 - row) * TILE_SIZE;
			
		}
		ctx.fillStyle = 'rgba(200, 0, 0, ' + timer/MAX_TIMER + ')';
		ctx.fillRect (x, y, width, height);
	}
	return that;
}
function player(spec) {
	var that = object(spec);
	var fireDelay = 500,
		fireDir = null,
		fuel = 0;
	that.fire = function (dir) {
		fireDir = dir;
	}
	var superUpdate = that.update;
	that.update = function (ms) {
		superUpdate(ms);
		if (fireDir) {
			if (fireDelay <= 0) {
				that.map.addObj(laser({direction: fireDir, pos: that.pos, map: that.map}));
				// Space out shots by 1 sec (500 ms delay, 500 ms to charge)
				fireDelay = 1000;
				fireDir = null;
			} else {
			fireDelay -= ms;
			}

		// If not fired recently, laser should go immediately into charge state
		} else if (fireDelay > 500) {
			fireDelay -= ms;
		}
	}
	return that;
}


/** Create a game loop.
 * Pass it a function to call repeatedly. Calls function with one argument - milliseconds elapsed since last call
 * Returns an interval, which can be cleared with clearInterval()
 */
function tick (callback) {
	var TIMER_LASTCALL = Date.now();
	return setInterval(function() {
		var msDuration = (Date.now() - TIMER_LASTCALL);
		TIMER_LASTCALL = Date.now();
		callback(msDuration);
	})
}

// Object containing all the key mappings
var keyBindings = {
	65: "moveLeft",
	68: "moveRight",
	83: "moveDown",
	87: "moveUp",
	37: "fireLeft",
	39: "fireRight",
	40: "fireDown",
	38: "fireUp",
	32: "stop"
};

function main() {

	// Stub
	function sendEvent (event) {
		console.log("Sending: ", event)
		receiveEvent(event)
	}

	// Stub
	function receiveEvent (event) {
		try {
			if (event.type === "move") {
				var obj = myMap.getObjById(event.id);
				if (obj.id !== 0) {
					console.log("Not p1", obj)
					console.log("Event received - ", event)
				}
				obj.moving = true;
				obj.direction = event.direction;
			} else if(event.type === "stop") {
				myMap.getObjById(event.id).moving = false;
			} else if (event.type === "fire") {
				myMap.getObjById(event.id).fire(event.direction)
			}
		} catch(err) {
			console.log("receiveEvent error - ", err)
		}
	}
	// Initialize the game
	var canvas = document.getElementById("game-canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 620;
	canvas.height = 620;
	var myMap = map( {size: {rows: 30, cols: 30}} );
	var p1 = player({
		map: myMap, 
		pos: [1, 2], 
		moving: false
	})
	console.log(p1)
	myMap.objects.push(p1);
	myMap.draw(ctx);

	// Start the game loop
	tick(function (ms) {
		myMap.update(ms);
		myMap.draw(ctx);
	})

	document.addEventListener('mousedown', function(event) {
	    console.log('mousedown');
	    // TODO: find mouse target
	}, false);

	document.addEventListener('keydown', function(event) {
		var key = event.keyCode
		// console.log(event.keyCode)

		if (keyBindings[key] === "moveUp") {
			sendEvent({type: "move", direction: "up", id: p1.id})
		} else if (keyBindings[key] === "moveRight") {
			sendEvent({type: "move", direction: "right", id: p1.id})
	    } else if (keyBindings[key] === "moveDown") {
			sendEvent({type: "move", direction: "down", id: p1.id})
	    } else if (keyBindings[key] === "moveLeft") {
			sendEvent({type: "move", direction: "left", id: p1.id})

		} else if (keyBindings[key] === "stop") {
			sendEvent({type: "stop", id: p1.id})

		} else if (keyBindings[key] === "fireUp") {
			sendEvent({type: "fire", direction: "up", id: p1.id})
		} else if (keyBindings[key] === "fireRight") {
			sendEvent({type: "fire", direction: "right", id: p1.id})
	    } else if (keyBindings[key] === "fireDown") {
			sendEvent({type: "fire", direction: "down", id: p1.id})
	    } else if (keyBindings[key] === "fireLeft") {
			sendEvent({type: "fire", direction: "left", id: p1.id})
		}
	}, false);
}

window.onload = main;
