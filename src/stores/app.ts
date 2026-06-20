import { defineStore } from 'pinia';
import type { ApiClientError } from '@/types';

interface AppState {
  apiError: ApiClientError | null;
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    apiError: null,
    isMobileSidebarOpen: false,
    isSidebarCollapsed: false,
  }),
  actions: {
    clearApiError() {
      this.apiError = null;
    },
    closeMobileSidebar() {
      this.isMobileSidebarOpen = false;
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

