<template :class="$colorMode.value">
  <div
    class="min-h-screen text-gray-950 transition duration-300 ease-in-out dark:bg-gray-950 dark:text-white"
  >
    <slot />
  </div>
</template>
