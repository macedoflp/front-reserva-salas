<script setup lang="ts">
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  DoorOpen,
  Users,
} from '@lucide/vue';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';

const stats = [
  {
    icon: DoorOpen,
    label: 'Salas cadastradas',
    value: '12',
    variation: '+2 este mês',
  },
  {
    icon: CalendarClock,
    label: 'Reservas hoje',
    value: '18',
    variation: '6 próximas',
  },
  {
    icon: Activity,
    label: 'Em andamento',
    value: '3',
    variation: '25% da capacidade',
  },
  {
    icon: Users,
    label: 'Participantes',
    value: '86',
    variation: 'agenda do dia',
  },
];

const schedule = [
  {
    room: 'Sala Aurora',
    time: '09:00 - 10:30',
    title: 'Planejamento semanal',
  },
  {
    room: 'Sala Horizonte',
    time: '11:00 - 12:00',
    title: 'Revisão de produto',
  },
  {
    room: 'Sala Prisma',
    time: '14:00 - 15:30',
    title: 'Workshop comercial',
  },
];

const roomHealth = [
  {
    label: 'Aurora',
    occupancy: '82%',
  },
  {
    label: 'Horizonte',
    occupancy: '64%',
  },
  {
    label: 'Prisma',
    occupancy: '48%',
  },
];
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="stat in stats" :key="stat.label">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-ink-500">{{ stat.label }}</p>
            <p class="mt-3 text-3xl font-semibold tracking-tight text-ink-950">{{ stat.value }}</p>
            <p class="mt-2 text-sm text-ink-500">{{ stat.variation }}</p>
          </div>
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
          >
            <component :is="stat.icon" class="h-5 w-5" />
          </span>
        </div>
      </Card>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <Card padding="lg">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold text-ink-950">Agenda de hoje</h2>
            <p class="mt-1 text-sm text-ink-500">Reservas organizadas por horário.</p>
          </div>
          <Badge tone="brand">Hoje</Badge>
        </div>

        <div class="mt-6 divide-y divide-ink-100">
          <div
            v-for="item in schedule"
            :key="`${item.room}-${item.time}`"
            class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink-950">{{ item.title }}</p>
              <p class="mt-1 truncate text-sm text-ink-500">{{ item.room }}</p>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-sm font-medium text-ink-700">{{ item.time }}</p>
              <p class="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700">
                <CheckCircle2 class="h-3.5 w-3.5" />
                Confirmada
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold text-ink-950">Ocupação</h2>
            <p class="mt-1 text-sm text-ink-500">Salas com maior uso na semana.</p>
          </div>
          <ArrowUpRight class="h-5 w-5 text-ink-400" />
        </div>

        <div class="mt-6 space-y-5">
          <div v-for="room in roomHealth" :key="room.label">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium text-ink-700">{{ room.label }}</span>
              <span class="text-ink-500">{{ room.occupancy }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-md bg-ink-100">
              <div class="h-full rounded-md bg-ink-900" :style="{ width: room.occupancy }" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  </div>
</template>
