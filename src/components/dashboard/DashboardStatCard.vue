<script setup lang="ts">
import type { Component } from 'vue';
import Card from '@/components/ui/Card.vue';
import Skeleton from '@/components/ui/Skeleton.vue';

withDefaults(
  defineProps<{
    icon: Component;
    label: string;
    loading?: boolean;
    tone?: 'brand' | 'neutral' | 'success' | 'warning';
    value: number | string;
    variation: string;
  }>(),
  {
    loading: false,
    tone: 'neutral',
  },
);

const tones = {
  brand: 'border-brand-100 bg-brand-50 text-brand-700',
  neutral: 'border-ink-200 bg-surface-50 text-ink-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
};
</script>

<template>
  <Card>
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <Skeleton v-if="loading" class="h-4 w-28" />
        <p v-else class="truncate text-sm font-medium text-ink-500">{{ label }}</p>

        <Skeleton v-if="loading" class="mt-4 h-8 w-16" />
        <p v-else class="mt-3 text-3xl font-semibold tracking-tight text-ink-950">
          {{ value }}
        </p>

        <Skeleton v-if="loading" class="mt-3 h-4 w-32" />
        <p v-else class="mt-2 truncate text-sm text-ink-500">{{ variation }}</p>
      </div>

      <Skeleton v-if="loading" class="h-10 w-10 shrink-0" />
      <span
        v-else
        :class="[
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border',
          tones[tone],
        ]"
      >
        <component :is="icon" class="h-5 w-5" />
      </span>
    </div>
  </Card>
</template>

