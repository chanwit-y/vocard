<script setup lang="ts">
const props = defineProps<{
	title: string
}>()

</script>

<template>
	<div>
		<h1>{{ props.title }}</h1>
		<p>Welcome to my Nuxt app!</p>
		<slot />
	</div>
</template>