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
	returnObject.getObjById = function(id) {
		var obj = returnObject.map1.getObjById(id) || returnObject.map2.getObjById(id) || returnObject.map3.getObjById(id);
		return obj;
	}
	return returnObject; 
})