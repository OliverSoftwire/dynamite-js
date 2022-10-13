import { Strategy } from "./Strategy";
import { randomBasicMove } from "../utils";

export class Predictive extends Strategy {
	constructor(gameState) {
		super(gameState);

		this.bins = {
			R: { count: 0, percentage: 0 },
			P: { count: 0, percentage: 0 },
			S: { count: 0, percentage: 0 },
			D: { count: 0, percentage: 0 },
			W: { count: 0, percentage: 0 }
		};
	}

	handleState() {
		const totalPlays = this.gameState.getNumRounds();
		if (totalPlays === 0) {
			return;
		}

		this.bins[this.gameState.getLastRound().p2].count++;

		Object.values(this.bins).forEach(bin => {
			bin.percentage = bin.count / totalPlays;
		});

		this.confidence = Object.values(this.bins).map(bin => bin.percentage).reduce((a, b) => a > b ? a : b);
	}

	makeMove() {
		if (this.gameState.getNumRounds() === 0) {
			return randomBasicMove();
		}

		let uniformRandom0 = Math.random();
		const uniformRandom1 = Math.random();

		for (const [predictedPlay, playInfo] of Object.entries(this.bins)) {
			if (uniformRandom0 < playInfo.percentage) {
				const isBeatenBy = this.gameState.rules.isBeatenBy[predictedPlay];

				const choice = Math.floor(uniformRandom1 * isBeatenBy.length);
				return isBeatenBy[choice];
			}

			uniformRandom0 -= playInfo.percentage;
		}
	}
}
