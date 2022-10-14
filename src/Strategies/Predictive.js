import { Strategy } from "./Strategy";

export class Predictive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(8);
	}

	onRoundStart() {
		this.confidence = this.predictionWindow.getMostLikelyPlayPercentage();
	}

	makeMove() {
		let mostLikelyPlaySelectionProb = Math.random();

		for (const [predictedPlay, playInfo] of Object.entries(this.predictionWindow.bins)) {
			if (mostLikelyPlaySelectionProb < playInfo.percentage) {
				const isBeatenBy = this.gameState.rules.isBeatenBy[predictedPlay];

				const choice = Math.floor(Math.random() * isBeatenBy.length);
				return isBeatenBy[choice];
			}

			mostLikelyPlaySelectionProb -= playInfo.percentage;
		}
	}
}
