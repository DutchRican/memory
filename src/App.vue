<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import InfoDialog from './components/InfoDialog.vue';
import MemoryCard from './components/memoryCard.vue';
import { GameLevel, useGameStore, type Card } from './stores/game';
const { cards, gameRunning, gameLevel, moves, gameOver, didWin } = storeToRefs(useGameStore());
const { startGame, updateCards, updateMoves } = useGameStore();

const turnedCard = ref<Card | null>(null);
const waitShowingCardFlip = ref(false);


const startNewGame = (restart: boolean) => {
  startGame(gameLevel.value, restart);
  turnedCard.value = null;
}

const isFlipped = (card: Card) => {
  return card.matched || card.id === turnedCard.value?.id;
};

const gridSize = computed(() => {
  switch (gameLevel.value) {
    case 6:
      return 'grid easyGrid';
    case 9:
      return 'grid mediumGrid';
    case 12:
      return 'grid hardGrid';
    case 15:
      return 'grid extremeGrid';
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
  <header class="w-full h-16 bg-[#ead3b1] content-center">
    <h1 class="w-full text-center text-4xl text-blue-800">Memory</h1>
  </header>
  <main class="flex flex-col max-h-[80dvh]">
    <div>
      <div class="flex justify-between items-center px-5">
        <div>
          <label for="game-level" class="pr-2">Game Level</label>
          <select class="select" name="game-level" v-model="gameLevel" @change="startNewGame(false)">
            <option v-for="[key, val] in Object.entries(GameLevel)" :value="val">{{ key }}</option>
          </select>
        </div>
        <button class="btn btn-blue" @click="startNewGame(true)">{{ buttonText }}</button>
      </div>
      <p class="text-center" v-if="gameRunning">moves left: {{ gameOver ? 0 : moves || gameLevel }}</p>
      <p class="text-center" v-else>Please start a new game</p>
    </div>
    <info-dialog />
    <div class="flex justify-center items-center h-[80dvh]">
      <div class="pt-4 self-center">
        <div :class="gridSize">
          <div v-for="card in cards" :key="card.id" @click="flipCard(card)" class="flex justify-center">
            <memory-Card :card="card" :is-flipped="isFlipped" :game-level="gameLevel" />
          </div>
        </div>
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

.grid {
  gap: 4px;
  width: fit-content;
}

.easyGrid {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.mediumGrid {
  /* width: 800px; */
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
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
    gap: 6px;
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
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: repeat(3, 1fr);
  }

  .hardGrid {
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
