<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { Card, useGameStore } from '../stores/game';
const { gameRunning } = storeToRefs(useGameStore());

const { card, isFlipped } = defineProps({
	card: {
		type: Card,
		required: true,
	},
	isFlipped: {
		type: Function,
		required: true,
	},
	gameLevel: {
		type: Number,
		required: true,
	},
})
</script>

<template>
	<Transition name="flip">
		<div v-if="isFlipped(card)" :class="[gameRunning ? 'cursor-pointer' : 'cursor-not-allowed']"
			class="text-8xl flex justify-center items-center border card-front">
			{{
				card.card }}</div>
		<div v-else :class="[gameRunning ? 'cursor-pointer' : 'cursor-not-allowed']"
			class="text-8xl flex justify-center items-center border card-back"></div>
	</Transition>
</template>

<style scoped>
.card-front,
.card-back {
	position: relative;
	will-change: transform;
	border: 1px solid gray;
	border-radius: 5px;
	box-shadow: 1px 1px 3px gray, 3px 3px 9px gray;
	flex: 1;
}

.card-back {
	background-image: url('../assets/cardback.png');
	background-size: contain;
	background-repeat: no-repeat;
}

.flip-enter-active,
.flip-leave-active {
	transition: all 0.4s ease;
}

.flip-leave-active {
	display: none;
}


.flip-enter-from,
.flip-leave-to {
	transform: rotateY(180deg);
	opacity: 0;
}

.card-back,
.card-front {
	@apply min-h-28 min-w-28;
	@apply max-h-28 max-w-28;
}

@media screen and (max-width: 800px) {

	.card-back,
	.card-front {
		@apply min-h-16 min-w-16;
	}

	.card-front {
		@apply text-5xl;
	}
}
</style>