<script setup lang="ts">
import { History, Pencil, PlusCircle } from '@lucide/vue';
import Card from '@/components/ui/Card.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import type { Reservation } from '@/types';
import { formatDateTime } from '@/utils';

withDefaults(
  defineProps<{
    loading?: boolean;
    reservations: Reservation[];
  }>(),
  {
    loading: false,
  },
);

function getActivityLabel(reservation: Reservation): string {
  return reservation.updatedAt === reservation.createdAt ? 'Reserva criada' : 'Reserva atualizada';
}

function getActivityIcon(reservation: Reservation) {
  return reservation.updatedAt === reservation.createdAt ? PlusCircle : Pencil;
}
</script>

<template>
  <Card padding="lg">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-ink-950">Atividade recente</h2>
        <p class="mt-1 text-sm text-ink-500">Últimas movimentações da agenda.</p>
      </div>
      <History class="h-5 w-5 text-ink-400" />
    </div>

    <div v-if="loading" class="mt-6 space-y-4">
      <div v-for="item in 4" :key="item" class="flex gap-3">
        <Skeleton class="h-9 w-9 shrink-0" />
        <div class="w-full space-y-2">
          <Skeleton class="h-4 w-3/5" />
          <Skeleton class="h-4 w-4/5" />
        </div>
      </div>
    </div>

    <div v-else-if="reservations.length === 0" class="mt-6 rounded-lg border border-ink-100 bg-surface-50 p-5">
      <p class="text-sm font-medium text-ink-950">Sem atividade ainda</p>
      <p class="mt-1 text-sm leading-6 text-ink-500">
        Assim que houver reservas, os movimentos recentes aparecem aqui.
      </p>
    </div>

    <div v-else class="mt-6 space-y-4">
      <article
        v-for="reservation in reservations"
        :key="reservation.id"
        class="flex items-start gap-3"
      >
        <span
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
        >
          <component :is="getActivityIcon(reservation)" class="h-4 w-4" />
        </span>
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-ink-950">{{ getActivityLabel(reservation) }}</p>
          <p class="mt-1 truncate text-sm text-ink-500">
            {{ reservation.title }} · {{ formatDateTime(reservation.updatedAt) }}
          </p>
        </div>
      </article>
    </div>
  </Card>
</template>

