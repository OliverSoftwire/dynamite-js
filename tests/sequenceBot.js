const moves = ["R", "P", "S", "D", "W"];
let dynamite = 100

class Bot {
	makeMove(gamestate) {
		if (dynamite <= 0) {
			return "R";
		}
		dynamite--;
		return "D";
	}
}

module.exports = new Bot();
