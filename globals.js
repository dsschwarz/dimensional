define(function() {
	// Object containing all the key mappings
	var keyBindings = {
		65: "moveLeft",
		68: "moveRight",
		83: "moveDown",
		87: "moveUp",
		37: "fireLeft",
		39: "fireRight",
		40: "fireDown",
		38: "fireUp",
		32: "stop"
	};
	return {
		TILE_SIZE: 20,
		keyBindings: keyBindings,
		map: {},    // Pointer to main map (created in proto.js)
		player1: {} // Pointer to player 1 (created in proto.js)
	}
})