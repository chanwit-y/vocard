<script setup lang="ts">
import Card from '../components/Card.vue';
</script>

<template>
	<div h-screen p-4 grid="~ grid content-around cols-[1fr] rows-[1fr_1fr]">
		<nav flex justify-between>
			<div w-8 h-8 i-material-symbols-menu-rounded></div>
			<!-- i-material-symbols-dark-mode-outline-rounded -->
			<div w-8 h-8 i-material-symbols-light-mode-outline></div>
		</nav>
		<Card mb-8 self-end />
	</div>
</template>
