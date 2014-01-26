define(function() {
	var returnObject = {
		TILE_SIZE: 20,
		map1: {},
		map2: {},
		map3: {},    // Pointer to main maps (created in proto.js)
		player1: {} // Pointer to player 1 (created in proto.js)
	}
	// Object containing all the key mappings
	returnObject.keyBindings = {
		65: "moveLeft", // awsd
		68: "moveRight",
		83: "moveDown",
		87: "moveUp",

		37: "fireLeft", // Left key
		39: "fireRight", 
		40: "fireDown",
		38: "fireUp",
		32: "stop",

		61: "action", //"="

		49: "setColorRed", // 1
		50: "setColorGreen", // 2
		51: "setColorBlue", // 3

		16: "shiftSelf" // shift key enables shifting self with number key
	};

	returnObject.types = {
		PLAYER: 0,
		NPC: 1,
		ITEM: 2
	};

	returnObject.kinds = {
		npc: {
			alice: 0,
			bob: 1, 
			charlie: 2
		}
	};

	returnObject.getObjById = function(id) {
		var obj = returnObject.map1.getObjById(id) || returnObject.map2.getObjById(id) || returnObject.map3.getObjById(id);
		return obj;
	};

	// Shift an object from on map to another
	return returnObject; 
})
