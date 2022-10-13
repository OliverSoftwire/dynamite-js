export class Rules {
	constructor() {
		this.beats = {
			R: ["S"],
			P: ["R"],
			S: ["P"],
			D: ["R", "P", "S"],
			W: ["D"]
		};

		// Note, does not include dynamite to avoid strategies accidentally overusing
		// Strategies that use dynamite need more complex rules to determine when to use
		this.isBeatenBy = {
			R: ["P"],
			P: ["S"],
			S: ["R"],
			D: ["W"],
			W: ["R", "P", "S"]
		};
	}

	aBeatsB(a, b) {
		return b in this.beats[a];
	}
}
