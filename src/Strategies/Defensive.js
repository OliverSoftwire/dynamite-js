import { DYNAMITE_LIMIT } from "../constants";
import { Strategy } from "./Strategy";

export class Defensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(8);
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

		const percentageDynamitePlayed = this.predictionWindow.getPlayPercentage("D");
		return percentageDynamitePlayed * percentageDynamitePlayed;
	}

	makeMove() {
		return "W";
	}
}
