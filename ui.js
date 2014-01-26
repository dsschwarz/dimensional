define(function() {
	var ui = {
		height: 200,
		avatar: null,
		name: null,
		message: null
	};

	ui.update = function(dt) {
	};

	ui.draw = function(ctx) {
		var canvas = document.getElementById("game-canvas");

		ctx.fillStyle = "#aaaaaa";
		ctx.fillRect(0, canvas.height-ui.height, canvas.width, ui.height);


		if (ui.avatar && ui.name && ui.message) {
			ctx.drawImage(ui.avatar, 20, canvas.height - ui.height + 20);
		}

	};

	/* {} spec members
	 * 
	 * string name
	 * string message
	 * canvas avatar - canvas to draw to avatar box
	 */
	ui.displayMessage = function(spec) {

	}

	return ui;

});
