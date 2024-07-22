<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import CardGrid from './components/cardGrid.vue';
import informDialog from './components/informDialog.vue';
import { GameLevel, useGameStore } from './stores/game';
const { gameRunning, gameLevel, moves, gameOver, score } = storeToRefs(useGameStore());
const { startGame, } = useGameStore();


const startNewGame = (restart: boolean) => {
  startGame(gameLevel.value, restart);
}

const buttonText = computed(() => {
  if (gameOver.value) return 'New Game';
  if (gameRunning.value) return 'Restart';
  return 'Start Game';
});

</script>
<template>
  <header class="w-full h-16 bg-[#ead3b1] mb-2 flex justify-center items-center">
    <p class="flex-1 min-w-44"></p>
    <h1 class="w-full text-center text-4xl text-blue-800 flex-2">Memory</h1>
    <p class="flex-1 pr-5 min-w-44">{{ gameRunning ? `current score: ${score}` : '' }}</p>
  </header>
  <main class="flex flex-col max-h-[80dvh]">
    <div>
      <div class="flex justify-between items-center px-5">
        <div>
          <label class="pr-2">Game Level
            <select class="select" v-model="gameLevel" @change="startNewGame(false)">
              <option v-for="[key, val] in Object.entries(GameLevel)" :value="val">{{ key }}</option>
            </select>
          </label>
        </div>
        <button class="btn btn-blue" @click="startNewGame(true)">{{ buttonText }}</button>
      </div>
    </div>
    <inform-dialog />
    <div class="flex justify-center items-center h-[80dvh] flex-col">
      <p class="text-center" v-if="gameRunning">moves left: {{ gameOver ? 0 : moves || gameLevel }}</p>
      <p class="text-center" v-else>Please start a new game</p>
      <div class="pt-4 self-center">
        <card-grid />
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
