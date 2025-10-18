<template>
    <v-Dialog 
        :visible="display" 
        :header="headerTitle" 
        modal 
        class="w-full max-w-xl p-fluid"
        @update:visible="closeDialog"
    >

        <div class="p-4 rounded-xl bg-gray-50">

            <div class="field flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold text-gray-700 w-1/4 text-right">Nome:</label>
                <v-InputText id="name" v-model="propertyModel.name" required autofocus class="flex-grow w-full" />
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="area_total" class="font-semibold text-gray-700 w-1/4 text-right">Área Total (ha):</label>
                <v-InputText id="area_total" v-model.number="propertyModel.area_total" type="number" required
                    class="flex-grow w-full" />
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="state_registration" class="font-semibold text-gray-700 w-1/4 text-right">Inscrição Est.:</label>
                <v-InputText id="state_registration" v-model="propertyModel.state_registration" required class="flex-grow w-full" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="field flex items-center gap-4 mb-4 col-span-1">
                    <label for="municipality" class="font-semibold text-gray-700 w-1/2 text-right">Município:</label>
                    <v-InputText id="municipality" v-model="propertyModel.municipality" required class="flex-grow w-full" />
                </div>

                <div class="field flex items-center gap-4 mb-4 col-span-1">
                    <label for="uf" class="font-semibold text-gray-700 w-1/3 text-right">UF:</label>
                    <v-InputText id="uf" v-model="propertyModel.uf" required maxlength="2" class="flex-grow w-full" />
                </div>
            </div>
            
            <input type="hidden" v-model="propertyModel.producer_id">

        </div>

        <template #footer>
            <v-Button label="Cancelar" icon="pi pi-times" severity="secondary" text @click="closeDialog" />
            <v-Button label="Salvar Propriedade" icon="pi pi-check" severity="success" @click="saveForm" />
        </template>
    </v-Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { IProperty } from '../../services/useProperties';

const props = defineProps<{
    display: boolean;
    propertyData: IProperty | null;
}>();

const emit = defineEmits<{
    (e: 'update:display', value: boolean): void;
    (e: 'saved', value: IProperty): void;
}>();

const initialPropertyState: IProperty = {
    id: undefined,
    name: '',
    municipality: '',
    uf: '',
    state_registration: null,
    area_total: 0,
    producer_id: 0,
};

const propertyModel = ref<IProperty>({ ...initialPropertyState });

watch(
    () => props.propertyData,
    (newData) => {
        if (newData) {
            propertyModel.value = { ...newData };
        } else {
            propertyModel.value = { ...initialPropertyState };
        }
    },
    { immediate: true }
);

const headerTitle = computed(() =>
    props.propertyData?.id ? 'Editar Propriedade' : 'Nova Propriedade'
);

const closeDialog = () => {
    emit('update:display', false);
};

const saveForm = () => {
    if (!propertyModel.value.name || !propertyModel.value.municipality || !propertyModel.value.uf || !propertyModel.value.area_total) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome, Área, Município e UF).');
        return;
    }
    
    if (!propertyModel.value.producer_id) {
        alert('Erro: Produtor não vinculado. Recarregue a página.');
        return;
    }

    emit('saved', propertyModel.value);
};
</script>