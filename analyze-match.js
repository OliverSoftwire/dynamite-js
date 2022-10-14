const fs = require("fs");

const matchDataPath = process.argv[2];
const matchData = fs.readFileSync(matchDataPath);

const rounds = JSON.parse(matchData).moves;

class PlayHistogram {
	constructor() {
		this.bins = {
			R: 0,
			P: 0,
			S: 0,
			D: 0,
			W: 0
		};

		this.totalCount = 0;
	}

	registerPlay(play) {
		this.bins[play]++;
		this.totalCount++;
	}

	getPlayCount(play) {
		return this.bins[play];
	}

	getPlayPercentage(play) {
		return this.bins[play] / this.totalCount;
	}

	getFavouritePlay() {
		return Object.keys(this.bins).reduce((a, b) => this.bins[a] > this.bins[b] ? a : b);
	}
}

const rules = {
	R: ["S"],
	P: ["R"],
	S: ["P"],
	D: ["R", "P", "S"],
	W: ["D"]
};

const wins = {
	R: new PlayHistogram(),
	P: new PlayHistogram(),
	S: new PlayHistogram(),
	D: new PlayHistogram(),
	W: new PlayHistogram()
}

const losses = {
	R: new PlayHistogram(),
	P: new PlayHistogram(),
	S: new PlayHistogram(),
	D: new PlayHistogram(),
	W: new PlayHistogram()
}

let totalWins = 0, totalLosses = 0;
rounds.forEach(round => {
	const { p1, p2 } = round;
	if (p1 === p2) {
		return;
	}

	if (rules[p1].includes(p2)) {
		wins[p2].registerPlay(p1);
		totalWins++;
	} else {
		losses[p2].registerPlay(p1);
		totalLosses++;
	}
});

console.log("Matches we won:");
for (const [opponentPlay, ourPlays] of Object.entries(wins)) {
	console.log(
		`${opponentPlay}: ${ourPlays.totalCount} (${Math.round(ourPlays.totalCount / totalWins * 100)}%), favourite play was ${ourPlays.getFavouritePlay()}`
	);
}

console.log("\nMatches we lost");
for (const [opponentPlay, ourPlays] of Object.entries(losses)) {
	console.log(
		`${opponentPlay}: ${ourPlays.totalCount} (${Math.round(ourPlays.totalCount / totalWins * 100)}%), favourite play was ${ourPlays.getFavouritePlay()}`
	);
}
