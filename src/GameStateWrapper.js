import { ROUNDS_NEEDED_TO_WIN, ROUNDS_LIMIT, DYNAMITE_LIMIT } from "./constants";
import { PredictionWindow } from "./PredictionWindow";

export class GameStateWrapper {
	constructor(rules) {
		this.dynamite = DYNAMITE_LIMIT;
		this.opponentDynamite = DYNAMITE_LIMIT;

		this.rounds = [];
		this.lastRound = undefined;

		this.roundsWon = 0;
		this.roundsLost = 0;
		this.roundsPlayed = 0;

		this.pointsAvailable = 1;

		this.rules = rules;

		this.predictionWindows = [];
	}

	getNumRounds() {
		return this.rounds.length;
	}

	getLastRound() {
		if (this.lastRound === undefined) {
			throw "No rounds have been played yet";
		}

		return this.lastRound;
	}

	newPredictionWindow(maxRounds = 8) {
		const window = new PredictionWindow(maxRounds);
		this.predictionWindows.push(window);
		return window;
	}

	updatePredictionWindows() {
		this.predictionWindows.forEach(window => window.update(this.rounds));
	}

	updateDynamite() {
		if (this.lastRound.p1 === "D") {
			this.dynamite--;
		}

		if (this.lastRound.p2 === "D") {
			this.opponentDynamite--;
		}
	}

	updateResults() {
		if (this.lastRound.p1 !== this.lastRound.p2) {
			if (this.rules.aBeatsB(this.lastRound.p1, this.lastRound.p2)) {
				this.roundsWon++;
			} else {
				this.roundsLost++;
			}

			this.pointsAvailable = 1;
		} else {
			this.pointsAvailable++;
		}
	}

	processRounds(rounds) {
		if (rounds.length === 0) {
			return;
		}

		this.rounds = rounds;
		this.lastRound = rounds[rounds.length - 1];
		
		this.updateDynamite();
		this.updateResults();
		this.updatePredictionWindows();

		this.roundsPlayed++;
	}
}
