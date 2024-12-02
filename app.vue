<script setup lang="ts">
import '@unocss/reset/tailwind.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<style>
* {
  @apply: font-sans;
}

.dark {
  color-scheme: dark;
}
</style>