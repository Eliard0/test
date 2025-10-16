<template>
    <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-7xl mx-auto my-8">
        
        <div v-if="!currentProducerId">
            <h2 class="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">Gestão de Produtores Rurais</h2>
            
            <div class="flex justify-end mb-4">
                <Button label="Novo Produtor" icon="pi pi-plus" class="p-button-success p-button-lg" @click="openNew" />
            </div>
  
            <DataTable 
                :value="producers" 
                responsiveLayout="scroll" 
                :paginator="true" 
                :rows="10" 
                :loading="loading"
                class="p-datatable-gridlines"
            >
                <Column field="name" header="Nome" :sortable="true"></Column>
                <Column field="cpf_cnpj" header="CPF/CNPJ"></Column>
                <Column field="phone" header="Telefone"></Column>
                <Column field="email" header="Email"></Column>
                <Column header="Ações" style="width: 250px">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-button-sm" @click="editProducer(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" @click="confirmDeleteProducer(slotProps.data)" />
                        </div>
                    </template>
                </Column>
                <template #empty>
                    <p class="text-center p-4 text-gray-500">Nenhum produtor encontrado.</p>
                </template>
                <template #loading>
                    <p class="text-center p-4 text-blue-600">Carregando dados dos produtores. Por favor, aguarde.</p>
                </template>
            </DataTable>
        </div>
  
        <ProducerForm v-model:display="producerDialog" :producerData="producer" @saved="handleSaved" />
        <ConfirmDialog></ConfirmDialog>
        <Toast />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useProducers, IProducer } from '../../services/useProducers';
  import { useConfirm } from 'primevue/useconfirm';
  import { useToast } from 'primevue/usetoast';
  import ProducerForm from './ProducerForm.vue';
  
  const confirm = useConfirm();
  const toast = useToast();
  
  const {
    producers,
    producerDialog,
    producer,
    loading,
    handleSaved,
    confirmDeleteProducer,
    openNew,
    editProducer
  } = useProducers(confirm, toast);
  
  const currentProducerId = ref<number | null>(null);
  
  </script>
  