import { Rules } from "./Rules";
import { GameStateWrapper } from "./GameStateWrapper";

import { Offensive, Defensive, Predictive, DrawWinner } from "./Strategies";

import { randomBasicMove } from "./utils";

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
			totalConfidence += strategy.confidence;
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
//export default new Bot();

//console.log(module);
//Object.assign(module.exports, new Bot());

/*
likely strats:
offensive (spamming dynamite until expended with possible exit condition)
counter:
	track number of rounds left vs opponent's dynamite
	if the opponent has used many dynamite in a short period they're likely to throw again
	if the concentration of dynamite to rounds left is high it's likely they will use them now

defensive (if number of dynamite thrown by opposing player is high over the past rounds, throw water)
counter:
	same as offensive counter except tracks concentration of water plays

random (just choose a random move regardless of game state)
counter:
	still check other strategies but if nothing is conclusive then use dynamite spaced over the remaining rounds with random gaps
	after which just choose rock/paper/scissors based on previous opponent moves
	if they were random then we'll effectively throw randomly, otherwise we'll counter any repeats or biasing

predictive (use previous rounds to calculate the most likely move for the opponent given the last few rounds, aka pattern recog)
counter:
	only way to counter this is to have a diverse collection of strategies and introduce some level of randomness between them, regardless of confidence
	or use normalised floating point confidence values to choose a branch

*/
