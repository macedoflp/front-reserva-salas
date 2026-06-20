<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    size?: 'sm' | 'md';
    type?: 'button' | 'reset' | 'submit';
    variant?: 'ghost' | 'primary' | 'secondary';
  }>(),
  {
    disabled: false,
    size: 'md',
    type: 'button',
    variant: 'secondary',
  },
);

const variants = {
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  primary: 'bg-ink-900 text-white shadow-soft hover:bg-ink-800',
  secondary: 'border border-ink-200 bg-white text-ink-700 shadow-soft hover:border-ink-300 hover:text-ink-950',
};

const sizes = {
  md: 'h-10 gap-2 px-4 text-sm',
  sm: 'h-9 gap-2 px-3 text-sm',
};

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variants[props.variant],
    sizes[props.size],
  ),
);
</script>

<template>
  <button :class="classes" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

