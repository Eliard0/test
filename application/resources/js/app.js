import './bootstrap';
import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import "primeicons/primeicons.css";

import router from './router';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import InputMask from 'primevue/inputmask';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';

import ProducerIndex from './components/producer/ProducerForm.vue';
import ProducerForm from './components/producer/ProducerForm.vue';

import PropertyForm from './components/property/PropertyForm.vue';
import PropertyList from './components/property/PropertyList.vue';

import ProductionUnitForm from './components/production/ProductionUnitForm.vue';
import ProductionUnitList from './components/production/ProductionUnitList.vue';
import HerdList from './components/herd/HerdList.vue';
import HerdForm from './components/herd/HerdForm.vue';

const app = createApp({});

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router);
app.use(ConfirmationService);
app.use(ToastService);

app.component('v-DataTable', DataTable);
app.component('v-Column', Column);
app.component('v-Button', Button);
app.component('v-ConfirmDialog', ConfirmDialog);
app.component('v-Toast', Toast);
app.component('v-InputMask', InputMask);
app.component('v-Dialog', Dialog);
app.component('v-InputText', InputText);
app.component('v-Textarea', Textarea);
app.component('v-InputNumber', InputNumber);
app.component('v-Select', Select);

app.component('v-producers', ProducerIndex);
app.component('v-producer-form', ProducerForm);

app.component('v-property-list', PropertyList);
app.component('v-property-form', PropertyForm);

app.component('v-production-list', ProductionUnitList);
app.component('v-production-form', ProductionUnitForm);

app.component('v-herd-list', HerdList);
app.component('v-herd-form', HerdForm);



app.mount('#app');
