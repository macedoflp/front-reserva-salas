<script setup lang="ts">
import { CalendarDays, Clock3, Filter, Users } from '@lucide/vue';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import type { ReservationStatus } from '@/types';
import { reservationStatusLabels } from '@/types';
import { formatDateTime } from '@/utils';

const reservations = [
  {
    endsAt: '2026-06-20T12:00:00.000Z',
    participants: 8,
    room: 'Sala Horizonte',
    startsAt: '2026-06-20T11:00:00.000Z',
    status: 'ongoing' as ReservationStatus,
    title: 'Revisão de produto',
  },
  {
    endsAt: '2026-06-20T15:30:00.000Z',
    participants: 14,
    room: 'Sala Prisma',
    startsAt: '2026-06-20T14:00:00.000Z',
    status: 'upcoming' as ReservationStatus,
    title: 'Workshop comercial',
  },
  {
    endsAt: '2026-06-19T18:00:00.000Z',
    participants: 5,
    room: 'Sala Aurora',
    startsAt: '2026-06-19T17:00:00.000Z',
    status: 'finished' as ReservationStatus,
    title: 'Sincronização executiva',
  },
];

function statusTone(status: ReservationStatus): 'brand' | 'neutral' | 'success' | 'warning' {
  if (status === 'ongoing') {
    return 'success';
  }

  if (status === 'upcoming') {
    return 'brand';
  }

  return 'neutral';
}
</script>

<template>
  <div class="space-y-6">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold tracking-tight text-ink-950">Reservas</h2>
        <p class="mt-1 text-sm text-ink-500">Agenda preparada para consumir `/reservations`.</p>
      </div>

      <div class="inline-flex rounded-lg border border-ink-200 bg-white p-1 shadow-soft">
        <button
          class="inline-flex h-8 items-center gap-2 rounded-md bg-ink-950 px-3 text-sm font-medium text-white"
          type="button"
        >
          <CalendarDays class="h-4 w-4" />
          Todas
        </button>
        <button
          class="inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink-600 hover:text-ink-950"
          type="button"
        >
          <Filter class="h-4 w-4" />
          Status
        </button>
      </div>
    </section>

    <Card padding="none">
      <div class="overflow-hidden">
        <div class="hidden grid-cols-[1.2fr_1fr_0.9fr_0.8fr] gap-4 border-b border-ink-100 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-500 md:grid">
          <span>Reserva</span>
          <span>Sala</span>
          <span>Horário</span>
          <span>Status</span>
        </div>

        <div class="divide-y divide-ink-100">
          <article
            v-for="reservation in reservations"
            :key="`${reservation.title}-${reservation.startsAt}`"
            class="grid gap-4 px-5 py-4 md:grid-cols-[1.2fr_1fr_0.9fr_0.8fr] md:items-center"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink-950">{{ reservation.title }}</p>
              <p class="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-500">
                <Users class="h-4 w-4" />
                {{ reservation.participants }} participantes
              </p>
            </div>

            <div class="text-sm text-ink-700">{{ reservation.room }}</div>

            <div class="text-sm text-ink-600">
              <p class="inline-flex items-center gap-1.5">
                <Clock3 class="h-4 w-4" />
                {{ formatDateTime(reservation.startsAt) }}
              </p>
            </div>

            <div>
              <Badge :tone="statusTone(reservation.status)">
                {{ reservationStatusLabels[reservation.status] }}
              </Badge>
            </div>
          </article>
        </div>
      </div>
    </Card>
  </div>
</template>
