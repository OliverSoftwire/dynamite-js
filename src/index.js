import { Rules } from "./Rules";
import { GameStateWrapper } from "./GameStateWrapper";

import { Offensive, Defensive, Predictive, DrawWinner } from "./Strategies";

import { randomBasicMove } from "./utils";

import { MIN_CONFIDENCE } from "./constants";

class Bot {
	constructor() {
		this.gameState = new GameStateWrapper(new Rules());

		this.strategies = [
			new Predictive(this.gameState),
			new Offensive(this.gameState),
			new Defensive(this.gameState),
			new DrawWinner(this.gameState)
		];
	}

	checkDynamite(move) {
		if (move === "D" && this.gameState.dynamite <= 0) {
			throw "Tried to use too much dynamite";
		}
	}

    makeMove(gamestate) {
		this.gameState.processRounds(gamestate.rounds);
		if (!this.gameState.hasRoundBeenPlayed()) {
			return randomBasicMove();
		}

		let totalConfidence = 0;

		this.strategies.forEach(strategy => {
			strategy.onRoundStart(this.gameState);

			if (strategy.confidence > MIN_CONFIDENCE) {
				totalConfidence += strategy.confidence;
			} else {
				strategy.confidence = 0;
			}
		});

		if (totalConfidence === 0) { // Need epsilon here? does js approximately equate floats?
			return randomBasicMove();
		} else {
			let strategyProbability = Math.random();
			for (const strategy of this.strategies) {
				const renormalisedConfidence = strategy.confidence / totalConfidence;

				if (strategyProbability < renormalisedConfidence) {
					const move = strategy.makeMove();
					this.checkDynamite(move);
					return move;
				}
				
				strategyProbability -= renormalisedConfidence;
			}
		}
    }
}

export default new Bot();
