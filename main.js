require.config({
	// Put config in here
})

require(["objects", "map", "globals", "events"], function (_o, _m, _g, _e) {
	// 'Class' definitions
	// spec is the options hash passed to each 'constructor'

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

	function main() {
		// Initialize the game
		var canvas = document.getElementById("game-canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = 620;
		canvas.height = 620;
		var redMap = _m.map( {size: {rows: 30, cols: 30}, color: "d33"} );
		var greenMap = _m.map( {size: {rows: 30, cols: 30}, color: "3d3"} );
		var blueMap = _m.map( {size: {rows: 30, cols: 30}, color: "33d"} );
		var p1 = _o.player({
			map: redMap, 
			pos: [1, 2], 
			moving: false
		})
		redMap.objects.push(p1);
		redMap.draw(ctx);
		
		_g.map1 = redMap;
		_g.map2 = greenMap;
		_g.map3 = blueMap;
		_g.player1 = p1;

		// Start the game loop
		tick(function (ms) {
			var currentMap = _g.player1.map;
			_g.map1.update(ms);
			_g.map2.update(ms);
			_g.map3.update(ms);
			currentMap.draw(ctx);
		})
	};
	main();
});