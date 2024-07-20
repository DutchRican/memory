import { defineStore } from "pinia";
import { v4 } from "uuid";

const cards = ['🎃', '🔥', '🚗', '🚐', '👺', '👻', '😹', '💀', '💋', '🫀', '🧚‍♀️', '🧟', '👯', '🧵', '🐶', '🦢', "🌵", "🍀", "🌼", "🌎"];

export type Card = {
	id: number;
	card: string;
	matched: boolean;
}

const shuffle = (array: string[]): string[] => {
	let currindex = array.length;
	while (currindex != 0) {
		let randomIndex = Math.floor(Math.random() * currindex);
		currindex--;
		[array[currindex], array[randomIndex]] = [array[randomIndex], array[currindex]];
	}
	return array;;
}
const randomizeCards = (cardCount: number): string[] => {
	const playingCards = cards.slice(0, cardCount);
	const shuffledCards = shuffle([...playingCards, ...playingCards]);
	return shuffledCards;
}

export const useGameStore = defineStore('game', {
	state: () => ({
		score: 0,
		highScore: 0,
		gameOver: false,
		didWin: false,
		gameRunning: false,
		cardCount: 6,
		cards: [] as Card[],
	}),
	actions: {
		startGame(cardCount: number) {
			this.gameRunning = true;
			this.gameOver = false;
			this.didWin = false;
			this.cardCount = cardCount;
			this.cards = randomizeCards(cardCount).map(card => ({ card, matched: false, id: v4() }));
			this.score = 0;
		},
		endGame() {
			this.gameRunning = false;
			this.gameOver = true;
			this.didWin = false;
		},
		wonGame() {
			this.gameRunning = false;
			this.gameOver = false;
			this.didWin = true;
		},
		updateCards(cardValue: string) {
			this.cards.forEach((card: Card) => {
				if (card.card === cardValue) {
					card.matched = true;
				}
			});
			this.score++;
		}
	}
});
