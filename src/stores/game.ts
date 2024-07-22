import { defineStore } from "pinia";
import { v4 } from "uuid";

const cards = ['🎃', '🔥', '🚗', '🚐', '👺', '👻', '😹', '💀', '💋', '🫀', '🧚‍♀️', '🧟', '👯', '🧵', '🐶', '🦢', "🌵", "🍀", "🌼", "🌎"];

export class Card {
	id: string;
	card: string;
	matched: boolean;
	constructor(vals: { card: string, matched: boolean }) {
		this.id = v4();
		this.card = vals.card;
		this.matched = vals.matched;
	}
}

export const GameLevel = {
	Easy: 6,
	Medium: 9,
	Hard: 12,
	Extreme: 15
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
		gameLevel: GameLevel.Easy,
		cards: randomizeCards(GameLevel.Easy).map(card => new Card({ card, matched: false })),
		moves: 0
	}),
	actions: {
		startGame(gameLevel: number, restart = true) {
			this.gameRunning = restart;
			this.gameOver = false;
			this.didWin = false;
			this.gameLevel = gameLevel;
			this.cards = randomizeCards(gameLevel).map(card => new Card({ card, matched: false }));
			this.moves = gameLevel + 2;
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
			if (this.cards.every((card: Card) => card.matched)) {
				setTimeout(() => {
					this.wonGame();
				}, 1000);
			}
		},
		updateMoves() {
			this.moves--;
			if (this.moves === 0) {
				this.endGame();
			}
		}
	}
});
