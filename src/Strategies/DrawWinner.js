import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";

const LIKELY_PLAY_THRESHOLD = 0.5;

export class DrawWinner extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.totalDrawWinners = 0;
		this.opponentDrawWinners = {
			R: 0,
			P: 0,
			S: 0,
			D: 0,
			W: 0
		};

		this.roundBeforeLastWasDraw = false;
	}

	mostLikelyDrawWinner() {
		return Object.keys(this.opponentDrawWinners).reduce(
			(a, b) => this.opponentDrawWinners[a] > this.opponentDrawWinners[b] ? a : b
		);
	}

	drawWinnerPercentage(play) {
		if (this.totalDrawWinners === 0) {
			return 0;
		}

		return this.opponentDrawWinners[play] / this.totalDrawWinners;
	}

	onRoundStart() {
		if (!this.gameState.lastRoundWasDraw()) {
			const lastRound = this.gameState.getLastRound();
			if (this.roundBeforeLastWasDraw && this.gameState.rules.aBeatsB(lastRound.p2, lastRound.p1)) {
				this.opponentDrawWinners[lastRound.p2]++;
				this.totalDrawWinners++;
			}

			this.roundBeforeLastWasDraw = false;
			this.confidence = 0;

			return;
		}

		this.roundBeforeLastWasDraw = true;
		this.confidence = (this.gameState.pointsAvailable - 1) * this.drawWinnerPercentage(this.mostLikelyDrawWinner());
	}

	makeMove() {
		const selectionProbability = Math.random();

		if (selectionProbability < this.drawWinnerPercentage("D")) {
			return "W";
		}
		if (selectionProbability < this.drawWinnerPercentage("D") + this.drawWinnerPercentage("W")) {
			return randomBasicMove();
		}
		if (this.gameState.dynamite > 0) {
			return "D"
		}

		return randomBasicMove();
	}
}
