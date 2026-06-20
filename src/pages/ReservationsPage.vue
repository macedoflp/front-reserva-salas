<script setup lang="ts">
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DoorOpen,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Users,
  XCircle,
} from '@lucide/vue';
import { computed, onMounted, reactive, ref } from 'vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import IconButton from '@/components/ui/IconButton.vue';
import Modal from '@/components/ui/Modal.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import {
  createReservation,
  deleteReservation,
  listReservations,
  updateReservation,
} from '@/services/reservations.service';
import { listRooms } from '@/services/rooms.service';
import { useAppStore } from '@/stores/app';
import type {
  ApiClientError,
  CreateReservationPayload,
  Reservation,
  ReservationListQuery,
  ReservationOrder,
  ReservationStatus,
  Room,
} from '@/types';
import { reservationStatusLabels } from '@/types';
import { formatCapacity, formatReservationPeriod } from '@/utils';

const CONFLICT_MESSAGE = 'Já existe uma reserva para esta sala nesse horário.';
const CAPACITY_MESSAGE = 'Essa sala não suporta essa quantidade de participantes.';

interface ReservationFilters {
  order: ReservationOrder;
  roomId: string;
  status: ReservationStatus | '';
}

interface ReservationForm {
  endsAt: string;
  participants: number | null;
  roomId: string;
  startsAt: string;
  title: string;
}

interface ReservationFormErrors {
  endsAt: string;
  participants: string;
  roomId: string;
  startsAt: string;
  title: string;
}

interface FormAlert {
  message: string;
  tone: 'capacity' | 'conflict';
}

const appStore = useAppStore();

const filters = reactive<ReservationFilters>({
  order: 'desc',
  roomId: '',
  status: '',
});

const form = reactive<ReservationForm>({
  endsAt: '',
  participants: 1,
  roomId: '',
  startsAt: '',
  title: '',
});

const formErrors = reactive<ReservationFormErrors>({
  endsAt: '',
  participants: '',
  roomId: '',
  startsAt: '',
  title: '',
});

const editingReservation = ref<Reservation | null>(null);
const formAlert = ref<FormAlert | null>(null);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const isFiltersLoading = ref(false);
const isFormModalOpen = ref(false);
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref<string | null>(null);
const reservationToDelete = ref<Reservation | null>(null);
const reservations = ref<Reservation[]>([]);
const rooms = ref<Room[]>([]);

const roomsById = computed(() => {
  return new Map(rooms.value.map((room) => [room.id, room]));
});

const filteredCountLabel = computed(() => {
  const count = reservations.value.length;

  return `${count} ${count === 1 ? 'reserva' : 'reservas'}`;
});

const currentRoom = computed(() => {
  if (!form.roomId) {
    return null;
  }

  return roomsById.value.get(form.roomId) ?? null;
});

const formTitle = computed(() =>
  editingReservation.value ? 'Editar reserva' : 'Nova reserva',
);

const formDescription = computed(() =>
  editingReservation.value
    ? 'Atualize a sala, participantes e período da reserva.'
    : 'Crie uma reserva respeitando capacidade e conflitos de horário.',
);

const ongoingCount = computed(
  () => reservations.value.filter((reservation) => reservation.status === 'ongoing').length,
);

const upcomingCount = computed(
  () => reservations.value.filter((reservation) => reservation.status === 'upcoming').length,
);

onMounted(() => {
  void loadPage();
});

async function loadPage(): Promise<void> {
  isLoading.value = true;

  try {
    const [roomsResponse, reservationsResponse] = await Promise.all([
      listRooms(),
      listReservations(buildQuery()),
    ]);

    rooms.value = roomsResponse;
    reservations.value = attachRooms(reservationsResponse, roomsResponse);
    loadError.value = null;
  } catch (error) {
    loadError.value = getErrorMessage(error);
    appStore.addToast({
      message: loadError.value,
      title: 'Falha ao carregar reservas',
      variant: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}

async function fetchReservations(): Promise<void> {
  isFiltersLoading.value = true;

  try {
    const response = await listReservations(buildQuery());
    reservations.value = attachRooms(response, rooms.value);
    loadError.value = null;
  } catch (error) {
    loadError.value = getErrorMessage(error);
    appStore.addToast({
      message: loadError.value,
      title: 'Falha ao filtrar reservas',
      variant: 'error',
    });
  } finally {
    isFiltersLoading.value = false;
  }
}

function applyFilters(): void {
  void fetchReservations();
}

function clearFilters(): void {
  filters.roomId = '';
  filters.status = '';
  filters.order = 'desc';
  applyFilters();
}

function openCreateModal(): void {
  editingReservation.value = null;
  resetForm();
  isFormModalOpen.value = true;
}

function openEditModal(reservation: Reservation): void {
  editingReservation.value = reservation;
  resetForm(reservation);
  isFormModalOpen.value = true;
}

function requestDelete(reservation: Reservation): void {
  reservationToDelete.value = reservation;
  isDeleteModalOpen.value = true;
}

async function submitReservation(): Promise<void> {
  if (!validateForm()) {
    return;
  }

  const payload: CreateReservationPayload = {
    endsAt: localDateTimeToIso(form.endsAt),
    participants: Number(form.participants),
    roomId: form.roomId,
    startsAt: localDateTimeToIso(form.startsAt),
    title: form.title.trim(),
  };

  isSubmitting.value = true;

  try {
    if (editingReservation.value) {
      await updateReservation(editingReservation.value.id, payload);
      appStore.addToast({
        message: 'Os dados da reserva foram atualizados.',
        title: 'Reserva atualizada',
        variant: 'success',
      });
    } else {
      await createReservation(payload);
      appStore.addToast({
        message: 'A reserva foi criada na agenda.',
        title: 'Reserva criada',
        variant: 'success',
      });
    }

    isFormModalOpen.value = false;
    editingReservation.value = null;
    resetForm();
    await fetchReservations();
  } catch (error) {
    handleFormApiError(error);
  } finally {
    isSubmitting.value = false;
  }
}

async function confirmDelete(): Promise<void> {
  if (!reservationToDelete.value) {
    return;
  }

  const reservation = reservationToDelete.value;
  isDeleting.value = true;

  try {
    await deleteReservation(reservation.id);
    appStore.addToast({
      message: `${reservation.title} foi removida.`,
      title: 'Reserva excluída',
      variant: 'success',
    });
    isDeleteModalOpen.value = false;
    reservationToDelete.value = null;
    await fetchReservations();
  } catch (error) {
    appStore.addToast({
      message: getErrorMessage(error),
      title: 'Falha ao excluir reserva',
      variant: 'error',
    });
  } finally {
    isDeleting.value = false;
  }
}

function buildQuery(): ReservationListQuery {
  return {
    order: filters.order,
    roomId: filters.roomId || undefined,
    status: filters.status || undefined,
  };
}

function attachRooms(reservationList: Reservation[], roomList: Room[]): Reservation[] {
  const roomMap = new Map(roomList.map((room) => [room.id, room]));

  return reservationList.map((reservation) => ({
    ...reservation,
    room: reservation.room ?? roomMap.get(reservation.roomId) ?? null,
  }));
}

function resetForm(reservation?: Reservation): void {
  const defaultStart = createDefaultDateTimeInputValue(1);
  const defaultEnd = createDefaultDateTimeInputValue(2);

  form.roomId = reservation?.roomId ?? rooms.value[0]?.id ?? '';
  form.title = reservation?.title ?? '';
  form.participants = reservation?.participants ?? 1;
  form.startsAt = reservation ? toDateTimeInputValue(reservation.startsAt) : defaultStart;
  form.endsAt = reservation ? toDateTimeInputValue(reservation.endsAt) : defaultEnd;
  clearFormFeedback();
}

function clearFormFeedback(): void {
  formErrors.roomId = '';
  formErrors.title = '';
  formErrors.participants = '';
  formErrors.startsAt = '';
  formErrors.endsAt = '';
  formAlert.value = null;
}

function validateForm(): boolean {
  clearFormFeedback();

  if (!form.roomId) {
    formErrors.roomId = 'Selecione uma sala.';
  }

  if (!form.title.trim()) {
    formErrors.title = 'Informe o título da reserva.';
  }

  const participants = Number(form.participants);

  if (!Number.isInteger(participants) || participants <= 0) {
    formErrors.participants = 'Informe uma quantidade inteira maior que zero.';
  }

  if (!form.startsAt) {
    formErrors.startsAt = 'Informe o início da reserva.';
  }

  if (!form.endsAt) {
    formErrors.endsAt = 'Informe o fim da reserva.';
  }

  if (form.startsAt && form.endsAt) {
    const startsAt = new Date(form.startsAt);
    const endsAt = new Date(form.endsAt);

    if (Number.isNaN(startsAt.getTime())) {
      formErrors.startsAt = 'Informe uma data de início válida.';
    }

    if (Number.isNaN(endsAt.getTime())) {
      formErrors.endsAt = 'Informe uma data de fim válida.';
    }

    if (!formErrors.startsAt && !formErrors.endsAt && endsAt <= startsAt) {
      formErrors.endsAt = 'O fim deve ser depois do início.';
    }
  }

  if (!formErrors.participants && currentRoom.value && participants > currentRoom.value.capacity) {
    formAlert.value = {
      message: CAPACITY_MESSAGE,
      tone: 'capacity',
    };
  }

  return (
    !formErrors.roomId &&
    !formErrors.title &&
    !formErrors.participants &&
    !formErrors.startsAt &&
    !formErrors.endsAt &&
    !formAlert.value
  );
}

function handleFormApiError(error: unknown): void {
  const message = getErrorMessage(error);
  const apiError = error as Partial<ApiClientError>;
  const normalizedMessage = message.toLowerCase();

  if (apiError.statusCode === 409 || normalizedMessage.includes('já existe uma reserva')) {
    formAlert.value = {
      message: CONFLICT_MESSAGE,
      tone: 'conflict',
    };
  } else if (normalizedMessage.includes('capacidade')) {
    formAlert.value = {
      message: CAPACITY_MESSAGE,
      tone: 'capacity',
    };
  }

  appStore.addToast({
    message: formAlert.value?.message ?? message,
    title: editingReservation.value ? 'Falha ao atualizar reserva' : 'Falha ao criar reserva',
    variant: 'error',
  });
}

function createDefaultDateTimeInputValue(hoursFromNow: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow, 0, 0, 0);

  return formatForDateTimeInput(date);
}

function toDateTimeInputValue(value: string): string {
  return formatForDateTimeInput(new Date(value));
}

function formatForDateTimeInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function localDateTimeToIso(value: string): string {
  return new Date(value).toISOString();
}

function getReservationRoom(reservation: Reservation): Room | null {
  return reservation.room ?? roomsById.value.get(reservation.roomId) ?? null;
}

function getRoomName(reservation: Reservation): string {
  return getReservationRoom(reservation)?.name ?? 'Sala não encontrada';
}

function getStatusTone(status: ReservationStatus): 'brand' | 'neutral' | 'success' {
  if (status === 'ongoing') {
    return 'success';
  }

  if (status === 'upcoming') {
    return 'brand';
  }

  return 'neutral';
}

function getStatusIcon(status: ReservationStatus) {
  if (status === 'ongoing') {
    return CheckCircle2;
  }

  if (status === 'upcoming') {
    return CalendarDays;
  }

  return XCircle;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Não foi possível concluir a operação.';
}
</script>

<template>
  <div class="space-y-6">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold tracking-tight text-ink-950">Reservas</h2>
        <p class="mt-1 text-sm text-ink-500">
          Gerencie agenda, conflitos de horário e capacidade das salas.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Button :disabled="isFiltersLoading || isLoading" variant="secondary" @click="loadPage">
          <RefreshCcw :class="['h-4 w-4', isFiltersLoading ? 'animate-spin' : '']" />
          Atualizar
        </Button>
        <Button :disabled="rooms.length === 0" variant="primary" @click="openCreateModal">
          <Plus class="h-4 w-4" />
          Nova reserva
        </Button>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <Card>
        <p class="text-sm font-medium text-ink-500">Reservas exibidas</p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold tracking-tight text-ink-950">
            {{ reservations.length }}
          </p>
          <Badge tone="neutral">{{ filteredCountLabel }}</Badge>
        </div>
      </Card>

      <Card>
        <p class="text-sm font-medium text-ink-500">Em andamento</p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold tracking-tight text-ink-950">{{ ongoingCount }}</p>
          <Badge tone="success">Agora</Badge>
        </div>
      </Card>

      <Card>
        <p class="text-sm font-medium text-ink-500">Próximas</p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold tracking-tight text-ink-950">{{ upcomingCount }}</p>
          <Badge tone="brand">Agenda</Badge>
        </div>
      </Card>
    </section>

    <Card padding="lg">
      <div class="grid gap-4 lg:grid-cols-[1fr_0.8fr_0.8fr_auto] lg:items-end">
        <div>
          <label class="text-sm font-medium text-ink-700" for="room-filter">Sala</label>
          <select
            id="room-filter"
            v-model="filters.roomId"
            class="mt-2 h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            @change="applyFilters"
          >
            <option value="">Todas as salas</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium text-ink-700" for="status-filter">Status</label>
          <select
            id="status-filter"
            v-model="filters.status"
            class="mt-2 h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            @change="applyFilters"
          >
            <option value="">Todos</option>
            <option value="ongoing">Em andamento</option>
            <option value="upcoming">Próxima</option>
            <option value="finished">Encerrada</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium text-ink-700" for="order-filter">Ordenação</label>
          <select
            id="order-filter"
            v-model="filters.order"
            class="mt-2 h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            @change="applyFilters"
          >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigas</option>
          </select>
        </div>

        <Button class="w-full lg:w-auto" variant="secondary" @click="clearFilters">
          Limpar
        </Button>
      </div>
    </Card>

    <section v-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card v-for="item in 6" :key="item" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div class="w-full space-y-3">
            <Skeleton class="h-5 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
          </div>
          <Skeleton class="h-10 w-10 shrink-0" />
        </div>
        <div class="mt-7 space-y-3">
          <Skeleton class="h-4 w-4/5" />
          <Skeleton class="h-4 w-3/5" />
          <Skeleton class="h-4 w-2/5" />
        </div>
        <div class="mt-7 flex justify-between gap-2 border-t border-ink-100 pt-4">
          <Skeleton class="h-6 w-24" />
          <div class="flex gap-2">
            <Skeleton class="h-9 w-9" />
            <Skeleton class="h-9 w-9" />
          </div>
        </div>
      </Card>
    </section>

    <Card v-else-if="loadError && reservations.length === 0" padding="lg">
      <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-4">
          <span
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700"
          >
            <AlertCircle class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-base font-semibold text-ink-950">
              Não foi possível carregar as reservas
            </h3>
            <p class="mt-1 text-sm leading-6 text-ink-500">{{ loadError }}</p>
          </div>
        </div>

        <Button variant="secondary" @click="loadPage">
          <RefreshCcw class="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </Card>

    <Card v-else-if="reservations.length === 0" padding="lg">
      <div class="mx-auto flex max-w-md flex-col items-center py-8 text-center">
        <span
          class="inline-flex h-12 w-12 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
        >
          <CalendarDays class="h-6 w-6" />
        </span>
        <h3 class="mt-5 text-base font-semibold text-ink-950">Nenhuma reserva encontrada</h3>
        <p class="mt-2 text-sm leading-6 text-ink-500">
          Ajuste os filtros ou crie uma nova reserva para uma sala disponível.
        </p>
        <Button :disabled="rooms.length === 0" class="mt-6" variant="primary" @click="openCreateModal">
          <Plus class="h-4 w-4" />
          Nova reserva
        </Button>
      </div>
    </Card>

    <section v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card v-for="reservation in reservations" :key="reservation.id" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate text-base font-semibold text-ink-950">{{ reservation.title }}</p>
            <p class="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
              <DoorOpen class="h-4 w-4" />
              {{ getRoomName(reservation) }}
            </p>
          </div>

          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
          >
            <component :is="getStatusIcon(reservation.status)" class="h-5 w-5" />
          </span>
        </div>

        <div class="mt-6 space-y-3 rounded-lg border border-ink-100 bg-surface-50 p-4">
          <p class="flex items-center gap-2 text-sm text-ink-700">
            <Users class="h-4 w-4 text-ink-400" />
            {{ reservation.participants }} participantes
          </p>
          <p class="flex items-center gap-2 text-sm text-ink-700">
            <Clock3 class="h-4 w-4 text-ink-400" />
            {{ formatReservationPeriod(reservation.startsAt, reservation.endsAt) }}
          </p>
        </div>

        <div class="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
          <Badge :tone="getStatusTone(reservation.status)">
            {{ reservationStatusLabels[reservation.status] }}
          </Badge>

          <div class="flex items-center gap-2">
            <IconButton
              :label="`Editar ${reservation.title}`"
              size="sm"
              @click="openEditModal(reservation)"
            >
              <Pencil class="h-4 w-4" />
            </IconButton>
            <IconButton
              :label="`Excluir ${reservation.title}`"
              size="sm"
              tone="danger"
              @click="requestDelete(reservation)"
            >
              <Trash2 class="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </Card>
    </section>

    <Modal v-model="isFormModalOpen" :description="formDescription" :title="formTitle">
      <form class="space-y-5" novalidate @submit.prevent="submitReservation">
        <div
          v-if="formAlert"
          :class="[
            'flex items-start gap-3 rounded-lg border p-4 text-sm',
            formAlert.tone === 'conflict'
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-rose-200 bg-rose-50 text-rose-900',
          ]"
        >
          <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
          <p class="font-medium">{{ formAlert.message }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-ink-700" for="reservation-room">Sala</label>
          <select
            id="reservation-room"
            v-model="form.roomId"
            :aria-invalid="Boolean(formErrors.roomId)"
            :disabled="isSubmitting"
            class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
            @change="clearFormFeedback"
          >
            <option value="" disabled>Selecione uma sala</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }} · {{ formatCapacity(room.capacity) }}
            </option>
          </select>
          <p v-if="formErrors.roomId" class="mt-2 text-sm text-rose-600">
            {{ formErrors.roomId }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-ink-700" for="reservation-title">Título</label>
          <input
            id="reservation-title"
            v-model="form.title"
            :aria-invalid="Boolean(formErrors.title)"
            :disabled="isSubmitting"
            class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
            placeholder="Planejamento semanal"
            type="text"
            @input="clearFormFeedback"
          />
          <p v-if="formErrors.title" class="mt-2 text-sm text-rose-600">
            {{ formErrors.title }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-ink-700" for="reservation-participants">
            Participantes
          </label>
          <input
            id="reservation-participants"
            v-model.number="form.participants"
            :aria-invalid="Boolean(formErrors.participants)"
            :disabled="isSubmitting"
            class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
            min="1"
            step="1"
            type="number"
            @input="clearFormFeedback"
          />
          <p v-if="currentRoom" class="mt-2 text-xs text-ink-500">
            Capacidade da sala: {{ formatCapacity(currentRoom.capacity) }}.
          </p>
          <p v-if="formErrors.participants" class="mt-2 text-sm text-rose-600">
            {{ formErrors.participants }}
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="text-sm font-medium text-ink-700" for="reservation-starts-at">
              Início
            </label>
            <input
              id="reservation-starts-at"
              v-model="form.startsAt"
              :aria-invalid="Boolean(formErrors.startsAt)"
              :disabled="isSubmitting"
              class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
              type="datetime-local"
              @input="clearFormFeedback"
            />
            <p v-if="formErrors.startsAt" class="mt-2 text-sm text-rose-600">
              {{ formErrors.startsAt }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-ink-700" for="reservation-ends-at">Fim</label>
            <input
              id="reservation-ends-at"
              v-model="form.endsAt"
              :aria-invalid="Boolean(formErrors.endsAt)"
              :disabled="isSubmitting"
              class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
              type="datetime-local"
              @input="clearFormFeedback"
            />
            <p v-if="formErrors.endsAt" class="mt-2 text-sm text-rose-600">
              {{ formErrors.endsAt }}
            </p>
          </div>
        </div>

        <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            :disabled="isSubmitting"
            class="w-full sm:w-auto"
            type="button"
            variant="secondary"
            @click="isFormModalOpen = false"
          >
            Cancelar
          </Button>
          <Button :disabled="isSubmitting" class="w-full sm:w-auto" type="submit" variant="primary">
            <LoaderCircle v-if="isSubmitting" class="h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Salvando' : 'Salvar reserva' }}
          </Button>
        </div>
      </form>
    </Modal>

    <Modal
      v-model="isDeleteModalOpen"
      :description="
        reservationToDelete
          ? `Essa ação removerá ${reservationToDelete.title} da agenda.`
          : undefined
      "
      title="Excluir reserva"
    >
      <div class="space-y-5">
        <div class="flex items-start gap-4 rounded-lg border border-rose-100 bg-rose-50 p-4">
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-rose-600 shadow-soft"
          >
            <Trash2 class="h-5 w-5" />
          </span>
          <div>
            <p class="text-sm font-medium text-rose-950">Confirme a exclusão da reserva.</p>
            <p class="mt-1 text-sm leading-6 text-rose-700">
              A agenda será atualizada assim que o backend confirmar a remoção.
            </p>
          </div>
        </div>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            :disabled="isDeleting"
            class="w-full sm:w-auto"
            type="button"
            variant="secondary"
            @click="isDeleteModalOpen = false"
          >
            Cancelar
          </Button>
          <Button
            :disabled="isDeleting"
            class="w-full sm:w-auto"
            type="button"
            variant="danger"
            @click="confirmDelete"
          >
            <LoaderCircle v-if="isDeleting" class="h-4 w-4 animate-spin" />
            {{ isDeleting ? 'Excluindo' : 'Excluir reserva' }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
