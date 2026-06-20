<script setup lang="ts">
import { ArrowUpRight, BarChart3 } from '@lucide/vue';
import Card from '@/components/ui/Card.vue';
import Skeleton from '@/components/ui/Skeleton.vue';

export interface RoomUsageItem {
  capacity: number;
  id: string;
  name: string;
  percentage: number;
  reservationsCount: number;
}

withDefaults(
  defineProps<{
    loading?: boolean;
    rooms: RoomUsageItem[];
  }>(),
  {
    loading: false,
  },
);
</script>

<template>
  <Card padding="lg">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-ink-950">Salas mais utilizadas</h2>
        <p class="mt-1 text-sm text-ink-500">Ranking por quantidade de reservas.</p>
      </div>
      <ArrowUpRight class="h-5 w-5 text-ink-400" />
    </div>

    <div v-if="loading" class="mt-6 space-y-5">
      <div v-for="item in 5" :key="item" class="space-y-2">
        <div class="flex items-center justify-between gap-3">
          <Skeleton class="h-4 w-32" />
          <Skeleton class="h-4 w-12" />
        </div>
        <Skeleton class="h-2 w-full" />
      </div>
    </div>

    <div v-else-if="rooms.length === 0" class="mt-6 rounded-lg border border-ink-100 bg-surface-50 p-5">
      <BarChart3 class="h-5 w-5 text-ink-400" />
      <p class="mt-3 text-sm font-medium text-ink-950">Sem uso registrado</p>
      <p class="mt-1 text-sm leading-6 text-ink-500">
        Crie reservas para visualizar quais salas concentram mais demanda.
      </p>
    </div>

    <div v-else class="mt-6 space-y-5">
      <div v-for="room in rooms" :key="room.id">
        <div class="mb-2 flex items-center justify-between gap-3 text-sm">
          <div class="min-w-0">
            <p class="truncate font-medium text-ink-800">{{ room.name }}</p>
            <p class="mt-0.5 text-xs text-ink-500">{{ room.capacity }} lugares</p>
          </div>
          <span class="shrink-0 text-ink-500">
            {{ room.reservationsCount }}
          </span>
        </div>
        <div class="h-2 overflow-hidden rounded-md bg-ink-100">
          <div
            class="h-full rounded-md bg-ink-950 transition-[width] duration-500 ease-out"
            :style="{ width: `${room.percentage}%` }"
          />
        </div>
      </div>
    </div>
  </Card>
</template>

