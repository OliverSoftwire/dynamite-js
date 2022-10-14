const moves = ["P", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"];
let rounds = 0;

class Bot {
	makeMove(gamestate) {
		return moves[rounds++ % moves.length];
	}
}

module.exports = new Bot();
