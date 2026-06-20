<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils';

const props = withDefaults(
  defineProps<{
    label: string;
    size?: 'sm' | 'md';
    tone?: 'danger' | 'default' | 'strong';
    type?: 'button' | 'reset' | 'submit';
  }>(),
  {
    size: 'md',
    tone: 'default',
    type: 'button',
  },
);

const sizes = {
  md: 'h-10 w-10',
  sm: 'h-8 w-8',
};

const tones = {
  danger: 'border border-rose-200 bg-white text-rose-600 shadow-soft hover:border-rose-300 hover:bg-rose-50',
  default: 'border border-ink-200 bg-white text-ink-600 shadow-soft hover:border-ink-300 hover:text-ink-950',
  strong: 'bg-ink-900 text-white shadow-soft hover:bg-ink-800',
};

const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
    sizes[props.size],
    tones[props.tone],
  ),
);
</script>

<template>
  <button :aria-label="label" :class="classes" :title="label" :type="type">
    <slot />
  </button>
</template>
