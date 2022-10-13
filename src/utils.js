export function randomBasicMove() {
	const choices = ["R", "P", "S"];
	const choice = Math.floor(Math.random() * 3);

	return choices[choice];
}
