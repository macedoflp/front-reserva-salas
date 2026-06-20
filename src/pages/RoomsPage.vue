<script setup lang="ts">
import {
  AlertCircle,
  CalendarClock,
  DoorOpen,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Users,
} from '@lucide/vue';
import { computed, onMounted, reactive, ref } from 'vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import IconButton from '@/components/ui/IconButton.vue';
import Modal from '@/components/ui/Modal.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import { createRoom, deleteRoom, listRooms, updateRoom } from '@/services/rooms.service';
import { useAppStore } from '@/stores/app';
import type { CreateRoomPayload, Room } from '@/types';
import { formatCapacity, formatDateTime } from '@/utils';

interface RoomForm {
  capacity: number | null;
  name: string;
}

interface RoomFormErrors {
  capacity: string;
  name: string;
}

const appStore = useAppStore();

const rooms = ref<Room[]>([]);
const editingRoom = ref<Room | null>(null);
const roomToDelete = ref<Room | null>(null);
const isDeleteModalOpen = ref(false);
const isFormModalOpen = ref(false);
const isDeleting = ref(false);
const isLoading = ref(true);
const isRefreshing = ref(false);
const isSubmitting = ref(false);
const loadError = ref<string | null>(null);

const form = reactive<RoomForm>({
  capacity: 1,
  name: '',
});

const formErrors = reactive<RoomFormErrors>({
  capacity: '',
  name: '',
});

const sortedRooms = computed(() =>
  [...rooms.value].sort((firstRoom, secondRoom) => firstRoom.name.localeCompare(secondRoom.name)),
);

const totalCapacity = computed(() =>
  rooms.value.reduce((total, room) => total + room.capacity, 0),
);

const formTitle = computed(() => (editingRoom.value ? 'Editar sala' : 'Nova sala'));
const formDescription = computed(() =>
  editingRoom.value
    ? 'Atualize os dados principais desta sala.'
    : 'Cadastre uma sala disponível para futuras reservas.',
);

const roomsCountLabel = computed(() => {
  const count = rooms.value.length;

  return `${count} ${count === 1 ? 'sala' : 'salas'}`;
});

onMounted(() => {
  void fetchRooms();
});

async function fetchRooms(options: { silent?: boolean } = {}): Promise<void> {
  if (options.silent) {
    isRefreshing.value = true;
  } else {
    isLoading.value = true;
  }

  try {
    rooms.value = await listRooms();
    loadError.value = null;
  } catch (error) {
    loadError.value = getErrorMessage(error);
    appStore.addToast({
      message: loadError.value,
      title: 'Falha ao carregar salas',
      variant: 'error',
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
}

function openCreateModal(): void {
  editingRoom.value = null;
  resetForm();
  isFormModalOpen.value = true;
}

function openEditModal(room: Room): void {
  editingRoom.value = room;
  resetForm(room);
  isFormModalOpen.value = true;
}

function requestDelete(room: Room): void {
  roomToDelete.value = room;
  isDeleteModalOpen.value = true;
}

async function submitRoom(): Promise<void> {
  if (!validateForm()) {
    return;
  }

  const payload: CreateRoomPayload = {
    capacity: Number(form.capacity),
    name: form.name.trim(),
  };

  isSubmitting.value = true;

  try {
    if (editingRoom.value) {
      const updatedRoom = await updateRoom(editingRoom.value.id, payload);
      rooms.value = rooms.value.map((room) => (room.id === updatedRoom.id ? updatedRoom : room));
      appStore.addToast({
        message: `${updatedRoom.name} foi atualizada.`,
        title: 'Sala atualizada',
        variant: 'success',
      });
    } else {
      const createdRoom = await createRoom(payload);
      rooms.value = [createdRoom, ...rooms.value];
      appStore.addToast({
        message: `${createdRoom.name} foi cadastrada.`,
        title: 'Sala criada',
        variant: 'success',
      });
    }

    isFormModalOpen.value = false;
    editingRoom.value = null;
    resetForm();
  } catch (error) {
    appStore.addToast({
      message: getErrorMessage(error),
      title: editingRoom.value ? 'Falha ao atualizar sala' : 'Falha ao criar sala',
      variant: 'error',
    });
  } finally {
    isSubmitting.value = false;
  }
}

async function confirmDelete(): Promise<void> {
  if (!roomToDelete.value) {
    return;
  }

  const room = roomToDelete.value;
  isDeleting.value = true;

  try {
    await deleteRoom(room.id);
    rooms.value = rooms.value.filter((item) => item.id !== room.id);
    appStore.addToast({
      message: `${room.name} foi removida.`,
      title: 'Sala excluída',
      variant: 'success',
    });
    isDeleteModalOpen.value = false;
    roomToDelete.value = null;
  } catch (error) {
    appStore.addToast({
      message: getErrorMessage(error),
      title: 'Falha ao excluir sala',
      variant: 'error',
    });
  } finally {
    isDeleting.value = false;
  }
}

function resetForm(room?: Room): void {
  form.name = room?.name ?? '';
  form.capacity = room?.capacity ?? 1;
  clearFormErrors();
}

function clearFormErrors(): void {
  formErrors.name = '';
  formErrors.capacity = '';
}

function validateForm(): boolean {
  clearFormErrors();

  if (!form.name.trim()) {
    formErrors.name = 'Informe o nome da sala.';
  }

  const capacity = Number(form.capacity);

  if (!Number.isInteger(capacity) || capacity <= 0) {
    formErrors.capacity = 'Informe uma capacidade inteira maior que zero.';
  }

  return !formErrors.name && !formErrors.capacity;
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
        <h2 class="text-xl font-semibold tracking-tight text-ink-950">Salas</h2>
        <p class="mt-1 text-sm text-ink-500">Gerencie ambientes, capacidades e disponibilidade.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Button
          :disabled="isRefreshing || isLoading"
          variant="secondary"
          @click="fetchRooms({ silent: true })"
        >
          <RefreshCcw :class="['h-4 w-4', isRefreshing ? 'animate-spin' : '']" />
          Atualizar
        </Button>
        <Button variant="primary" @click="openCreateModal">
          <Plus class="h-4 w-4" />
          Nova sala
        </Button>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card>
        <p class="text-sm font-medium text-ink-500">Total de salas</p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold tracking-tight text-ink-950">{{ rooms.length }}</p>
          <Badge tone="neutral">{{ roomsCountLabel }}</Badge>
        </div>
      </Card>

      <Card>
        <p class="text-sm font-medium text-ink-500">Capacidade total</p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold tracking-tight text-ink-950">{{ totalCapacity }}</p>
          <Badge tone="brand">{{ formatCapacity(totalCapacity) }}</Badge>
        </div>
      </Card>

      <Card class="sm:col-span-2 xl:col-span-1">
        <p class="text-sm font-medium text-ink-500">Status</p>
        <div class="mt-3 flex items-end justify-between gap-3">
          <p class="text-3xl font-semibold tracking-tight text-ink-950">
            {{ isLoading ? '-' : 'Ativo' }}
          </p>
          <Badge :tone="loadError ? 'warning' : 'success'">
            {{ loadError ? 'Atenção' : 'Operacional' }}
          </Badge>
        </div>
      </Card>
    </section>

    <section v-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card v-for="item in 6" :key="item" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div class="w-full space-y-3">
            <Skeleton class="h-5 w-2/3" />
            <Skeleton class="h-4 w-1/2" />
          </div>
          <Skeleton class="h-10 w-10 shrink-0" />
        </div>
        <div class="mt-7 space-y-3">
          <Skeleton class="h-4 w-3/5" />
          <Skeleton class="h-4 w-2/5" />
        </div>
        <div class="mt-7 flex justify-end gap-2 border-t border-ink-100 pt-4">
          <Skeleton class="h-9 w-9" />
          <Skeleton class="h-9 w-9" />
        </div>
      </Card>
    </section>

    <Card v-else-if="loadError && rooms.length === 0" padding="lg">
      <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-4">
          <span
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700"
          >
            <AlertCircle class="h-5 w-5" />
          </span>
          <div>
            <h3 class="text-base font-semibold text-ink-950">Não foi possível carregar as salas</h3>
            <p class="mt-1 text-sm leading-6 text-ink-500">{{ loadError }}</p>
          </div>
        </div>

        <Button variant="secondary" @click="fetchRooms">
          <RefreshCcw class="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </Card>

    <Card v-else-if="rooms.length === 0" padding="lg">
      <div class="mx-auto flex max-w-md flex-col items-center py-8 text-center">
        <span
          class="inline-flex h-12 w-12 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
        >
          <DoorOpen class="h-6 w-6" />
        </span>
        <h3 class="mt-5 text-base font-semibold text-ink-950">Nenhuma sala cadastrada</h3>
        <p class="mt-2 text-sm leading-6 text-ink-500">
          Cadastre a primeira sala para começar a organizar reservas.
        </p>
        <Button class="mt-6" variant="primary" @click="openCreateModal">
          <Plus class="h-4 w-4" />
          Nova sala
        </Button>
      </div>
    </Card>

    <section v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card v-for="room in sortedRooms" :key="room.id" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate text-base font-semibold text-ink-950">{{ room.name }}</p>
            <p class="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
              <CalendarClock class="h-4 w-4" />
              {{ formatDateTime(room.updatedAt) }}
            </p>
          </div>

          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink-200 bg-surface-50 text-ink-700"
          >
            <DoorOpen class="h-5 w-5" />
          </span>
        </div>

        <div class="mt-7 rounded-lg border border-ink-100 bg-surface-50 p-4">
          <p class="text-sm font-medium text-ink-500">Capacidade</p>
          <p class="mt-2 flex items-center gap-2 text-2xl font-semibold text-ink-950">
            <Users class="h-5 w-5 text-ink-400" />
            {{ room.capacity }}
          </p>
          <p class="mt-1 text-sm text-ink-500">{{ formatCapacity(room.capacity) }}</p>
        </div>

        <div class="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
          <Badge tone="success">Disponível</Badge>
          <div class="flex items-center gap-2">
            <IconButton :label="`Editar ${room.name}`" size="sm" @click="openEditModal(room)">
              <Pencil class="h-4 w-4" />
            </IconButton>
            <IconButton
              :label="`Excluir ${room.name}`"
              size="sm"
              tone="danger"
              @click="requestDelete(room)"
            >
              <Trash2 class="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </Card>
    </section>

    <Modal v-model="isFormModalOpen" :description="formDescription" :title="formTitle">
      <form class="space-y-5" novalidate @submit.prevent="submitRoom">
        <div>
          <label class="text-sm font-medium text-ink-700" for="room-name">Nome</label>
          <input
            id="room-name"
            v-model="form.name"
            :disabled="isSubmitting"
            :aria-invalid="Boolean(formErrors.name)"
            class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
            placeholder="Sala Reunião 1"
            type="text"
            @input="formErrors.name = ''"
          />
          <p v-if="formErrors.name" class="mt-2 text-sm text-rose-600">{{ formErrors.name }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-ink-700" for="room-capacity">Capacidade</label>
          <input
            id="room-capacity"
            v-model.number="form.capacity"
            :disabled="isSubmitting"
            :aria-invalid="Boolean(formErrors.capacity)"
            class="mt-2 h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50"
            min="1"
            step="1"
            type="number"
            @input="formErrors.capacity = ''"
          />
          <p v-if="formErrors.capacity" class="mt-2 text-sm text-rose-600">
            {{ formErrors.capacity }}
          </p>
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
            {{ isSubmitting ? 'Salvando' : 'Salvar sala' }}
          </Button>
        </div>
      </form>
    </Modal>

    <Modal
      v-model="isDeleteModalOpen"
      :description="roomToDelete ? `Essa ação removerá ${roomToDelete.name}.` : undefined"
      title="Excluir sala"
    >
      <div class="space-y-5">
        <div class="flex items-start gap-4 rounded-lg border border-rose-100 bg-rose-50 p-4">
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-rose-600 shadow-soft"
          >
            <Trash2 class="h-5 w-5" />
          </span>
          <div>
            <p class="text-sm font-medium text-rose-950">Confirme a exclusão da sala.</p>
            <p class="mt-1 text-sm leading-6 text-rose-700">
              Reservas vinculadas podem impedir a remoção pelo backend.
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
            {{ isDeleting ? 'Excluindo' : 'Excluir sala' }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
