import { createRouter, createWebHistory } from 'vue-router';

import ProducerIndex from './components/producers/ProducerIndex.vue'

const routes = [
    { path: '/', redirect: '/producers' },
    
    { 
        path: '/producers', 
        component: ProducerIndex, 
        name: 'producers.index' 
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