<script setup lang="ts">
import SideBar from '~/components/SideBar.vue';

const o = ref(false);

const handleOpen = () => {
	o.value = !o.value;
}

</script>

<template>
	<SideBar :open="o" v-on:on-click="handleOpen" />
	<nav flex justify-between p-4>
		<button w-8 h-8 i-material-symbols-menu-rounded @click="handleOpen"></button>
		<!-- i-material-symbols-dark-mode-outline-rounded -->
		<div w-8 h-8 i-material-symbols-light-mode-outline></div>
	</nav>
</template>