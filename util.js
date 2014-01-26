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

	return {
		createSolidCanvas: createSolidCanvas
	}

});
