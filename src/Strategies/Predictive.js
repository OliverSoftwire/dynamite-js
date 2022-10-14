import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";
import { PredictionWindow } from "../PredictionWindow";

export class Predictive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(12);
	}

	handleState() {
		this.confidence = this.predictionWindow.getMostLikelyPlayPercentage();
	}

	makeMove() {
		let uniformRandom0 = Math.random();
		const uniformRandom1 = Math.random();

		for (const [predictedPlay, playInfo] of Object.entries(this.predictionWindow.bins)) {
			if (uniformRandom0 < playInfo.percentage) {
				const isBeatenBy = this.gameState.rules.isBeatenBy[predictedPlay];

				const choice = Math.floor(uniformRandom1 * isBeatenBy.length);
				return isBeatenBy[choice];
			}

			uniformRandom0 -= playInfo.percentage;
		}
	}
}
