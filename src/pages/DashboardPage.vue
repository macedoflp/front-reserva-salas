<script setup lang="ts">
import {
  Activity,
  AlertCircle,
  CalendarClock,
  DoorOpen,
  RefreshCcw,
  Users,
} from '@lucide/vue';
import { computed, markRaw, onMounted, ref } from 'vue';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue';
import QuickActions from '@/components/dashboard/QuickActions.vue';
import RecentActivity from '@/components/dashboard/RecentActivity.vue';
import RoomUsage from '@/components/dashboard/RoomUsage.vue';
import type { RoomUsageItem } from '@/components/dashboard/RoomUsage.vue';
import UpcomingReservations from '@/components/dashboard/UpcomingReservations.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import { listReservations } from '@/services/reservations.service';
import { listRooms } from '@/services/rooms.service';
import { useAppStore } from '@/stores/app';
import type { Reservation, Room } from '@/types';
import { formatCapacity, formatDateTime } from '@/utils';

const appStore = useAppStore();

const isLoading = ref(true);
const isRefreshing = ref(false);
const loadError = ref<string | null>(null);
const reservations = ref<Reservation[]>([]);
const rooms = ref<Room[]>([]);

const statIcons = {
  ongoing: markRaw(Activity),
  reservations: markRaw(CalendarClock),
  rooms: markRaw(DoorOpen),
  upcoming: markRaw(Users),
};

const totalCapacity = computed(() =>
  rooms.value.reduce((total, room) => total + room.capacity, 0),
);

const ongoingReservations = computed(() =>
  reservations.value.filter((reservation) => reservation.status === 'ongoing'),
);

const upcomingReservations = computed(() =>
  reservations.value
    .filter((reservation) => reservation.status === 'upcoming')
    .sort((first, second) => getDateTime(first.startsAt) - getDateTime(second.startsAt)),
);

const recentActivity = computed(() =>
  [...reservations.value]
    .sort((first, second) => getDateTime(second.updatedAt) - getDateTime(first.updatedAt))
    .slice(0, 5),
);

const activeParticipants = computed(() =>
  ongoingReservations.value.reduce((total, reservation) => total + reservation.participants, 0),
);

const roomUsage = computed<RoomUsageItem[]>(() => {
  const reservationsByRoom = reservations.value.reduce<Record<string, number>>(
    (usage, reservation) => ({
      ...usage,
      [reservation.roomId]: (usage[reservation.roomId] ?? 0) + 1,
    }),
    {},
  );
  const maxUsage = Math.max(...Object.values(reservationsByRoom), 0);

  if (maxUsage === 0) {
    return [];
  }

  return rooms.value
    .map((room) => {
      const reservationsCount = reservationsByRoom[room.id] ?? 0;

      return {
        capacity: room.capacity,
        id: room.id,
        name: room.name,
        percentage: Math.max(Math.round((reservationsCount / maxUsage) * 100), 8),
        reservationsCount,
      };
    })
    .filter((room) => room.reservationsCount > 0)
    .sort((first, second) => {
      if (second.reservationsCount !== first.reservationsCount) {
        return second.reservationsCount - first.reservationsCount;
      }

      return first.name.localeCompare(second.name);
    })
    .slice(0, 5);
});

const nextReservationLabel = computed(() => {
  const nextReservation = upcomingReservations.value[0];

  if (!nextReservation) {
    return 'Agenda livre';
  }

  return `Próxima: ${formatDateTime(nextReservation.startsAt)}`;
});

const dashboardStats = computed(() => [
  {
    icon: statIcons.rooms,
    label: 'Total de salas',
    tone: 'neutral' as const,
    value: rooms.value.length,
    variation:
      rooms.value.length > 0
        ? `${formatCapacity(totalCapacity.value)} disponíveis`
        : 'Nenhuma sala cadastrada',
  },
  {
    icon: statIcons.reservations,
    label: 'Total de reservas',
    tone: 'brand' as const,
    value: reservations.value.length,
    variation:
      reservations.value.length > 0
        ? `${upcomingReservations.value.length} próximas na agenda`
        : 'Nenhuma reserva registrada',
  },
  {
    icon: statIcons.ongoing,
    label: 'Em andamento',
    tone: 'success' as const,
    value: ongoingReservations.value.length,
    variation:
      ongoingReservations.value.length > 0
        ? `${activeParticipants.value} participantes agora`
        : 'Nenhuma sala em uso',
  },
  {
    icon: statIcons.upcoming,
    label: 'Próximas reservas',
    tone: 'warning' as const,
    value: upcomingReservations.value.length,
    variation: nextReservationLabel.value,
  },
]);

onMounted(() => {
  void loadDashboard();
});

async function loadDashboard(options: { silent?: boolean } = {}): Promise<void> {
  if (options.silent) {
    isRefreshing.value = true;
  } else {
    isLoading.value = true;
  }

  try {
    const [roomsResponse, reservationsResponse] = await Promise.all([
      listRooms(),
      listReservations({ order: 'desc' }),
    ]);

    rooms.value = roomsResponse;
    reservations.value = attachRooms(reservationsResponse, roomsResponse);
    loadError.value = null;
  } catch (error) {
    loadError.value = getErrorMessage(error);
    appStore.addToast({
      message: loadError.value,
      title: 'Falha ao carregar dashboard',
      variant: 'error',
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
}

function attachRooms(reservationList: Reservation[], roomList: Room[]): Reservation[] {
  const roomMap = new Map(roomList.map((room) => [room.id, room]));

  return reservationList.map((reservation) => ({
    ...reservation,
    room: reservation.room ?? roomMap.get(reservation.roomId) ?? null,
  }));
}

function getDateTime(value: string): number {
  return new Date(value).getTime();
}

function getMostUsedRoomName(): string {
  return roomUsage.value[0]?.name ?? 'Sem dados de uso';
}

function getOperationalSummary(): string {
  if (isLoading.value) {
    return 'Carregando visão operacional...';
  }

  if (loadError.value && reservations.value.length === 0) {
    return 'Não foi possível carregar os dados.';
  }

  if (reservations.value.length === 0) {
    return 'Sua agenda está livre. Crie a primeira reserva.';
  }

  if (ongoingReservations.value.length > 0) {
    return `${ongoingReservations.value.length} reserva(s) acontecendo agora.`;
  }

  return nextReservationLabel.value;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Não foi possível carregar os dados da dashboard.';
}
</script>

<template>
  <div class="space-y-6">
    <section
      class="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-soft transition duration-300"
    >
      <div class="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
        <div class="min-w-0">
          <p class="text-sm font-medium text-ink-500">Visão operacional</p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
            {{ getOperationalSummary() }}
          </h2>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-ink-500">
            Dados consolidados a partir da API para acompanhar salas, reservas e uso em tempo real.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div class="rounded-lg border border-ink-100 bg-surface-50 p-4">
            <p class="text-sm font-medium text-ink-500">Sala mais utilizada</p>
            <p class="mt-2 truncate text-lg font-semibold text-ink-950">
              {{ getMostUsedRoomName() }}
            </p>
          </div>
          <div class="rounded-lg border border-ink-100 bg-surface-50 p-4">
            <p class="text-sm font-medium text-ink-500">Capacidade cadastrada</p>
            <p class="mt-2 text-lg font-semibold text-ink-950">
              {{ formatCapacity(totalCapacity) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <Card v-if="loadError && !isLoading" padding="lg">
      <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-4">
          <span
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700"
          >
            <AlertCircle class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-base font-semibold text-ink-950">Dashboard indisponível</h3>
            <p class="mt-1 text-sm leading-6 text-ink-500">{{ loadError }}</p>
          </div>
        </div>

        <Button variant="secondary" @click="loadDashboard">
          <RefreshCcw class="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </Card>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        v-for="stat in dashboardStats"
        :key="stat.label"
        :icon="stat.icon"
        :label="stat.label"
        :loading="isLoading"
        :tone="stat.tone"
        :value="stat.value"
        :variation="stat.variation"
      />
    </section>

    <div class="flex sm:justify-end">
      <Button
        :disabled="isLoading || isRefreshing"
        class="w-full sm:w-auto"
        variant="secondary"
        @click="loadDashboard({ silent: true })"
      >
        <RefreshCcw :class="['h-4 w-4', isRefreshing ? 'animate-spin' : '']" />
        Atualizar dados
      </Button>
    </div>

    <section class="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      <UpcomingReservations
        :loading="isLoading"
        :reservations="upcomingReservations.slice(0, 5)"
      />
      <QuickActions />
    </section>

    <section class="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <RoomUsage :loading="isLoading" :rooms="roomUsage" />
      <RecentActivity :loading="isLoading" :reservations="recentActivity" />
    </section>
  </div>
</template>
