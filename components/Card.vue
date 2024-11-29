<script setup lang="ts">
import { ref } from 'vue';

const container = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);

</script>

<template>
	<div ref="container" class="container">
		<div ref="target" class="overlay">
			<p text-black>Hi</p>
		</div>
	</div>
</template>

<style scoped>
.container {
	@apply: flex relative border border-style-dashed border-amber rounded-md items-center justify-center overflow-hidden;
	height: 10rem;
	transform: all 0.2s ease-in-out;
}
.overlay {
	@apply: absolute rounded-md bg-white w-full h-full flex top-0 left-0 items-center justify-center; 
}
</style>