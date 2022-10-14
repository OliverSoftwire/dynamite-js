export class Strategy {
	constructor(gameState) {
		this.gameState = gameState;
		this.confidence = 0;
	}

	onRoundStart() {
		return;
	}

	makeMove() {
		throw "Strategy does not override makeMove";
	}
}
