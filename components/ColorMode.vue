<template>
  <ClientOnly>
    <UButton
      :icon="
        isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
      "
      color="gray"
      class="fixed right-0 top-0 m-4"
      size="xl"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  },
});
</script>
