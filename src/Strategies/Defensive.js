import { DYNAMITE_LIMIT } from "../constants";
import { Strategy } from "./Strategy";

export class Defensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow();
	}

	handleState() {
		const totalPlays = this.gameState.getNumRounds();
		if (totalPlays === 0) {
			return;
		}

		if (this.gameState.opponentDynamite <= 0) {
			this.confidence = 0;
			return;
		}

		this.confidence = this.predictionWindow.getPlayPercentage("D");
	}

	makeMove() {
		return "W";
	}
}
