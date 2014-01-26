define(["globals"],function (_g) {
	var shiftEnabled = false; // Switching colors shifts player

	// Stub
	function sendEvent (event) {
		console.log("Sending: ", event)
		receiveEvent(event); // Feed it back in
	}

	// Stub
	function receiveEvent (event) {
		try {
			switch (event.type) {
			case "move":
				var obj = _g.getObjById(event.id);
				if (obj.id !== 0) {
					console.log("Not player1", obj)
					console.log("Event received - ", event)
				}
				obj.moving = true;
				obj.direction = event.direction;
				break;

			case "stop":
				var obj = _g.getObjById(event.id);
				if (event.direction) {
					if (obj.direction === event.direction) {
						obj.moving = false;
					}
				} else {
					obj.moving = false;
				}
				break;

			case "fire":
				_g.getObjById(event.id).fire(event.direction)
				break;

			case "setColor":
				_g.getObjById(event.id).setColor(event.color);
				break;

			case "shiftSelf":
				_g.shiftObject(event.id, event.color);
				break;

			default:
				console.log("Unrecognized event.type - " + event.type, event)
			}
		} catch(err) {
			console.log("receiveEvent error - ", err)
		}
	}

	document.addEventListener('mousedown', function(event) {
	    console.log('mousedown');
	    // TODO: find mouse target
	}, false);

	document.addEventListener('keydown', function(event) {
		var key = event.keyCode
		console.log(event.keyCode)

		switch(_g.keyBindings[key]) {
		case "moveUp":
			sendEvent({type: "move", direction: "up", id: _g.player1.id})
			break;
		case "moveRight":
			sendEvent({type: "move", direction: "right", id: _g.player1.id})
			break;
	    case "moveDown":
			sendEvent({type: "move", direction: "down", id: _g.player1.id})
			break;
	    case "moveLeft":
			sendEvent({type: "move", direction: "left", id: _g.player1.id})
			break;

		case "stop":
			sendEvent({type: "stop", id: _g.player1.id})
			break;

		case "fireUp":
			sendEvent({type: "fire", direction: "up", id: _g.player1.id})
			break;
		case "fireRight":
			sendEvent({type: "fire", direction: "right", id: _g.player1.id})
			break;
	    case "fireDown":
			sendEvent({type: "fire", direction: "down", id: _g.player1.id})
			break;
	    case "fireLeft":
			sendEvent({type: "fire", direction: "left", id: _g.player1.id})
			break;

		case "setColorRed":
			if(shiftEnabled) {
				sendEvent({type: "shiftSelf", id: _g.player1.id, color: "red"});
			} else {
				sendEvent({type: "setColor", id: _g.player1.id, color: "red"});
			}
			break;
		case "setColorGreen":
			if(shiftEnabled) {
				sendEvent({type: "shiftSelf", id: _g.player1.id, color: "green"});
			} else {
				sendEvent({type: "setColor", id: _g.player1.id, color: "green"});
			}
			break;
		case "setColorBlue":
			if(shiftEnabled) {
				sendEvent({type: "shiftSelf", id: _g.player1.id, color: "blue"});
			} else {
				sendEvent({type: "setColor", id: _g.player1.id, color: "blue"});
			}
			break;

		case "shiftSelf":
			shiftEnabled = true;
			break;

		default:
			// Key is not bound
			break;
		}
	}, false);

	document.addEventListener('keyup', function(event) {
		var key = event.keyCode

		switch(_g.keyBindings[key]) {
		case "moveUp": 
			sendEvent({type: "stop", direction: "up", id: _g.player1.id})
			break;
		case "moveRight":
			sendEvent({type: "stop", direction: "right", id: _g.player1.id})
			break;
	    case "moveDown":
			sendEvent({type: "stop", direction: "down", id: _g.player1.id})
			break;
	    case "moveLeft":
			sendEvent({type: "stop", direction: "left", id: _g.player1.id})
			break;

		case "shiftSelf":
			shiftEnabled = false;
			break;
		}
	}, false);
});