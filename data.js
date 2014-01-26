define(["globals"], function(_g) {
	console.log("Loading data");
	return {
		map1: [
			{
				type: _g.types.NPC, 
				kind: _g.kinds.npc.alice,
				color: "#fff",
				sprite: "",
				pos: {col: 1, row: 10}
			},
			{
				type: _g.types.NPC, 
				kind: _g.kinds.npc.bob,
				color: "#aaa",
				sprite: "jfkds",
				pos: {col: 20, row: 10}
			}
		]
	};
		
});
