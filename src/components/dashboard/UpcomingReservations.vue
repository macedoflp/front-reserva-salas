<script setup lang="ts">
import { CalendarDays, Clock3, DoorOpen, Sparkles, Users } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import type { Reservation } from '@/types';
import { formatReservationPeriod } from '@/utils';

withDefaults(
  defineProps<{
    loading?: boolean;
    reservations: Reservation[];
  }>(),
  {
    loading: false,
  },
);

function getRoomName(reservation: Reservation): string {
  return reservation.room?.name ?? 'Sala não encontrada';
}
</script>

<template>
  <Card padding="lg">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-ink-950">Próximas reservas</h2>
        <p class="mt-1 text-sm text-ink-500">Agenda ordenada pelos próximos horários.</p>
      </div>
      <Badge tone="brand">Agenda</Badge>
    </div>

    <div v-if="loading" class="mt-6 divide-y divide-ink-100">
      <div v-for="item in 4" :key="item" class="flex items-center gap-4 py-4 first:pt-0">
        <Skeleton class="h-11 w-11 shrink-0" />
        <div class="w-full space-y-2">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-4 w-4/5" />
        </div>
      </div>
    </div>

    <div v-else-if="reservations.length === 0" class="mt-6 rounded-lg border border-brand-100 bg-brand-50 p-6 text-center">
      <span
        class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-md bg-white text-brand-700 shadow-soft"
      >
        <Sparkles class="h-6 w-6" />
      </span>
      <h3 class="mt-4 text-base font-semibold text-ink-950">Sua agenda está livre.</h3>
      <p class="mt-2 text-sm leading-6 text-ink-600">Crie a primeira reserva.</p>
      <RouterLink class="mt-5 inline-flex" to="/reservations">
        <Button variant="primary">
          <CalendarDays class="h-4 w-4" />
          Abrir reservas
        </Button>
      </RouterLink>
    </div>

    <div v-else class="mt-6 divide-y divide-ink-100">
      <article
        v-for="reservation in reservations"
        :key="reservation.id"
        class="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-ink-950">{{ reservation.title }}</p>
          <p class="mt-1 flex items-center gap-1.5 truncate text-sm text-ink-500">
            <DoorOpen class="h-4 w-4 shrink-0" />
            {{ getRoomName(reservation) }}
          </p>
        </div>

        <div class="shrink-0 space-y-1 sm:text-right">
          <p class="flex items-center gap-1.5 text-sm font-medium text-ink-700 sm:justify-end">
            <Clock3 class="h-4 w-4" />
            {{ formatReservationPeriod(reservation.startsAt, reservation.endsAt) }}
          </p>
          <p class="flex items-center gap-1.5 text-xs text-ink-500 sm:justify-end">
            <Users class="h-3.5 w-3.5" />
            {{ reservation.participants }} participantes
          </p>
        </div>
      </article>
    </div>
  </Card>
</template>

