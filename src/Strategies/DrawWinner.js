import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";

const LIKELY_PLAY_THRESHOLD = 0.5;

export class DrawWinner extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow();
	}

	onRoundStart() {
		this.confidence = this.gameState.pointsAvailable - 1;
	}

	makeMove() {
		const mostLikelyPlay = this.predictionWindow.getMostLikelyPlay();
		const mostLikelyPlayPercentage = this.predictionWindow.getPlayPercentage(mostLikelyPlay);

		if (mostLikelyPlayPercentage > LIKELY_PLAY_THRESHOLD) {
			if (mostLikelyPlay === "W") {
				return randomBasicMove();
			}

			if (mostLikelyPlay === "D") {
				return "W";
			}
		}

		return this.gameState.dynamite > 0 ? "D" : randomBasicMove();
	}
}
