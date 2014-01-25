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
		var myMap = _m.map( {size: {rows: 30, cols: 30}} );
		var p1 = _o.player({
			map: myMap, 
			pos: [1, 2], 
			moving: false
		})
		myMap.objects.push(p1);
		myMap.draw(ctx);
		
		_g.player1 = p1;
		_g.map = myMap

		// Start the game loop
		tick(function (ms) {
			myMap.update(ms);
			myMap.draw(ctx);
		})
	};
	main();
});