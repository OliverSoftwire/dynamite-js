import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";

const POINTS_REFERENCE_WEIGHT = 5;

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
		return mostLikelyPlay === "W" || this.gameState.dynamite <= 0 ? randomBasicMove() : "D";
	}
}
