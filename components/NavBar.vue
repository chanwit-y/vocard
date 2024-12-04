<script setup lang="ts">
import SideBar from '~/components/SideBar.vue';

// TODO: Change open to store
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
	<nav flex justify-between p-4>
		<button w-8 h-8 i-material-symbols-menu-rounded @click="handleOpen"></button>
		<div :class="colorMode.preference === 'dark' ? 'i-material-symbols-light-mode-outline' : 'i-material-symbols-dark-mode-outline-rounded'" @click="handleTheme" w-8 h-8 ></div>
	</nav>
</template>

<style scoped>
</style>