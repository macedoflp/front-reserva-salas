<script setup lang="ts">
import { CalendarPlus, DoorOpen, ListFilter } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import Card from '@/components/ui/Card.vue';
</script>

<template>
  <Card padding="lg">
    <div>
      <h2 class="text-base font-semibold text-ink-950">Atalhos rápidos</h2>
      <p class="mt-1 text-sm text-ink-500">Acesse as áreas principais do sistema.</p>
    </div>

    <div class="mt-6 grid gap-3">
      <RouterLink
        class="group flex items-center justify-between gap-4 rounded-lg border border-ink-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-ink-300"
        to="/reservations"
      >
        <span class="flex min-w-0 items-center gap-3">
          <span
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink-950 text-white"
          >
            <CalendarPlus class="h-4 w-4" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-medium text-ink-950">Nova reserva</span>
            <span class="block truncate text-sm text-ink-500">Criar ou editar agendamentos</span>
          </span>
        </span>
      </RouterLink>

      <RouterLink
        class="group flex items-center justify-between gap-4 rounded-lg border border-ink-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-ink-300"
        to="/rooms"
      >
        <span class="flex min-w-0 items-center gap-3">
          <span
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
          >
            <DoorOpen class="h-4 w-4" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-medium text-ink-950">Gerenciar salas</span>
            <span class="block truncate text-sm text-ink-500">Capacidade e cadastro</span>
          </span>
        </span>
      </RouterLink>

      <RouterLink
        class="group flex items-center justify-between gap-4 rounded-lg border border-ink-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-ink-300"
        to="/reservations"
      >
        <span class="flex min-w-0 items-center gap-3">
          <span
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-brand-100 bg-brand-50 text-brand-700"
          >
            <ListFilter class="h-4 w-4" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-medium text-ink-950">Filtrar agenda</span>
            <span class="block truncate text-sm text-ink-500">Sala, status e ordenação</span>
          </span>
        </span>
      </RouterLink>
    </div>
  </Card>
</template>
