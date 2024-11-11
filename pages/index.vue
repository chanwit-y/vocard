<script setup lang="ts">
const { x, y } = useMouse()

</script>

<template>
	<div>
		<p>Welcome to my Nuxt app!</p>
		<p>{{ x }}, {{ y }}</p>
	</div>
</template>