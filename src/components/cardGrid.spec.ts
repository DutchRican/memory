import { shallowMount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { GameLevel, useGameStore } from "../stores/game";
import CardGrid from "./cardGrid.vue";

describe("CardGrid.vue", () => {
	const pinia = createPinia();
	const gameStore = useGameStore(pinia);
	it("renders an easy grid of cards", () => {
		gameStore.startGame(GameLevel.Easy);
		const wrapper = shallowMount(CardGrid, { pinia });
		expect(wrapper.find('.grid.easyGrid').exists()).toBe(true);
		expect(wrapper.findAll('memory-card-stub').length).toBe(GameLevel.Easy * 2);
	});
	it("renders a medium grid of cards", () => {
		gameStore.startGame(GameLevel.Medium);
		const wrapper = shallowMount(CardGrid, { pinia });
		expect(wrapper.find('.grid.mediumGrid').exists()).toBe(true);
		expect(wrapper.findAll('memory-card-stub').length).toBe(GameLevel.Medium * 2);
	});
	it("renders a hard grid of cards", () => {
		gameStore.startGame(GameLevel.Hard);
		const wrapper = shallowMount(CardGrid, { pinia });
		expect(wrapper.find('.grid.hardGrid').exists()).toBe(true);
		expect(wrapper.findAll('memory-card-stub').length).toBe(GameLevel.Hard * 2);
	});
	it("renders an extreme grid of cards", () => {
		gameStore.startGame(GameLevel.Extreme);
		const wrapper = shallowMount(CardGrid, { pinia });
		expect(wrapper.find('.grid.extremeGrid').exists()).toBe(true);
		expect(wrapper.findAll('memory-card-stub').length).toBe(GameLevel.Extreme * 2);
	});

	it('handles a click on a card', async () => {
		gameStore.startGame(GameLevel.Easy);
		const wrapper = shallowMount(CardGrid, { pinia });
		await wrapper.findAll('memory-card-stub')[0].trigger('click');
		expect(gameStore.moves).toBe(GameLevel.Easy + 2);
		// @ts-expect-error vm is not aware of turnedCard nor its type
		expect(wrapper.vm.turnedCard.id).toBe(gameStore.cards[0].id);
	});
});