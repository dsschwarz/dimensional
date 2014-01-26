define(["globals", "objects", "data", "ui", "util"], function(_g, _o, _d, _u, _util) {
	var TILE_SIZE = _g.TILE_SIZE;

	function item(spec) {
		spec.type = _g.types.ITEM;

		var that = _o.object(spec);


		that.update = function(dt) {
		}

		that.draw = function(ctx) {
			switch(that.kind) {
				case _g.kinds.item.banana:
					ctx.fillStyle = _d.itemData.banana.color;
					break;
				case _g.kinds.item.rock:
					break;
				case _g.kinds.item.fuel:
					ctx.fillStyle = _d.itemData.fuel.color;
					break;
				default:
					break;
			}

			var x = that.pos[1] * TILE_SIZE + TILE_SIZE/2;
			var y = that.pos[0] * TILE_SIZE + TILE_SIZE/2;
			var radius = TILE_SIZE/4

			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2* Math.PI, false);

			ctx.fillStyle = that.color;
			ctx.fill();
		}

		that.onCollide = function(obj) {
			switch(that.kind) {
				case _g.kinds.item.banana:
					var data = _d.itemData.banana;
					var subcan = _util.createCircleCanvas(50, data.color);
					_u.displayMessage(data.name, data.messages.description, subcan);
					break;
				case _g.kinds.item.rock:
					break;
				case _g.kinds.item.fuel:
					break;
				default:
					break;
			}
			return false;
		}

		that.onAction = function() {
			switch(that.kind) {
				case _g.kinds.item.banana:
					var data = _d.itemData.banana;
					var subcan = _util.createCircleCanvas(50, data.color);
					_u.displayMessage(data.name, data.messages.action, subcan);
					that.map.delObj(that.id);
					break;
				case _g.kinds.item.rock:
					break;
				case _g.kinds.item.fuel:
					_g.player1.fuel += 1;
					that.map.delObj(that.id);
					break;
				default:
					break;
			}
		}


		that.onTeleport = function(color) {
			that.shiftObject(color);
		}

		return that;
	}

	return item;
});
