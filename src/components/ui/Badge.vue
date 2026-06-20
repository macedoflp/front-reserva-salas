<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils';

const props = withDefaults(
  defineProps<{
    tone?: 'brand' | 'neutral' | 'success' | 'warning';
  }>(),
  {
    tone: 'neutral',
  },
);

const tones = {
  brand: 'border-brand-100 bg-brand-50 text-brand-700',
  neutral: 'border-ink-200 bg-white text-ink-600',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
};

const classes = computed(() =>
  cn(
    'inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium leading-none',
    tones[props.tone],
  ),
);
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

