<script setup lang="ts">
import Card from './Card.vue';
import Skeleton from './Skeleton.vue';

withDefaults(
  defineProps<{
    items?: number;
    variant?: 'reservation' | 'room';
  }>(),
  {
    items: 6,
    variant: 'room',
  },
);
</script>

<template>
  <section
    aria-busy="true"
    aria-label="Carregando dados"
    class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
  >
    <Card v-for="item in items" :key="item" padding="lg">
      <div class="flex items-start justify-between gap-4">
        <div class="w-full space-y-3">
          <Skeleton class="h-5 w-3/4" />
          <Skeleton class="h-4 w-1/2" />
        </div>
        <Skeleton class="h-10 w-10 shrink-0" />
      </div>

      <div class="mt-7 space-y-3">
        <Skeleton class="h-4 w-4/5" />
        <Skeleton class="h-4 w-3/5" />
        <Skeleton v-if="variant === 'reservation'" class="h-4 w-2/5" />
      </div>

      <div class="mt-7 flex justify-between gap-2 border-t border-ink-100 pt-4">
        <Skeleton class="h-6 w-24" />
        <div class="flex gap-2">
          <Skeleton class="h-9 w-9" />
          <Skeleton class="h-9 w-9" />
        </div>
      </div>
    </Card>
  </section>
</template>

