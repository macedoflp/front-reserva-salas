<script setup lang="ts">
import {
  Building2,
  CalendarDays,
  DoorOpen,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from '@lucide/vue';
import { markRaw } from 'vue';
import type { Component } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import IconButton from '@/components/ui/IconButton.vue';
import { useAppStore } from '@/stores/app';

interface NavigationItem {
  icon: Component;
  label: string;
  path: string;
}

const appStore = useAppStore();
const route = useRoute();

const navigation: NavigationItem[] = [
  {
    icon: markRaw(LayoutDashboard),
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: markRaw(DoorOpen),
    label: 'Salas',
    path: '/rooms',
  },
  {
    icon: markRaw(CalendarDays),
    label: 'Reservas',
    path: '/reservations',
  },
];

function isActive(path: string): boolean {
  return route.path === path || (path !== '/dashboard' && route.path.startsWith(path));
}
</script>

<template>
  <div
    v-if="appStore.isMobileSidebarOpen"
    class="fixed inset-0 z-40 bg-ink-950/30 backdrop-blur-sm lg:hidden"
    @click="appStore.closeMobileSidebar"
  />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-ink-200 bg-surface-50/96 shadow-panel transition-transform duration-200 lg:hidden',
      appStore.isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex h-16 items-center justify-between px-4">
      <RouterLink class="flex min-w-0 items-center gap-3" to="/dashboard">
        <span
          class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-ink-950 text-white shadow-soft"
        >
          <Building2 class="h-5 w-5" />
        </span>
        <span class="truncate text-sm font-semibold text-ink-950">Reserva de Salas</span>
      </RouterLink>

      <IconButton label="Fechar menu" size="sm" @click="appStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </IconButton>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-3">
      <RouterLink
        v-for="item in navigation"
        :key="item.path"
        :class="[
          'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition',
          isActive(item.path)
            ? 'bg-ink-950 text-white shadow-soft'
            : 'text-ink-600 hover:bg-white hover:text-ink-950',
        ]"
        :to="item.path"
        @click="appStore.closeMobileSidebar"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-ink-200/90 bg-surface-50/95 backdrop-blur-xl transition-[width] duration-300 lg:flex',
      appStore.isSidebarCollapsed ? 'w-20' : 'w-72',
    ]"
  >
    <div class="flex h-16 items-center justify-between gap-2 px-3">
      <RouterLink
        class="flex min-w-0 items-center gap-3"
        :title="appStore.isSidebarCollapsed ? 'Reserva de Salas' : undefined"
        to="/dashboard"
      >
        <span
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink-950 text-white shadow-soft"
        >
          <Building2 class="h-5 w-5" />
        </span>
        <span
          v-if="!appStore.isSidebarCollapsed"
          class="truncate text-sm font-semibold text-ink-950"
        >
          Reserva de Salas
        </span>
      </RouterLink>

      <IconButton
        :label="appStore.isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
        size="sm"
        @click="appStore.toggleSidebar"
      >
        <PanelLeftOpen v-if="appStore.isSidebarCollapsed" class="h-4 w-4" />
        <PanelLeftClose v-else class="h-4 w-4" />
      </IconButton>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-3">
      <RouterLink
        v-for="item in navigation"
        :key="item.path"
        :class="[
          'flex h-10 items-center rounded-md text-sm font-medium transition',
          appStore.isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive(item.path)
            ? 'bg-ink-950 text-white shadow-soft'
            : 'text-ink-600 hover:bg-white hover:text-ink-950',
        ]"
        :title="appStore.isSidebarCollapsed ? item.label : undefined"
        :to="item.path"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" />
        <span v-if="!appStore.isSidebarCollapsed" class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
