<script setup lang="ts">
import { ref } from 'vue';

const container = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);

</script>

<template>
	<div ref="container" class="container">
		<div ref="target">
			<p>Hi</p>
		</div>
	</div>
</template>

<style>
.container {
	@apply: flex relative border border-style-dashed border-amber rounded-md items-center justify-center overflow-hidden;
	transform: all 0.2s ease-in-out;
}
</style>