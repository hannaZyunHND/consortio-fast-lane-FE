import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueDatePicker from '@vuepic/vue-datepicker';
import ElementPlus from 'element-plus'; // Import Element Plus
import i18n from './i18n'; // Import tệp i18n.js đã tạo trước đó

import '@vuepic/vue-datepicker/dist/main.css';
import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primevue/resources/primevue.min.css'; // Import PrimeVue CSS
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS

const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.use(router);
app.mount('#app');
app.use(i18n);
app.use(ElementPlus);