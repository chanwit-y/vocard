<script setup lang="ts">
import { TransitionPresets } from '@vueuse/core';

const { open } = defineProps({ open: Boolean })
const emit = defineEmits(['onClick'])

const source = ref(0);

watch(() => open, (value) => {
	source.value = value ? -20 : 0;
})


const handleClick = () => {
	source.value = source.value === -20 ? 0 : -20;
	emit('onClick')
}

const output = useTransition(source, {
	duration: 300,
	transition: TransitionPresets.easeInOutCubic,
})

</script>

<template>
	<div class="container" :style="{ left: `${output}rem` }">
		<div p-4 flex="~ justify-between items-center">
			<div>Vocard</div>
			<button i-material-symbols-arrow-back-ios-new m-2 text-2xl @click="handleClick" />
		</div>
	</div>
</template>

<style scoped>
.container {
	@apply: w-xs h-screen bg-dark absolute left-0 top-0 z-10 shadow-2xl;
	transform: all 0.2s ease-in-out;
}
</style>