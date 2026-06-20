import { defineStore } from 'pinia';
import type { ApiClientError } from '@/types';

export type ToastVariant = 'error' | 'info' | 'success';

export interface AppToast {
  id: string;
  message: string;
  title: string;
  variant: ToastVariant;
}

interface AppState {
  apiError: ApiClientError | null;
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toasts: AppToast[];
}

function createToastId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    apiError: null,
    isMobileSidebarOpen: false,
    isSidebarCollapsed: false,
    toasts: [],
  }),
  actions: {
    addToast(toast: Omit<AppToast, 'id'>) {
      const id = createToastId();

      this.toasts.push({
        id,
        ...toast,
      });

      window.setTimeout(() => {
        this.dismissToast(id);
      }, 4200);
    },
    clearApiError() {
      this.apiError = null;
    },
    closeMobileSidebar() {
      this.isMobileSidebarOpen = false;
    },
    dismissToast(id: string) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    },
    openMobileSidebar() {
      this.isMobileSidebarOpen = true;
    },
    setApiError(error: ApiClientError) {
      this.apiError = error;
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
});
