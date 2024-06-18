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
import VueCountdown from '@chenfengyuan/vue-countdown';
import Select2 from 'vue3-select2-component';

import { VueSignalR } from '@dreamonkey/vue-signalr';
import { HubConnectionBuilder } from '@microsoft/signalr';


// Create your connection
// See https://docs.microsoft.com/en-us/javascript/api/@microsoft/signalr/hubconnectionbuilder
const connection = new HubConnectionBuilder()
  .withUrl(process.env.VUE_APP_FETCH_ORDER_HUB, { withCredentials: false })
  .build();

const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.component('Select2', Select2)
app.component(VueCountdown.name, VueCountdown);
app.use(router);
app.use(VueSignalR, {connection})
app.use(i18n);
app.use(ElementPlus);
app.mount('#app');
