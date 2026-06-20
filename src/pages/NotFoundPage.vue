<script setup lang="ts">
import { Home } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/Button.vue';
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-surface-50 px-6">
    <section class="w-full max-w-md text-center">
      <p class="text-sm font-medium text-ink-500">404</p>
      <h1 class="mt-3 text-2xl font-semibold text-ink-950">Página não encontrada</h1>
      <p class="mt-3 text-sm leading-6 text-ink-500">
        O endereço acessado não corresponde a uma área disponível do sistema.
      </p>
      <RouterLink class="mt-6 inline-flex" to="/dashboard">
        <Button variant="primary">
          <Home class="h-4 w-4" />
          Dashboard
        </Button>
      </RouterLink>
    </section>
  </main>
</template>
