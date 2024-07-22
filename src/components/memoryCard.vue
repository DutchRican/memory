<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { Card, GameLevel, useGameStore } from '../stores/game';
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
		<div v-if="isFlipped(card)"
			:class="[gameLevel === GameLevel.Extreme ? 'w-24 h-24' : 'h-32 w-32', gameRunning ? 'cursor-pointer' : 'cursor-not-allowed']"
			class="text-8xl flex justify-center items-center border card-front">
			{{
				card.card }}</div>
		<div v-else
			:class="[gameLevel === GameLevel.Extreme ? 'w-24 h-24' : 'h-32 w-32', gameRunning ? 'cursor-pointer' : 'cursor-not-allowed']"
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
</style>