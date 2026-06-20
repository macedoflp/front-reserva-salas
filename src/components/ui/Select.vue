<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    error?: string;
    help?: string;
    id?: string;
    label: string;
    modelValue: string;
  }>(),
  {
    disabled: false,
    error: '',
    help: '',
    id: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const generatedId = `select-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
const selectId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() =>
  props.error || props.help ? `${selectId.value}-description` : undefined,
);

const selectClasses = computed(() =>
  cn(
    'mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50',
    props.error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-ink-200',
  ),
);
</script>

<template>
  <div>
    <label class="text-sm font-medium text-ink-700" :for="selectId">{{ label }}</label>
    <select
      :id="selectId"
      :aria-describedby="descriptionId"
      :aria-invalid="Boolean(error)"
      :class="selectClasses"
      :disabled="disabled"
      :value="modelValue"
      v-bind="$attrs"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <p
      v-if="error || help"
      :id="descriptionId"
      :class="['mt-2 text-sm', error ? 'text-rose-600' : 'text-ink-500']"
    >
      {{ error || help }}
    </p>
  </div>
</template>

