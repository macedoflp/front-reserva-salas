<script setup lang="ts">
import { AlertTriangle, X } from '@lucide/vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import IconButton from '@/components/ui/IconButton.vue';
import ToastViewport from '@/components/ui/ToastViewport.vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
</script>

<template>
  <div class="min-h-screen bg-surface-50 text-ink-900">
    <ToastViewport />
    <AppSidebar />

    <div
      :class="[
        'min-h-screen transition-[padding] duration-300',
        appStore.isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72',
      ]"
    >
      <AppHeader />

      <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div
          v-if="appStore.apiError"
          class="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft"
        >
          <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium">{{ appStore.apiError.message }}</p>
            <p v-if="appStore.apiError.path" class="mt-1 truncate text-xs text-amber-700">
              {{ appStore.apiError.path }}
            </p>
          </div>
          <IconButton label="Fechar aviso" size="sm" @click="appStore.clearApiError">
            <X class="h-4 w-4" />
          </IconButton>
        </div>

        <RouterView />
      </main>
    </div>
  </div>
</template>
