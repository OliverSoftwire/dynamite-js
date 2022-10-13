import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";

const POINTS_REFERENCE_WEIGHT = 10;

export class DrawWinner extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.bins = {
			D: 0,
			W: 0
		};
	}

	handleState() {
		if (this.gameState.getNumRounds() === 0) {
			return;
		}

		const lastOpponentPlay = this.gameState.getLastRound().p2;
		if (lastOpponentPlay === "D") {
			this.bins.D++;
		} else if (lastOpponentPlay === "W") {
			this.bins.W++;
		}

		this.confidence = this.gameState.pointsAvailable / POINTS_REFERENCE_WEIGHT;
	}

	makeMove() {
		const opponentPrefersDynamite = this.bins.D > this.bins.W;
		if (opponentPrefersDynamite && this.gameState.opponentDynamite > 0) {
			return "W";
		}
		if (!opponentPrefersDynamite && this.gameState.dynamite > 0) {
			return "D";
		}

		return randomBasicMove();
	}
}
