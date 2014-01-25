// TODO: Split this up once a module system is chosen. Maybe use require.js

// 'Class' definitions
// spec is the options hash passed to each 'constructor'


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
		var x = 10 + that.pos[1] * 20,
			y = 10 + that.pos[0] * 20;
		ctx.fillStyle = "#ddd";
		ctx.fillRect (x, y, 20, 20);
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
	var that = {
		moving: spec.moving || false,
		direction: spec.direction || "down",
		moveTimer: 0, // Can only move when timer hits 0
		pos: spec.pos || [0, 0],
		id: spec.id
	};
	var map = spec.map;

	that.update = function (ms) {
		if (that.moving) {
			if (that.moveTimer < 0) {
				console.log("moving")
				dir = that.direction;
				if (dir === "up") {
					if (that.pos[0] > 0)
						that.pos[0] -= 1;
				} else if (dir === "right") {
					if (that.pos[1] < map.cols - 1)
						that.pos[1] += 1;
				} else if (dir === "down") {
					if (that.pos[0] < map.rows - 1)
						that.pos[0] += 1;
				} else if (dir === "left") {
					if (that.pos[1] > 0)
						that.pos[1] -= 1;
				}
				that.moveTimer = spec.moveDelay || 200;
			} else {
				that.moveTimer -= ms;
			}
		}
	}

	that.draw = function (ctx) {
		var x = 10 + that.pos[1] * 20,
			y = 10 + that.pos[0] * 20;
		ctx.fillStyle = "#111";
		ctx.fillRect (x, y, 20, 20);
	}
	return that;
}

function player(spec) {
	var that = object(spec);
	that.fire = function (dir) {
		
	}
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
	65: "left",
	68: "right",
	83: "down",
	87: "up",
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
				obj.moving = true;
				obj.direction = event.direction
			} else if(event.type === "stop") {
				myMap.getObjById(event.id).moving = false;
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
	var player = object({
		map: myMap, 
		pos: [1, 2], 
		moving: false,
		id: 1
	})
	myMap.objects.push(player);
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
		if ((keyBindings[key] === "up") ||
	    		(keyBindings[key] === "right") ||
	    		(keyBindings[key] === "down") ||
	    		(keyBindings[key] === "left")) {

			sendEvent({type: "move", direction: keyBindings[key], id: player.id})
		}
		else if (keyBindings[key] === "stop") {
			sendEvent({type: "stop", id: player.id})
		}
	}, false);
}

window.onload = main;