import { Strategy } from "./Strategy";

export class Offensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow();
	}

	handleState() {
		const totalPlays = this.gameState.getNumRounds();
		if (totalPlays === 0) {
			return;
		}

		if (this.gameState.dynamite <= 0) {
			this.confidence = 0;
			return;
		}

		const dynamiteToWinTimeConcentration = this.gameState.dynamite / this.gameState.minRoundsUntilWinner();
		this.confidence = dynamiteToWinTimeConcentration * (1 - this.predictionWindow.getPlayPercentage("W"));
	}

	makeMove() {
		return "D";
	}
}
