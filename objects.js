define(["globals"], function (_g) {
	var TILE_SIZE = _g.TILE_SIZE;
	var objectId = 0;
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
				}
			}
			if (moveTimer >= 0) {
				moveTimer -= ms;
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
			timer -= ms;
			if (timer <= 0) {
				map.delObj(that.id)
			}
		};

		that.draw = function(ctx) {
			var x, y, width, height;
			if (dir === "left") {
				x = 0;
				y = row * TILE_SIZE + TILE_SIZE/4;
				width = col * TILE_SIZE;
				height = TILE_SIZE/2;
			} else if (dir === "right") {
				x = (col + 1) * TILE_SIZE;
				y = row * TILE_SIZE + TILE_SIZE/4;
				width = (map.cols - 1 - col) * TILE_SIZE;
				height = TILE_SIZE/2;
			} else if (dir === "up") {
				x = col * TILE_SIZE + TILE_SIZE/4;
				y = 0;
				width = TILE_SIZE/2;
				height = row * TILE_SIZE;
			} else if (dir === "down") {
				x = col * TILE_SIZE + TILE_SIZE/4;
				y = (row + 1) * TILE_SIZE;
				width = TILE_SIZE/2;
				height = (map.cols - 1 - row) * TILE_SIZE;
				
			}
			ctx.fillStyle = 'rgba(220, 220, 30, ' + timer/MAX_TIMER + ')';
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
	return {
		player: player,
		object: object
	}
})