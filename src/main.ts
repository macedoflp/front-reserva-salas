import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setApiErrorHandler } from './services/http';
import { useAppStore } from './stores/app';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

setApiErrorHandler((error) => {
  useAppStore().setApiError(error);
});

app.mount('#app');

