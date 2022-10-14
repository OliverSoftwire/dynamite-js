export class PredictionWindow {
	constructor(maxRounds) {
		this.maxRounds = maxRounds;

		this.bins = {
			R: { count: 0, percentage: 0 },
			P: { count: 0, percentage: 0 },
			S: { count: 0, percentage: 0 },
			D: { count: 0, percentage: 0 },
			W: { count: 0, percentage: 0 }
		};

		this.totalPlays = 0;
	}

	update(rounds) {
		this.bins = {
			R: { count: 0, percentage: 0 },
			P: { count: 0, percentage: 0 },
			S: { count: 0, percentage: 0 },
			D: { count: 0, percentage: 0 },
			W: { count: 0, percentage: 0 }
		};

		this.totalPlays = 0;

		if (rounds.length === 0) {
			return;
		}

		for (let roundOffset = 0; roundOffset < this.maxRounds; roundOffset++) {
			const roundIdx = rounds.length - roundOffset - 1;
			if (roundIdx < 0) {
				break;
			}

			this.bins[rounds[roundIdx].p2].count++;
			this.totalPlays++;
		}

		Object.values(this.bins).forEach(bin => {
			bin.percentage = bin.count / this.totalPlays;
		});
	}

	getNumPlays(play) {
		return this.bins[play];
	}

	getPlayPercentage(play) {
		return this.bins[play].percentage;
	}

	getMostLikelyPlay() {
		return Object.keys(this.bins).reduce((a, b) => this.bins[a].percentage > this.bins[b].percentage ? a : b);
	}

	getMostLikelyPlayPercentage() {
		return Object.values(this.bins).map(bin => bin.percentage).reduce((a, b) => a > b ? a : b);
	}
}
