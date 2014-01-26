define(["globals"], function(_g) {
	console.log("Loading data");
	return {
		mapData: {
			map1: [
				{
					type: _g.types.NPC, 
					kind: _g.kinds.npc.alice,
					name: "Alice",
					color: "#f0f",
					sprite: "",
					pos: {col: 1, row: 10},
					messages: {
						firstTalk: "Blorp!",
						normal: ["Hello, mysterious person."],
						teleport: ["AHHH!"],
						collide: "Watch it!"
					}
				},
				{
					type: _g.types.NPC, 
					kind: _g.kinds.npc.bob,
					name: "Bob",
					color: "#f70",
					sprite: "jfkds",
					pos: {col: 20, row: 10},
					messages: {
						firstTalk: ":|",
						normal: [":)", ":D"],
						teleport: [":("],
						collide: ">:("
					}
				},

				//Items
				{
					type: _g.types.ITEM,
					kind: _g.kinds.item.banana,
					pos: {col: 15, row: 15}
				},
				{
					type: _g.types.ITEM,
					kind: _g.kinds.item.fuel,
					pos: {col: 15, row: 10}
				}

				
			]
		},

		itemData:
		{
			banana: {
				name: "Banana",
				color: "#ff0",
				messages: {
					description: "A yellow fruit",
					action: "Yummy!"
				}
			},
			rock: {
				name: "Rock",
				color: "#aaa",
				messages: {
					description: "A rock",
					action: ""
				}
			},
			fuel: {
				name: "Fuel",
				color: "#fff",
				messages: {
					description: "For lasers",
					action: "Bzzz!"
				}
			}
		}
	};
});
