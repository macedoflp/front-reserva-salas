<script setup lang="ts">
import { CalendarDays, Menu } from '@lucide/vue';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import IconButton from '@/components/ui/IconButton.vue';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const appStore = useAppStore();

const pageTitle = computed(() => route.meta.title);
const pageDescription = computed(() => route.meta.description);
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-ink-200/80 bg-white/86 backdrop-blur-xl"
  >
    <div class="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-3">
        <IconButton class="lg:hidden" label="Abrir menu" @click="appStore.openMobileSidebar">
          <Menu class="h-5 w-5" />
        </IconButton>

        <div class="min-w-0">
          <h1 class="truncate text-base font-semibold text-ink-950 sm:text-lg">
            {{ pageTitle }}
          </h1>
          <p v-if="pageDescription" class="hidden truncate text-sm text-ink-500 sm:block">
            {{ pageDescription }}
          </p>
        </div>
      </div>

      <RouterLink
        class="hidden h-9 items-center gap-2 rounded-md border border-ink-200 bg-white px-3 text-sm font-medium text-ink-700 shadow-soft transition hover:border-ink-300 hover:text-ink-950 sm:inline-flex"
        to="/reservations"
      >
        <CalendarDays class="h-4 w-4" />
        Reservas
      </RouterLink>
    </div>
  </header>
</template>
