const { exec } = require("child_process");

const ROUNDS_NEEDED_TO_WIN = 1000;
const DYNAMITE_LIMIT = 100;
const ROUNDS_LIMIT = 2500;

class Rules {
	beats = {
		R: ["S"],
		P: ["R"],
		S: ["P"],
		D: ["R", "P", "S"],
		W: ["D"]
	};

	// Note, does not include dynamite to avoid strategies accidentally overusing
	// Strategies that use dynamite need more complex rules to determine when to use
	isBeatenBy = {
		R: ["P"],
		P: ["S"],
		S: ["R"],
		D: ["W"],
		W: ["R", "P", "S"]
	};

	aBeatsB(a, b) {
		return b in this.beats[a];
	}
}

const rules = new Rules();

function randomMove() {
	const choices = ["R", "P", "S"];
	const choice = Math.floor(Math.random() * 3);

	return choices[choice];
}

class GameStateWrapper {
	dynamite = DYNAMITE_LIMIT;
	opponentDynamite = DYNAMITE_LIMIT;

	rounds = [];

	roundsWon = 0;
	roundsLost = 0;
	roundsPlayed = 0;

	toString() {
		return ([
			`=== GameManagerWrapper ===`,
			`Rounds remaining: ${ROUNDS_LIMIT - this.roundsPlayed}`,
			`Min rounds until winner ${this.minRoundsUntilWinner()} | Can be won?: ${this.playerCanWin() ? "yes" : "no"}`,
			"",
			`Player 1: Won ${this.roundsWon}, dynamite ${this.dynamite}`,
			`Player 2: Won ${this.roundsLost}, dynamite ${this.opponentDynamite}`
		]).join("\n");
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
			if (rules.aBeatsB(lastRound.p1, lastRound.p2)) {
				this.roundsWon++;
			} else {
				this.roundsLost++;
			}
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

class Strategy {
	confidence = 0;

	handleState(gameStateWrapper) {
		return;
	}
}

class Predictive extends Strategy {
	bins = {
		R: { count: 0, percentage: 0 },
		P: { count: 0, percentage: 0 },
		S: { count: 0, percentage: 0 },
		D: { count: 0, percentage: 0 },
		W: { count: 0, percentage: 0 }
	}

	handleState(gameStateWrapper) {
		const totalPlays = gameStateWrapper.getNumRounds();
		if (totalPlays === 0) {
			return;
		}

		this.bins[gameStateWrapper.getLastRound().p2].count++;

		Object.values(this.bins).forEach(bin => {
			bin.percentage = bin.count / totalPlays;
		});

		this.confidence = Object.values(this.bins).map(bin => bin.percentage).reduce((a, b) => a > b ? a : b);
	}

	makeMove() {
		if (gameStateWrapper.getNumRounds() === 0) {
			return randomMove();
		}

		let uniformRandom0 = Math.random();
		const uniformRandom1 = Math.random();

		for (const [predictedPlay, playInfo] of Object.entries(this.bins)) {
			if (uniformRandom0 < playInfo.percentage) {
				const isBeatenBy = rules.isBeatenBy[predictedPlay];

				const choice = Math.floor(uniformRandom1 * isBeatenBy.length);
				return isBeatenBy[choice];
			}

			uniformRandom0 -= playInfo.percentage;
		}
	}
}

class Offensive extends Strategy {
	handleState(gameStateWrapper) {
		this.confidence = gameStateWrapper.dynamite > 0 ? gameStateWrapper.dynamite / gameStateWrapper.minRoundsUntilWinner() : 0;
	}

	makeMove() {
		return "D";
	}
}

class Defensive extends Strategy {
}

const gameStateWrapper = new GameStateWrapper();

const strategies = [
	new Predictive(),
	new Offensive()
];

class Bot {
    makeMove(gamestate) {
		gameStateWrapper.processRounds(gamestate.rounds);

		let totalConfidence = 0;
		let move = undefined; // Fallback move

		strategies.forEach(strategy => {
			strategy.handleState(gameStateWrapper);
			totalConfidence += strategy.confidence;
		});

		if (totalConfidence === 0) { // Need epsilon here? does js approximately equate floats?
			move = randomMove();
		} else {
			let strategyProbability = Math.random();
			for (const strategy of strategies) {
				const renormalisedConfidence = strategy.confidence / totalConfidence;

				if (strategyProbability < renormalisedConfidence) {
					move = strategy.makeMove();
					break;
				}
				
				strategyProbability -= renormalisedConfidence;
			}
		}

		if (move === undefined) {
			throw "Missed all strategies, totalConfidence === 0 check didn't work";
		}

		if (move === "D" && gameStateWrapper.dynamite <= 0) {
			throw "Tried to use too much dynamite";
		}

		return move;
    }
}

module.exports = new Bot();

function test(botName, numGames, passmark) {
	const command = `node ./dynamite-cli.js ./RNDBot.js ./${botName}.js`;
	const winnerAndScoresPattern = /Winner: (p[12])\s+Score: (\d+) - (\d+)/g;

	let wins = 0;
	for (let i = 0; i < numGames; i++) {
		exec(command, (error, stdout, stderr) => {
			if (error || stderr) {
				return;
			}

			const match = stdout.match(winnerAndScoresPattern);

		})
	}
}

function runTests() {
	// Test against rockBot (should prioritise prediction)

	// Test against randoBot (should prioritise offensive)

	// Test against offensiveBot (should prioritise defensive)

	// Test against defensiveBot (should prioritise random)

	// Test against predictiveBot (should appear random)
}

if (require.name === module) {
	runTests();
}

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
