<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useGameStore, type Card } from './stores/game';
const { cards, gameRunning, cardCount } = storeToRefs(useGameStore());
const { startGame, updateCards } = useGameStore();

const currentCardCount = ref(cardCount);
const turnedCard = ref<Card | null>(null);
const waitShowingCardFlip = ref(false);

const startNewGame = () => {
  startGame(currentCardCount.value);
}

const gridSize = computed(() => {
  switch (cardCount.value) {
    case 6:
      return 'grid-rows-2 grid-cols-3';
    case 9:
      return 'grid-rows-3 grid-cols-6';
    case 12:
      return 'grid-rows-4 grid-cols-6';
    case 15:
      return 'grid-rows-5 grid-cols-6';
  }
});

const flipCard = (card: Card) => {
  if (card.matched || turnedCard.value?.id === card.id) return;
  if (!turnedCard.value) {
    turnedCard.value = card;
  }
  else if (turnedCard.value?.card === card.card) {
    updateCards(turnedCard.value.card);
  }
}
</script>

<template>
  <header>
    <h1 class="w-full text-center">Hello</h1>
  </header>
  <main>
    <div>
      <h2>Lets play a game of Memory!</h2>
      <div>
        <select class="select" v-model="currentCardCount" @change="startNewGame">
          <option v-for="count in [6, 9, 12, 15]" :value="count">{{ count }}</option>
        </select>
        <button class="btn btn-blue" @click="startNewGame">Start Game</button>
      </div>
    </div>
    <div v-if="gameRunning" class="grid gap-4" :class="gridSize">
      <div v-for="card in cards" :key="card.id" @click="flipCard(card)" :class="card.matched ? 'blue' : 'card'">
        <div class="h-36 w-36 text-8xl flex justify-center items-center border">{{ card.card }}</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.btn {
  @apply font-bold py-2 px-4 rounded;
}

.btn-blue {
  @apply bg-blue-500 text-white;
}

.btn-blue:hover {
  @apply bg-blue-700;
}

select {
  margin: 15px;
  width: 150px;
  padding: 5px 35px 5px 5px;
  font-size: 16px;
  border: 1px solid #CCC;
  height: 34px;
  /* text-align: right; */
  @apply appearance-none;
}

select::after {
  content: "";
  width: 0.8em;
  height: 0.5em;
  background-color: #bc2424;
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}
</style>
