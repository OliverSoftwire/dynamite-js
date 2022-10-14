import { DYNAMITE_LIMIT } from "../constants";
import { Strategy } from "./Strategy";

export class Offensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.predictionWindow = gameState.newPredictionWindow(4);
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

		const dynamiteLeftPercentage = this.gameState.dynamite / DYNAMITE_LIMIT;
		this.confidence = dynamiteLeftPercentage * (1 - this.predictionWindow.getPlayPercentage("W"));
	}

	makeMove() {
		return "D";
	}
}
