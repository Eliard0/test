<template>
    <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-7xl mx-auto my-8">

        <div v-if="!currentProducerId">
            <h2 class="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">Gestão de Produtores Rurais</h2>

            <div class="flex justify-end mb-4">
                <v-Button label="Novo Produtor" icon="pi pi-plus" class="p-button-success p-button-lg p-3"
                    @click="openNew" />
            </div>

            <v-DataTable :value="producers" class="p-datatable-gridlines">
                <v-Column field="name" header="Nome"></v-Column>
                <v-Column field="cpf_cnpj" header="CPF/CNPJ"></v-Column>
                <v-Column field="phone" header="Telefone"></v-Column>
                <v-Column field="email" header="Email"></v-Column>
                <v-Column header="Ações">
                    <template #body="slotProps">
                        <div class="flex justify-center gap-2">
                            <v-Button icon="pi pi-info-circle" label="Detalhes"
                                class="p-button-rounded p-button-info p-button-sm"
                                @click="goToDetails(slotProps.data.id)" />

                        </div>
                    </template>
                </v-Column>
                <template #empty>
                    <p class="text-center p-4 text-gray-500">Nenhum produtor encontrado.</p>
                </template>
                <template #loading>
                    <p class="text-center p-4 text-blue-600">Carregando dados dos produtores. Por favor, aguarde...</p>
                </template>
            </v-DataTable>
        </div>

        <ProducerForm v-model:display="producerDialog" :producerData="producer" @saved="handleSaved" />
        <v-ConfirmDialog></v-ConfirmDialog>
        <v-Toast />
        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProducers, IProducer } from '../../services/useProducers';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ProducerForm from './ProducerForm.vue';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const {
    producers,
    producerDialog,
    producer,
    handleSaved,
    openNew,
} = useProducers(confirm, toast);

const currentProducerId = ref<number | null>(null);

const goToDetails = (id: number) => {
  router.push({ name: 'producers.details', params: { id } });
};

</script>