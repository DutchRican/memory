import { shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import { GameLevel, useGameStore } from '../stores/game';
import MemoryCard from './memoryCard.vue';

describe('MemoryCard.vue', () => {
	const pinia = createPinia();
	const gameStore = useGameStore(pinia);
	it('renders a card with the back of the card', () => {

		const wrapper = shallowMount(MemoryCard, { pinia, props: { isFlipped: () => false, gameLevel: GameLevel.Easy, card: { id: '1232', card: '😂', matched: false } } });
		expect(wrapper.find('.card-back').exists()).toBe(true);
	});

	it('renders a card with the front of the card', () => {
		const wrapper = shallowMount(MemoryCard, { pinia, props: { isFlipped: () => true, gameLevel: GameLevel.Easy, card: { id: '1232', card: '😂', matched: false } } });
		expect(wrapper.find('.card-front').exists()).toBe(true);
	});
});