<script setup lang="ts">
import { DoorOpen, Monitor, Users } from '@lucide/vue';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import { formatCapacity } from '@/utils';

const rooms = [
  {
    capacity: 8,
    equipment: 'TV, quadro',
    floor: '2º andar',
    name: 'Sala Aurora',
    status: 'Disponível',
  },
  {
    capacity: 14,
    equipment: 'Projetor, áudio',
    floor: '3º andar',
    name: 'Sala Horizonte',
    status: 'Em uso',
  },
  {
    capacity: 24,
    equipment: 'Videoconferência',
    floor: '1º andar',
    name: 'Sala Prisma',
    status: 'Disponível',
  },
];
</script>

<template>
  <div class="space-y-6">
    <section class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold tracking-tight text-ink-950">Salas</h2>
        <p class="mt-1 text-sm text-ink-500">Catálogo preparado para consumir `/rooms`.</p>
      </div>
      <Badge tone="neutral">{{ rooms.length }} salas</Badge>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <Card v-for="room in rooms" :key="room.name" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate text-base font-semibold text-ink-950">{{ room.name }}</p>
            <p class="mt-1 text-sm text-ink-500">{{ room.floor }}</p>
          </div>
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
          >
            <DoorOpen class="h-5 w-5" />
          </span>
        </div>

        <div class="mt-6 space-y-3">
          <p class="flex items-center gap-2 text-sm text-ink-600">
            <Users class="h-4 w-4 text-ink-400" />
            {{ formatCapacity(room.capacity) }}
          </p>
          <p class="flex items-center gap-2 text-sm text-ink-600">
            <Monitor class="h-4 w-4 text-ink-400" />
            {{ room.equipment }}
          </p>
        </div>

        <div class="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
          <span class="text-sm text-ink-500">Status</span>
          <Badge :tone="room.status === 'Disponível' ? 'success' : 'warning'">
            {{ room.status }}
          </Badge>
        </div>
      </Card>
    </section>
  </div>
</template>
