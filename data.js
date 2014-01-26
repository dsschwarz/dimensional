define(["globals"], function(_g) {
	console.log("Loading data");
	return {
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
				color: "#ff0",
				sprite: "jfkds",
				pos: {col: 20, row: 10},
				messages: {
					firstTalk: ":|",
					normal: [":)", ":D"],
					teleport: [":("],
					collide: ">:("
				}
			}
		],
		map2: [
			{
				type: _g.types.ITEM, 
				kind: _g.kinds.item.fuel,
				name: "Bob",
				color: "#ff0",
				sprite: "jfkds",
				pos: {col: 10, row: 10}
			}
		]
	};
		
});
