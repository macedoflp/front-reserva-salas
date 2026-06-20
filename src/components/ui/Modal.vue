<script setup lang="ts">
import { X } from '@lucide/vue';
import { onBeforeUnmount, watch } from 'vue';
import IconButton from './IconButton.vue';

const props = withDefaults(
  defineProps<{
    description?: string;
    modelValue: boolean;
    title: string;
  }>(),
  {
    description: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function closeModal(): void {
  emit('update:modelValue', false);
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/35 p-3 backdrop-blur-sm sm:items-center sm:p-6"
        @click.self="closeModal"
      >
        <Transition
          appear
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="translate-y-3 scale-[0.98] opacity-0"
          enter-to-class="translate-y-0 scale-100 opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="translate-y-0 scale-100 opacity-100"
          leave-to-class="translate-y-2 scale-[0.98] opacity-0"
        >
          <section
            class="w-full max-w-lg rounded-lg border border-ink-200 bg-white shadow-panel"
            role="dialog"
            aria-modal="true"
          >
            <header class="flex items-start justify-between gap-4 border-b border-ink-100 p-5">
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-ink-950">{{ title }}</h2>
                <p v-if="description" class="mt-1 text-sm leading-6 text-ink-500">
                  {{ description }}
                </p>
              </div>

              <IconButton label="Fechar" size="sm" @click="closeModal">
                <X class="h-4 w-4" />
              </IconButton>
            </header>

            <div class="p-5">
              <slot />
            </div>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

