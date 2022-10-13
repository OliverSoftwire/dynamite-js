import { Strategy } from "./Strategy";

export class Offensive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.enemyWaterPlayed = 0;
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

		if (this.gameState.getLastRound().p2 === "W") {
			this.enemyWaterPlayed++;
		}

		const dynamiteToWinTimeConcentration = this.gameState.dynamite / this.gameState.minRoundsUntilWinner();
		const chanceOfWater = this.enemyWaterPlayed / totalPlays;
		this.confidence = dynamiteToWinTimeConcentration + (1 - chanceOfWater);
	}

	makeMove() {
		return "D";
	}
}
