import { DYNAMITE_LIMIT } from "../constants";
import { Strategy } from "./Strategy";

export class Defensive extends Strategy {
	constructor(gameState) {
		super(gameState);
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

		const enemyDynamitePlayed = DYNAMITE_LIMIT - this.gameState.opponentDynamite;
		this.confidence = enemyDynamitePlayed / totalPlays;
	}

	makeMove() {
		return "W";
	}
}
