define(["globals", "objects", "npc", "item"],function (_g, _o, _npc, _item) {
	var TILE_SIZE = _g.TILE_SIZE;
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
					that.tiles.push(tile( {pos: [i, j], color: spec.color} ));
				};
			};
		}

		/**
		 * draws tiles, then objects to canvas
		 * @param  {Context} ctx
		 */
		that.draw = function (ctx) {
			for (var i = 0; i < that.tiles.length; i++) {
				that.tiles[i].draw(ctx);
			};
			for (var i = 0; i < that.objects.length; i++) {
				that.objects[i].draw(ctx);
			};
		}

		/**
		 * update all objects
		 * @param  {int} ms Time elapsed in ms since last call
		 */
		that.update = function (ms) {
			for (var i = 0; i < that.objects.length; i++) {
				that.objects[i].update(ms);
			};
		}

		/**
		 * Gets an object by id. Returns null if not found
		 * @param  {int/String} id
		 */
		that.getObjById = function (id) {
			for (var i = 0; i < that.objects.length; i++) {
				if (that.objects[i].id === id) {
					return that.objects[i];
				}
			};
			return null;
		}

		that.getObjsAtPos = function (row, col) {
			var objects = [];

			//TODO: Check if we are in bounds before we access out-of-bounds
			for (var i = 0; i < that.objects.length; i++) {
				if (that.objects[i].pos[0] === row && that.objects[i].pos[1] === col) {
					objects.push(that.objects[i]);
				}
			};
			return objects;
		}

		that.addObj = function (object) {
			object.map = that;
			that.objects.push(object);
		}

		/**
		 * Remove an obj from a map by id. Note: Not garuanteed to destroy object
		 * returns true for success, false for failure
		 */
		that.delObj = function (id) {
			if (id === null) {
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
				return true;
			}
			return false;
		}


		that.populate = function(mapData) {
			console.log("Populating...");
			for (var i = 0; i < mapData.length; i++) {
				var item = mapData[i];
				if (item.type == _g.types.NPC) {
					var spec = {
							pos: [item.pos.row, item.pos.col], 
							map: that,
							kind: item.kind,

							name: item.name,
							color: item.color,
							messages: item.messages

					};
					that.addObj(_npc(spec));
				} else if (item.type == _g.types.ITEM) {
					var spec = {
							pos: [item.pos.row, item.pos.col], 
							map: that,
							name: item.name,
							kind: item.kind

					};
					that.addObj(_item(spec));
				}
				else if (item.type == _g.types.ITEM) {
					var spec = {
							pos: [item.pos.row, item.pos.col], 
							map: that,
							kind: item.kind,
					};
					that.addObj(_item(spec));
				}
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
			color: spec.color || "#ddd",
			pos: spec.pos || [0,0] // Format [row, col]
		}
		that.draw = function (ctx) {
			var x = that.pos[1] * TILE_SIZE,
				y = that.pos[0] * TILE_SIZE;
			ctx.fillStyle = that.color;
			ctx.fillRect (x, y, TILE_SIZE, TILE_SIZE);
		}
		return that;
	}
	return {
		map: map
	}
})
