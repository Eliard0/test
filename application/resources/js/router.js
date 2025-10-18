import { createRouter, createWebHistory } from 'vue-router';

import ProducerIndex from './components/producer/ProducerIndex.vue'
import ProducerDetails from './components/producer/ProducerDetail.vue';
import ReportView from './components/Report/ReportView.vue';

const routes = [
    { path: '/', redirect: '/producers' },

    {
        path: '/producers',
        component: ProducerIndex,
        name: 'producers.index'
    },

    {
        path: '/producers/:id',
        name: 'producers.details',
        component: ProducerDetails,
        props: true,
    },

    {
        path: '/reports',
        name: 'reports',
        component: ReportView
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: { template: '<div>404 - Página não encontrada.</div>' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;