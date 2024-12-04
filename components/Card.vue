<script setup lang="ts">
import { ref } from 'vue';

const dark = "#1f2937";
// const dark = "#222222";

const container = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const left = ref('0');
const opacity = ref<number>(1);
const background = ref<string>(dark);

const containerWidth = computed(() => container.value?.offsetWidth)

const reset = () => {
	left.value = '0';
	opacity.value = 1;
	background.value = dark;
}

const handlePlay = () => {
	const audio = new Audio('https://ccysisxnpzqtdmmwacjy.supabase.co/storage/v1/object/public/speech/disappointed.mp3');
	audio.play();
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
		reset();
	}, 500);
}

const { isSwiping, lengthX } = useSwipe(target, {
	passive: false,
	onSwipe: handleSwipe,
	onSwipeEnd: handleSwipeEnd
});

</script>

<template>
	<div ref="container" class="container">
		<div ref="target" class="overlay" :class="{ animated: !isSwiping }"
			:style="{ left, opacity, background }">
			<p>disappointed</p>
		</div>

		<div class="menu-box">
			<button @click="handlePlay" class="open" i-material-symbols-volume-up-rounded />
			<div class="sound" i-fluent-text-description-24-filled />
		</div>
	</div>
</template>

<style scoped>
.container {
	@apply: relative border border-4 border-style-dashed light:border-gray-6 rounded-lg overflow-hidden;
	height: 10rem;
	transform: all 0.2s ease-in-out;
}

.overlay {
	@apply: absolute rounded-lg w-full h-full flex top-0 left-0 items-center justify-center;
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

.menu-box>.sound {
	@apply: w-6 h-6 bg-white rounded-md;
}

.menu-box>.open {
	@apply: w-6 h-6 bg-white rounded-md;
}
</style>