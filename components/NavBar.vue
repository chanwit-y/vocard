<script setup lang="ts">
import SideBar from '~/components/SideBar.vue';

const o = ref(false);
const colorMode = useColorMode();

const handleOpen = () => {
	o.value = !o.value;
}

const handleTheme = () => {
	colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
}

</script>

<template>
	<SideBar :open="o" v-on:on-click="handleOpen" />
	<div v-if="!o" class="backdrop" @click="handleOpen"></div>
	<nav flex justify-between p-4>
		<!-- <button w-8 h-8 i-material-symbols-menu-rounded @click="handleOpen"></button> -->
		<button w-8 h-8 i-material-symbols-menu-rounded @click="handleOpen"></button>
		<!-- i-material-symbols-dark-mode-outline-rounded -->
		<div @click="handleTheme" w-8 h-8 i-material-symbols-light-mode-outline></div>
	</nav>
</template>

<style scoped>
.backdrop {
	@apply: absolute top-0 left-0 w-screen h-screen backdrop-blur-sm bg-white/10 z-1;
	opacity: 0.9;
}
</style>