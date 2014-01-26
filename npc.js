define(["globals", "objects", "ui"], function(_g, _o, _u) {
	var TILE_SIZE = _g.TILE_SIZE;
	function npc(spec) {
		spec.type = _g.types.NPC;
		spec.kind = null;
		var that = _o.object(spec);

		that.name = spec.name;
		that.color = spec.color;
		
		that.update = function() {
		}

		that.draw = function(ctx) {
			ctx.fillStyle = "#000";
			var x = that.pos[1] * TILE_SIZE + TILE_SIZE/4;
			var y = that.pos[0] * TILE_SIZE + TILE_SIZE/4;
			var width = TILE_SIZE/2;
			var height = TILE_SIZE/2;
			ctx.fillStyle = that.color;
			ctx.fillRect(x, y, width, height);
		}

		that.onCollide = function() {
		}

		that.onTalk = function() {
			var subcan = document.createElement("canvas");
			subcan.height = 100;
			subcan.width = 100;
			var subctx = subcan.getContext("2d");

			subctx.fillStyle = "#f00";
			subctx.fillRect(0,0,100,100);

			_u.displayMessage(that.name, "Hello!", subcan);
		}

		that.onTeleport = function() {
			alert("AHHH!");
		}

		return that;
	}

	return npc;
});
