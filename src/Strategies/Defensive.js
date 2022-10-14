import { Strategy } from "./Strategy";

const WATER_MIN_CONFIDENCE = 0.95;
const PREDICTION_WINDOW_SIZE = 64;

export class Defensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(PREDICTION_WINDOW_SIZE);
	}

	onRoundStart() {
		if (this.gameState.opponentDynamite <= 0 || this.gameState.getNumRounds() < PREDICTION_WINDOW_SIZE) {
			this.confidence = 0;
			return;
		}

		const percentageDynamitePlayed = this.predictionWindow.getPlayPercentage("D");
		this.confidence = percentageDynamitePlayed * percentageDynamitePlayed;

		if (this.confidence < WATER_MIN_CONFIDENCE) {
			this.confidence = 0;
		}
	}

	makeMove() {
		return "W";
	}
}
