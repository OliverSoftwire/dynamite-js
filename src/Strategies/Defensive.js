import { Strategy } from "./Strategy";

export class Defensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(8);
	}

	onRoundStart() {
		if (this.gameState.opponentDynamite <= 0) {
			this.confidence = 0;
			return;
		}

		const percentageDynamitePlayed = this.predictionWindow.getPlayPercentage("D");
		return percentageDynamitePlayed * percentageDynamitePlayed;
	}

	makeMove() {
		return "W";
	}
}
