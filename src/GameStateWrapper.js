import { ROUNDS_NEEDED_TO_WIN, ROUNDS_LIMIT, DYNAMITE_LIMIT } from "./constants";

export class GameStateWrapper {
	constructor(rules) {
		this.dynamite = DYNAMITE_LIMIT;
		this.opponentDynamite = DYNAMITE_LIMIT;

		this.rounds = [];

		this.roundsWon = 0;
		this.roundsLost = 0;
		this.roundsPlayed = 0;

		this.pointsAvailable = 1;

		this.rules = rules;
	}

	minRoundsUntilWinner() {
		const neededToWin = ROUNDS_NEEDED_TO_WIN - this.roundsWon;
		const opponentNeededToWin = ROUNDS_NEEDED_TO_WIN - this.roundsWon;

		return Math.min(neededToWin, opponentNeededToWin);
	}

	playerCanWin() {
		return this.minRoundsUntilWinner() + this.roundsPlayed <= ROUNDS_LIMIT;
	}

	processRounds(rounds) {
		this.rounds = rounds;

		if (rounds.length === 0) {
			return;
		}

		const lastRound = rounds[rounds.length - 1];
		
		if (lastRound.p1 === "D") {
			this.dynamite--;
		}

		if (lastRound.p2 === "D") {
			this.opponentDynamite--;
		}

		if (lastRound.p1 !== lastRound.p2) {
			if (this.rules.aBeatsB(lastRound.p1, lastRound.p2)) {
				this.roundsWon++;
			} else {
				this.roundsLost++;
			}

			this.pointsAvailable = 1;
		} else {
			this.pointsAvailable++;
		}

		this.roundsPlayed++;
	}

	getNumRounds() {
		return this.rounds.length;
	}

	getLastRound() {
		if (this.rounds.length === 0) {
			throw "No rounds have been played yet";
		}

		return this.rounds[this.rounds.length - 1];
	}
}
