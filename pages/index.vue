<script setup lang="ts">
const { x, y } = useMouse()
const c = useColorMode();

</script>

<template>
	<div>
		<p >Hi</p>
	</div>
	<div>

		<p>Welcome to my Nuxt app!</p>
		<p>{{ x }}, {{ y }}</p>
	</div>
</template>