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
    min?: number | string;
    modelValue: null | number | string;
    placeholder?: string;
    step?: number | string;
    type?: 'datetime-local' | 'number' | 'text';
  }>(),
  {
    disabled: false,
    error: '',
    help: '',
    id: undefined,
    min: undefined,
    placeholder: '',
    step: undefined,
    type: 'text',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: null | number | string];
}>();

const generatedId = `input-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
const inputId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() =>
  props.error || props.help ? `${inputId.value}-description` : undefined,
);

const inputClasses = computed(() =>
  cn(
    'mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50',
    props.error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-ink-200',
  ),
);

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement;

  if (props.type === 'number') {
    emit('update:modelValue', target.value === '' ? null : target.valueAsNumber);
    return;
  }

  emit('update:modelValue', target.value);
}
</script>

<template>
  <div>
    <label class="text-sm font-medium text-ink-700" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :aria-describedby="descriptionId"
      :aria-invalid="Boolean(error)"
      :class="inputClasses"
      :disabled="disabled"
      :min="min"
      :placeholder="placeholder"
      :step="step"
      :type="type"
      :value="modelValue ?? ''"
      v-bind="$attrs"
      @input="handleInput"
    />
    <p
      v-if="error || help"
      :id="descriptionId"
      :class="['mt-2 text-sm', error ? 'text-rose-600' : 'text-ink-500']"
    >
      {{ error || help }}
    </p>
  </div>
</template>

