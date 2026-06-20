<script setup lang="ts">
import { CheckCircle2, Info, X, XCircle } from '@lucide/vue';
import type { ToastVariant } from '@/stores/app';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();

function toastClasses(variant: ToastVariant): string {
  const variants: Record<ToastVariant, string> = {
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    info: 'border-brand-100 bg-brand-50 text-brand-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  };

  return variants[variant];
}
</script>

<template>
  <div
    aria-live="polite"
    class="pointer-events-none fixed right-3 top-3 z-[60] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
  >
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <article
        v-for="toast in appStore.toasts"
        :key="toast.id"
        :role="toast.variant === 'error' ? 'alert' : 'status'"
        :class="[
          'pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-panel',
          toastClasses(toast.variant),
        ]"
      >
        <CheckCircle2 v-if="toast.variant === 'success'" class="mt-0.5 h-5 w-5 shrink-0" />
        <XCircle v-else-if="toast.variant === 'error'" class="mt-0.5 h-5 w-5 shrink-0" />
        <Info v-else class="mt-0.5 h-5 w-5 shrink-0" />

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">{{ toast.title }}</p>
          <p class="mt-1 text-sm leading-5 opacity-80">{{ toast.message }}</p>
        </div>

        <button
          class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-70 transition hover:bg-white/60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          type="button"
          aria-label="Fechar aviso"
          @click="appStore.dismissToast(toast.id)"
        >
          <X class="h-4 w-4" />
        </button>
      </article>
    </TransitionGroup>
  </div>
</template>
