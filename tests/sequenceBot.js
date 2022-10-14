const fs = require("fs");
const matchData = fs.readFileSync("download.json");

const rounds = JSON.parse(matchData).moves;
let round = 0;

class Bot {
	makeMove(gamestate) {
		return rounds[round++ % rounds.length].p2;
	}
}

module.exports = new Bot();
