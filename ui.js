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
			ctx.fillStyle = "#fff";
			ctx.font = "20px arial";
			ctx.fillText(ui.name, 200, canvas.height - ui.height +20);
			ctx.font = "10px arial";
			ctx.fillText(ui.message, 200, canvas.height - ui.height +40);
		}

	};

	ui.displayMessage = function(name, message, avatar) {
		ui.name = name;
		ui.message = message;
		ui.avatar = avatar;
	}

	ui.nextMessage = function() {
		//TODO: Stub
		ui.avatar = null;
		ui.message = null;
		ui.name = null;
	}

	ui.clearMessage = function() {
		ui.avatar = null;
		ui.message = null;
		ui.name = null;
	}




	return ui;

});
