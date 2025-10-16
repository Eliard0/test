import './bootstrap';
import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import "@primevue/themes/aura";
import "primeicons/primeicons.css";

import router from './router';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import ProducerIndex from './components/producers/ProducerForm.vue';
import ProducerForm from './components/producers/ProducerForm.vue';

const app = createApp({});

app.use(PrimeVue);
app.use(router);
app.use(ConfirmationService);
app.use(ToastService);

app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);

app.component('v-producers', ProducerIndex);
app.component('v-producer-form', ProducerForm);

app.mount('#app');
