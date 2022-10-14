import { Strategy } from "./Strategy";

export class Offensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(10);
	}

	onRoundStart() {
		if (this.gameState.dynamite <= 0) {
			this.confidence = 0;
			return;
		}

		const chanceOpponentBeatsDynamite = this.predictionWindow.getPlayPercentage("W") + this.predictionWindow.getPlayPercentage("D");
		const roundsUntilWinnerWeight = this.gameState.dynamite / this.gameState.minRoundsUntilWinner();
		this.confidence = (1 - chanceOpponentBeatsDynamite) * this.gameState.pointsAvailable * roundsUntilWinnerWeight;
	}

	makeMove() {
		return "D";
	}
}
