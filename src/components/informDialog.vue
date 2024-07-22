<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useGameStore } from '../stores/game';
const { score, didWin, gameOver, gameRunning } = storeToRefs(useGameStore());
const dialog = ref<HTMLDialogElement | null>(null);

const message = computed(() => {
	if (didWin.value) {
		return 'Congratulations, you won!';
	} else {
		return 'Sorry, you lost!';
	}
});

watch(gameRunning, () => {
	if (gameOver.value || didWin.value) {
		if (dialog.value) {
			dialog.value?.showModal();
		}
	}
});

</script>
<template>
	<dialog ref="dialog">
		<form class="w-96 h-96 flex flex-col justify-between items-center py-3">
			<h2 class="text-xl">{{ message }}</h2>
			<p>Your final score was: {{ score }}</p>
			<div class="flex w-full justify-end px-3"><button class="btn btn-blue">Close</button></div>
		</form>
	</dialog>
</template>
<style scoped>
dialog::backdrop {
	background-color: transparent 0.5;
}
</style>