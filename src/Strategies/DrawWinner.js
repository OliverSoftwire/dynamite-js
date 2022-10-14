import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";

const POINTS_REFERENCE_WEIGHT = 5;
const LIKELY_PLAY_THRESHOLD = 0.8;

export class DrawWinner extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow();
	}

	handleState() {
		this.confidence = (this.gameState.pointsAvailable - 1) / POINTS_REFERENCE_WEIGHT;
	}

	makeMove() {
		const mostLikelyPlay = this.predictionWindow.getMostLikelyPlay();
		const mostLikelyPlayPercentage = this.predictionWindow.getMostLikelyPlayPercentage();

		if (mostLikelyPlayPercentage > LIKELY_PLAY_THRESHOLD) {
			if (mostLikelyPlay === "W") {
				return randomBasicMove();
			}

			if (mostLikelyPlay === "D") {
				return "W";
			}
		}

		return "D";
	}
}
