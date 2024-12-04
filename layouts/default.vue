<script setup lang="ts">
import NavBar from '~/components/NavBar.vue';

const { width, height } = useWindowSize()
</script>

<template>
	<div v-if="width <= 430" h-screen  grid="~ grid content-around cols-[1fr] rows-[1fr_1fr]">
		<NavBar />
		<slot />
	</div>
	<div v-if="width > 430" h-screen flex justify-center items-center >
		<span tracking-wider text-gray-400>This app support just mobile screen only~😵‍💫</span>
	</div>
</template>