<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Card, useGameStore } from '../stores/game';
import memoryCard from './memoryCard.vue';
const { cards, gameLevel, gameRunning } = storeToRefs(useGameStore());
const { updateCards, updateMoves } = useGameStore();

const turnedCard = ref<Card | null>(null);
const waitShowingCardFlip = ref(false);

const gridSize = computed(() => {
	switch (gameLevel.value) {
		case 6:
			return 'grid easyGrid';
		case 10:
			return 'grid mediumGrid';
		case 12:
			return 'grid hardGrid';
		case 15:
			return 'grid extremeGrid';
	}
});

watch(gameRunning, (isRunning) => {
	if (!isRunning) turnedCard.value = null;
});

const isFlipped = (card: Card) => {
	return card.matched || card.id === turnedCard.value?.id;
};

const flipCard = (card: Card) => {
	if (card.matched || turnedCard.value?.id === card.id || waitShowingCardFlip.value || !gameRunning.value) return;
	if (!turnedCard.value) {
		turnedCard.value = card;
	}
	else if (turnedCard.value?.card === card.card) {
		updateCards(turnedCard.value.card);
		turnedCard.value = null;
	}
	else {
		updateMoves();
		waitShowingCardFlip.value = true;
		card.matched = true;
		if (gameRunning.value) {
			setTimeout(() => {
				waitShowingCardFlip.value = false;
				card.matched = false;
				turnedCard.value = null;
			}, 1000);
		}
	}
}
</script>

<template>
	<div :class="gridSize">
		<div v-for="card in cards" :key="card.id" @click="flipCard(card)" class="flex justify-center">
			<memory-Card :card="card" :is-flipped="isFlipped" :game-level="gameLevel" />
		</div>
	</div>
</template>
<style>
.grid {
	gap: 8px;
	width: fit-content;
}

.easyGrid {
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, 1fr);
}

.mediumGrid {
	/* width: 800px; */
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(5, 1fr);
}

.hardGrid {
	/* width: 800px; */
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(4, 1fr);
}

.extremeGrid {
	/* width: 900px; */

	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(5, 1fr);
}


@media screen and (max-width: 800px) {
	.select {
		width: 110px;
		margin: 5px;
	}

	.grid {
		gap: 10px;
	}

	.easyGrid,
	.mediumGrid,
	.hardGrid,
	.extremeGrid {
		width: auto;
		height: auto;
	}

	.extremeGrid {
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(6, 1fr);
	}

	.mediumGrid {
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
	}

	.hardGrid {
		grid-template-rows: repeat(6, 1fr);
		grid-template-columns: repeat(4, 1fr);
	}
}
</style>