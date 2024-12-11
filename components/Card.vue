<script setup lang="ts">
import { TransitionPresets } from '@vueuse/core';
import { ref } from 'vue';
import type { WordEntry } from '~/@types';

const dark = "#1f2937";
// const dark = "#222222";

const container = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const left = ref('0');
const opacity = ref<number>(1);
const background = ref<string>(dark);

const containerWidth = computed(() => container.value?.offsetWidth)

const currentIndex = ref(0);
const words = ref<WordEntry[]>([]);

const { data } = await useFetch<{ vocabularies: WordEntry[] }>('/api/vocabulary')

watch(() => data.value, (value) => {
	words.value = value?.vocabularies || [];
})

const reset = () => {
	left.value = '0';
	opacity.value = 1;
	background.value = dark;
}

const handlePlay = () => {
	if (words.value[currentIndex.value]) {
		new Audio((words.value as WordEntry[])[currentIndex.value].speech_url).play();
	}
}

const handleSwipe = (_: TouchEvent) => {
	if (containerWidth.value) {
		const len = Math.abs(lengthX.value)

		if (lengthX.value < 0) {
			left.value = `${len}px`;
			background.value = Colors.green;
			opacity.value = 1 - (len / containerWidth.value);

		} else if (lengthX.value > 0) {
			left.value = `-${len}px`;
			background.value = Colors.red;
			opacity.value = 1 - (len / containerWidth.value);
		} else {
			left.value = '0';
			opacity.value = 1;
			background.value = dark;
		}
	}
}

const handleSwipeEnd = (_: TouchEvent) => {
	if (lengthX.value < 0 && containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) > 0.5) {
		left.value = `${containerWidth.value}px`;
		background.value = Colors.green;
		opacity.value = 0;
	} else if (lengthX.value > 0 && containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) > 0.5) {
		left.value = `-${containerWidth.value}px`;
		background.value = Colors.red;
		opacity.value = 0;
	} else reset();

	setTimeout(() => {
		currentIndex.value += 1;
		reset();
	}, 500);
}

const { isSwiping, lengthX } = useSwipe(target, {
	passive: false,
	onSwipe: handleSwipe,
	onSwipeEnd: handleSwipeEnd
});

const size = ref(10);
const resize = useTransition(size, {
	duration: 300,
	transition: TransitionPresets.easeInOutCubic,
})

const handleSize = () => {
	size.value = size.value === 10 ? 30 : 10;
}


</script>

<template>
	<div ref="container" class="container" :style="{ height: `${resize}rem` }">
		<div ref="target" class="overlay" :class="{ animated: !isSwiping, overlaycenter: size === 10 }"
			:style="{ left, opacity, background }">
			<Transition name="word">
				<p v-if="words.length > 0 && size === 10">{{ words[currentIndex].word }}</p>
			</Transition>
			<Transition name="detail">
				<div v-if="words.length > 0 && size !== 10" class="absolute top-4 left-4">
					<div class="flex items-center">
						<p class="text-white text-2xl tracking-wider uppercase font-400">{{
							words[currentIndex].word }}</p>
						<span v-for="type in words[currentIndex].types" class="mx-1 border p-1 rounded-md">{{ type }}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="i-tabler-arrow-badge-right-filled text-white" />
						<p class="text-white text-lg tracking-wider uppercase font-400">{{
							words[currentIndex].english }}</p>
					</div>
					<div class="flex items-center gap-2">
						<span class="i-tabler-arrow-badge-right-filled text-white" />
						<p class="text-white text-lg tracking-wider uppercase font-400">{{
							words[currentIndex].thai }}</p>
					</div>
					<hr class="my-4 ml-4 mr-6 opacity-25" />

					<p class="text-white text-lg tracking-wider font-400 mb-2">Example</p>
					<li v-for="example in words[currentIndex].examples" class="pl-2 tracking-wider">
						{{ example }}
					</li>
				</div>
			</Transition>
		</div>

		<div class="menu-box">
			<button @click="handlePlay" class="icon" i-material-symbols-volume-up-rounded />
			<div @click="handleSize" class="icon" i-fluent-text-description-24-filled />
		</div>
	</div>
</template>

<style scoped>
.word-enter-active {
	transition: all 0.3s ease-out;
}
.word-leave-active {
	transform: translateX(-20px);
	opacity: 1;
}
.word-enter-from,
.word-leave-to {
	transform: translateX(20px);
	opacity: 0;
}


.detail-enter-active {
	transition: all 1s ease-out;
}
/* .detail-leave-active {} */
.detail-enter-from,
.detail-leave-to {
	transform: translateX(20px);
	opacity: 0;
}

.container {
	@apply: relative border border-4 border-style-dashed light:border-gray-6 rounded-lg overflow-hidden;
	/* height: 10rem; */
	transform: all 0.2s ease-in-out;
}

.overlay {
	@apply: absolute rounded-lg w-full h-full top-0 left-0 flex items-center justify-center;

}

.overlay>p {
	@apply: text-white text-4xl tracking-wider uppercase font-400;
}

.overlay.animated {
	transition: all 0.2s ease-in-out;
}


.menu-box {
	@apply: flex items-center justify-center gap-4 absolute bottom-4 left-4;
}


.menu-box>.icon {
	@apply: w-6 h-6 bg-white rounded-md;
}
</style>