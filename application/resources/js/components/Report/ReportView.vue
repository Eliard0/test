<template>
    <div class="report-page p-6">
        <div class="mb-5 ml-3 flex justify-start">
            <v-Button label="Voltar" icon="pi pi-arrow-left" class="p-button-secondary" @click="goBack" />
        </div>
        <h1 class="text-2xl font-bold mb-4">Relatórios</h1>

        <div class="flex items-center gap-4 mb-6">
            <select v-model="selectedProducer" class="border p-2 rounded">
                <option value="">Todos os produtores</option>
                <option v-for="p in producers" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
            <button @click="loadReports" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Pesquisar
            </button>
        </div>

        <div v-if="loading">Carregando relatórios...</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 border rounded shadow">
                <h2 class="font-semibold mb-2">Propriedades por Município</h2>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left">Município</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reports.propertiesByMunicipality" :key="item.municipality">
                            <td>{{ item.municipality }}</td>
                            <td class="text-right">{{ item.total }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="p-4 border rounded shadow">
                <h2 class="font-semibold mb-2">Animais por Espécie</h2>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left">Espécie</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reports.animalsBySpecies" :key="item.species">
                            <td>{{ item.species }}</td>
                            <td class="text-right">{{ item.total }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="p-4 border rounded shadow">
                <h2 class="font-semibold mb-2">Hectares por Cultura</h2>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left">Cultura</th>
                            <th class="text-right">Hectares</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reports.hectaresByCrop" :key="item.crop">
                            <td>{{ item.crop }}</td>
                            <td class="text-right">{{ item.total_hectares }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReports } from '../../services/useReports';
import axios from 'axios';

const router = useRouter();

const { reports, loading, fetchReports } = useReports();

const producers = ref<{ id: number; name: string }[]>([]);
const selectedProducer = ref<string | null>(null);

const loadProducers = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/producers');
        producers.value = response.data.data || response.data;
    } catch (error) {
        console.error('Erro ao carregar produtores:', error);
    }
};

const loadReports = async () => {
    await fetchReports(selectedProducer.value ? Number(selectedProducer.value) : null);
};

onMounted(() => {
    loadProducers();
    loadReports();
});

const goBack = () => {
    router.push({ name: 'producers.index' });
};
</script>

<style scoped>
.report-page table {
    border-collapse: collapse;
    width: 100%;
}

.report-page th,
.report-page td {
    padding: 0.4rem 0.6rem;
}
</style>