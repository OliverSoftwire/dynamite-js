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
		const opponentPrefersDynamite = this.predictionWindow.getNumPlays("D") > this.predictionWindow.getNumPlays("W");
		if (opponentPrefersDynamite && this.gameState.opponentDynamite > 0) {
			return "W";
		}
		if (!opponentPrefersDynamite && this.gameState.dynamite > 0) {
			return "D";
		}

		return randomBasicMove();
	}
}
