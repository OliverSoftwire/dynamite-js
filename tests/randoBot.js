class Bot {
	makeMove(gamestate) {
		const choices = ["R", "P", "S"];
		const choice = Math.floor(Math.random() * 3);

		return choices[choice];
	}
}

module.exports = new Bot();
