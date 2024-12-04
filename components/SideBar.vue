<script setup lang="ts">
import { TransitionPresets } from '@vueuse/core';

const StartPositon = -20;
// TODO: Change open to store
const { open } = defineProps({ open: Boolean })
const emit = defineEmits(['onClick'])
const source = ref(StartPositon);

watch(() => open, (value) => {
	source.value = !value ? StartPositon : 0;
})


const handleClick = () => {
	source.value = source.value === StartPositon ? 0 : StartPositon;
	emit('onClick')
}

const output = useTransition(source, {
	duration: 300,
	transition: TransitionPresets.easeInOutCubic,
})

</script>

<template>
	<div v-if="source === 0" class="backdrop" @click="handleClick"></div>
	<div class="container" :style="{ left: `${output}rem` }">
		<div p-4 flex="~ justify-between items-start">
			<div flex="~ justify-between items-center" gap-3>
				<img src="../assets/logo.png" w-20 h-20 />
				<div font-700 font-semibold text-2xl tracking-wider>Vocard</div>
			</div>
			<button i-material-symbols-close-rounded m-2 text-2xl @click="handleClick" />
		</div>
		<div mt-4 px-4 w-full>
			<div flex items-center gap-2 bg-gray-8 p-3 rounded-md>
				<div i-material-symbols-add-rounded light:text-white />
				<span text-sm tracking-wider text-gray-2>
					New vocabulary
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.container {
	@apply: w-xs h-screen dark:bg-dark bg-white absolute left-0 top-0 z-10 shadow-2xl;
	transform: all 0.2s ease-in-out;
}

.backdrop {
	@apply: absolute top-0 left-0 w-screen h-screen backdrop-blur-sm bg-white/10 z-1;
	opacity: 0.9;
}
</style>