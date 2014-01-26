define(["globals", "objects", "ui"], function (_g, _o, _u) {
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
			id: objectId++,
			type: spec.type,
			kind: spec.kind
		};
		var moveTimer = 0; // Can only move when timer hits 0

		that.update = function (ms) {
			if (that.moving) {
				if (moveTimer < 0) {
					console.log("moving");
					var dir = that.direction;
					if (dir === "up") {
						if (that.pos[0] > 0) {
							var objs = that.map.getObjsAtPos(that.pos[0] - 1, that.pos[1]);
							if (objs.length > 0){
								var hardCollide = false;
								for(var idx in objs) {if (objs[idx].onCollide(that)) {hardCollide = true}}
							} 
							if (!hardCollide) {
								that.pos[0] -= 1;
							}
						}
					} else if (dir === "down") {
						if (that.pos[0] < that.map.rows - 1) {
							var objs = that.map.getObjsAtPos(that.pos[0] + 1, that.pos[1]);
							if (objs.length > 0) {
								var hardCollide = false;
								for(var idx in objs) {if (objs[idx].onCollide(that)) {hardCollide = true}}
							}
							if (!hardCollide) {
								that.pos[0] += 1;
							}
						}
					} else if (dir === "right") {
						if (that.pos[1] < that.map.cols - 1) {
							var objs = that.map.getObjsAtPos(that.pos[0], that.pos[1] + 1);
							if (objs.length > 0) {
								var hardCollide = false;
								for(var idx in objs) {if (objs[idx].onCollide(that)) {hardCollide = true}}
							}
							if (!hardCollide) {
								that.pos[1] += 1;
							}
						}
					} else if (dir === "left") {
						if (that.pos[1] > 0) {
							var objs = that.map.getObjsAtPos(that.pos[0], that.pos[1] - 1);
							if (objs.length > 0){
								var hardCollide = false;
								for(var idx in objs) {if (objs[idx].onCollide(that)) {hardCollide = true}}
							}
							if (!hardCollide) {
								that.pos[1] -= 1;
							}

						}
					} else {
						console.log("Unknown direction - " + that.direction);
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

		// Shifts an object to map of target color
		that.shiftObject = function(color) {
			console.log("shift", that)
			var targetMap;
			switch (color) {
			case "red":
				targetMap = _g.map1;
				break;
			case "green":
				targetMap = _g.map2;
				break;
			case "blue":
				targetMap = _g.map3;
				break;
			default:
				console.log("Unrecognized color - " + color);
				return; // Exit function - do not shift object
			}
			that.map.delObj(that.id);
			that.map = targetMap;
			targetMap.addObj(that);
		}

		that.onCollide = function() {
			return false;
		}

		return that;
	}
	
	function laser(spec) {
		var MAX_TIMER = 300;
		var timer = MAX_TIMER,
			row = spec.pos[0] || 0,
			col = spec.pos[1] || 0,
			map = spec.map,
			color = spec.color,
			dir = spec.direction;

		var that = {
			id: objectId++
		}

		// Local function to check for objects and handle collision with them
		function handleCollision(row, col) {
			var objects = map.getObjsAtPos(row, col);
			for (var idx in objects) {
				var obj = objects[idx];
				console.log("Found obj", obj);
				if (obj.type === _g.types.PLAYER) {
					obj.shiftObject(color)
				}

				else if (obj.type === _g.types.NPC) {
					obj.onTeleport(color);
				}
			}
		}


		that.update = function(ms) {
			timer -= ms;
			if (timer <= 0) {
				map.delObj(that.id);
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

			if (color === "red") {
				ctx.fillStyle = 'rgba(220, 30, 30, ' + timer/MAX_TIMER + ')';
			} else if (color === "green") {
				ctx.fillStyle = 'rgba(30, 220, 30, ' + timer/MAX_TIMER + ')';
			} else if (color === "blue") {
				ctx.fillStyle = 'rgba(30, 30, 220,' + timer/MAX_TIMER + ')';
			}
			ctx.fillRect (x, y, width, height);
		}

		//
		function init() {
			console.log("Laser init");
			// detect a hit
			switch (dir) {
			case "left":
				for (var i = col - 1; i > 0; i--) {
					handleCollision(row, i);
				};
				break;

			case "right":
				for (var i = col + 1; i < map.cols - 1; i++) {
					handleCollision(row, i);
				};
				break;
			case "up":
				for (var i = row - 1; i > 0; i--) {
					handleCollision(i, col);
				};
				break;
			case "down":
				for (var i = row + 1; i < map.rows; i++) {
					handleCollision(i, col);
				};
				break;
			}
		}
		init();

		return that;
	}

	function player(spec) {
		spec.type = _g.types.PLAYER;
		spec.kind = null;

		var that = object(spec);
		var fireDelay = 500,
			fireDir = null,
			fireColor = "green",
			fuel = 0;
		that.fire = function (dir) {
			fireDir = dir;
		}
		that.setColor = function (color) {
			fireColor = color || "red";
		}
		var superUpdate = that.update;
		that.update = function (ms) {
			superUpdate(ms);
			if (fireDir) {
				if (fireDelay <= 0) {
					that.map.addObj(laser({direction: fireDir, pos: that.pos, map: that.map, color: fireColor}));
					fireDelay = 1000;
					fireDir = null;
					// Space out shots by 1 sec (500 ms delay, 500 ms to charge)
				} else {
					fireDelay -= ms;
				}

			// If not fired recently, laser should go immediately into charge state
			} else if (fireDelay > 500) {
				fireDelay -= ms;
			}
		}

		that.findAction = function() {
			var objs = [];
			objs.push.apply(objs, that.map.getObjsAtPos(that.pos[0]+1, that.pos[1]));
			objs.push.apply(objs, that.map.getObjsAtPos(that.pos[0]-1, that.pos[1]));
			objs.push.apply(objs, that.map.getObjsAtPos(that.pos[0], that.pos[1]+1));
			objs.push.apply(objs, that.map.getObjsAtPos(that.pos[0], that.pos[1]-1));
			// switch(that.direction) {
			// case "down":
			// 	objs.append(that.map.findObjAtPos(that.pos[0]+1, that.pos[1]));
			// 	break;
			// case "up":
			// 	objs.append(that.map.findObjAtPos(that.pos[0]+1, that.pos[1]));
			// 	break;
			// case "left":
			// 	objs.append(that.map.findObjAtPos(that.pos[0], that.pos[1]-1));
			// 	break;
			// case "right":
			// 	objs.append(that.map.findObjAtPos(that.pos[0], that.pos[1]+1));
			// 	break;

			// }

			if (objs.length == 1) {
				var obj = objs[0];
				if (obj.type == _g.types.NPC) {
					obj.onTalk();
				}
			}
		}

		return that;
	}



	return {
		object: object,
		player: player,
	}
})
