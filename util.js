define(function() {
	function createSolidCanvas(height, width, color) {
		var subcan = document.createElement("canvas");
		subcan.height = height;
		subcan.width = width;
		var subctx = subcan.getContext("2d");

		subctx.fillStyle = color;
		subctx.fillRect(0,0,100,100);

		return subcan;
	}

	function createCircleCanvas(radius, color) {
		var subcan = document.createElement("canvas");
		subcan.height = radius * 2;
		subcan.width = radius * 2;
		var subctx = subcan.getContext("2d");

		subctx.beginPath();
		subctx.arc(radius, radius, radius, 0, 2* Math.PI, false);

		subctx.fillStyle = color;
		subctx.fill();

		return subcan;
	}


	return {
		createSolidCanvas: createSolidCanvas,
		createCircleCanvas: createCircleCanvas
	}

});
