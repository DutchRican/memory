<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { GameLevel, useGameStore, type Card } from './stores/game';
const { cards, gameRunning, gameLevel, moves, gameOver } = storeToRefs(useGameStore());
const { startGame, updateCards, updateMoves } = useGameStore();

const turnedCard = ref<Card | null>(null);
const waitShowingCardFlip = ref(false);

const startNewGame = () => {
  startGame(gameLevel.value);
  turnedCard.value = null;
}

const isFlipped = (card: Card) => {
  return card.matched || card.id === turnedCard.value?.id;
};

const gridSize = computed(() => {
  switch (gameLevel.value) {
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

const buttonText = computed(() => {
  if (gameOver.value) return 'New Game';
  if (gameRunning.value) return 'Restart';
  return 'Start Game';
});

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
    setTimeout(() => {
      waitShowingCardFlip.value = false;
      card.matched = false;
      turnedCard.value = null;
    }, 1000);
  }
}
</script>
<template>
  <header>
    <h1 class="w-full text-center">Memory</h1>
  </header>
  <main>
    <div>
      <h2>Lets play a game of Memory!</h2>
      <div>
        <select class="select" v-model="gameLevel" @change="startNewGame">
          <option v-for="[key, val] in Object.entries(GameLevel)" :value="val">{{ key }}</option>
        </select>
        <button class="btn btn-blue" @click="startNewGame">{{ buttonText }}</button>
      </div>
      <p>moves left: {{ gameOver ? 0 : moves || gameLevel }}</p>
    </div>
    <dialog :open="gameOver">You lost!!!</dialog>
    <div class="grid gap-4" :class="gridSize">
      <div v-for="card in cards" :key="card.id" @click="flipCard(card)"
        :class="card.matched || turnedCard?.id === card.id ? 'blue' : 'card'">
        <Transition name="flip">
          <div v-if="isFlipped(card)" class="h-36 w-36 text-8xl flex justify-center items-center border card-front">{{
            card.card }}</div>
          <div v-else class="h-36 w-36 text-8xl flex justify-center items-center border card-back"></div>
        </Transition>
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

.card-front,
.card-back {
  position: relative;
  will-change: transform;
}

.card-back {
  background: linear-gradient(135deg, #71b7e6ba, #9c59b674);
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
