<script setup lang="ts">
import { ref } from 'vue';


const container = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const left = ref('0');
const opacity = ref<number>(1);
const background = ref<string>('white');

const containerWidth = computed(() => container.value?.offsetWidth)

const reset = () => {
	left.value = '0';
	opacity.value = 1;
	background.value = 'white';
}

const handleSwipe = (e: TouchEvent) => {
	if (containerWidth.value) {
		const len = Math.abs(lengthX.value)

		if (lengthX.value < 0) {
			left.value = `${len}px`;
			background.value = 'palegreen';
			opacity.value = 1 - (len / containerWidth.value);

		} else if (lengthX.value > 0) {
			left.value = `-${len}px`;
			background.value = 'tomato';
			opacity.value = 1 - (len / containerWidth.value);
		} else {
			left.value = '0';
			opacity.value = 1;
			background.value = 'white';
		}
	}
}

const handleSwipeEnd = (e: TouchEvent) => {
	if (lengthX.value < 0 && containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) > 0.5) {
		left.value = `${containerWidth.value}px`;
		background.value = 'palegreen';
		opacity.value = 0;
	} else if (lengthX.value > 0 && containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) > 0.5) {
		left.value = `-${containerWidth.value}px`;
		background.value = 'tomato';
		opacity.value = 0;
	} else reset();

	setTimeout(() => {
		reset();
	}, 300);
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
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

.container {
	@apply: flex relative border border-style-dashed border-amber rounded-lg items-center justify-center overflow-hidden;
	height: 10rem;
	transform: all 0.2s ease-in-out;
}

.overlay {
	@apply: absolute rounded-lg bg-white w-full h-full flex top-0 left-0 items-center justify-center;
}

.overlay>p {
	@apply: text-black text-4xl tracking-wider uppercase font-400;
}

.overlay.animated {
	transition: all 0.2s ease-in-out;
}
</style>