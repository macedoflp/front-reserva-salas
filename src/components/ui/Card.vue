<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils';

const props = withDefaults(
  defineProps<{
    padding?: 'lg' | 'md' | 'none';
    tone?: 'default' | 'muted';
  }>(),
  {
    padding: 'md',
    tone: 'default',
  },
);

const paddings = {
  lg: 'p-6',
  md: 'p-5',
  none: '',
};

const tones = {
  default: 'border-ink-200/80 bg-white shadow-soft',
  muted: 'border-ink-200/70 bg-surface-50',
};

const classes = computed(() =>
  cn('rounded-lg border', tones[props.tone], paddings[props.padding]),
);
</script>

<template>
  <section :class="classes">
    <slot />
  </section>
</template>

