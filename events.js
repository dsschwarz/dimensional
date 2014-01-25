define(["globals"],function (_g) {

	// Stub
	function sendEvent (event) {
		// console.log("Sending: ", event)
		receiveEvent(event); // Feed it back in
	}

	// Stub
	function receiveEvent (event) {
		try {
			if (event.type === "move") {
				var obj = _g.getObjById(event.id);
				if (obj.id !== 0) {
					console.log("Not player1", obj);
					console.log("Event received - ", event);
				}
				obj.moving = true;
				obj.direction = event.direction;
			} else if(event.type === "stop") {
				var obj = _g.getObjById(event.id);
				if (event.direction) {
					if (obj.direction === event.direction) {
						obj.moving = false;
					}
				} else {
					obj.moving = false;
				}

			} else if (event.type === "fire") {
				_g.getObjById(event.id).fire(event.direction);
			}
		} catch(err) {
			console.log("receiveEvent error - ", err);
		}
	}

	var TILE_SIZE = _g.TILE_SIZE;
	document.addEventListener('mousedown', function(event) {
	    console.log('mousedown');
	    // TODO: find mouse target
	}, false);

	document.addEventListener('keydown', function(event) {
		var key = event.keyCode;
		// console.log(event.keyCode)

		if (_g.keyBindings[key] === "moveUp") {
			sendEvent({type: "move", direction: "up", id: _g.player1.id});
		} else if (_g.keyBindings[key] === "moveRight") {
			sendEvent({type: "move", direction: "right", id: _g.player1.id});
	    } else if (_g.keyBindings[key] === "moveDown") {
			sendEvent({type: "move", direction: "down", id: _g.player1.id});
	    } else if (_g.keyBindings[key] === "moveLeft") {
			sendEvent({type: "move", direction: "left", id: _g.player1.id});

		} else if (_g.keyBindings[key] === "stop") {
			sendEvent({type: "stop", id: _g.player1.id});

		} else if (_g.keyBindings[key] === "fireUp") {
			sendEvent({type: "fire", direction: "up", id: _g.player1.id});
		} else if (_g.keyBindings[key] === "fireRight") {
			sendEvent({type: "fire", direction: "right", id: _g.player1.id});
	    } else if (_g.keyBindings[key] === "fireDown") {
			sendEvent({type: "fire", direction: "down", id: _g.player1.id});
	    } else if (_g.keyBindings[key] === "fireLeft") {
			sendEvent({type: "fire", direction: "left", id: _g.player1.id});
		}
	}, false);

	document.addEventListener('keyup', function(event) {
		var key = event.keyCode;

		if (_g.keyBindings[key] === "moveUp") {
			sendEvent({type: "stop", direction: "up", id: _g.player1.id});
		} else if (_g.keyBindings[key] === "moveRight") {
			sendEvent({type: "stop", direction: "right", id: _g.player1.id});
	    } else if (_g.keyBindings[key] === "moveDown") {
			sendEvent({type: "stop", direction: "down", id: _g.player1.id});
	    } else if (_g.keyBindings[key] === "moveLeft") {
			sendEvent({type: "stop", direction: "left", id: _g.player1.id});
		}
	}, false);
});
