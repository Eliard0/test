<template>
    <v-Dialog :visible="props.display" modal @update:visible="$emit('update:display', $event)"
        :header="isEdit ? 'Editar Registro de Rebanho' : 'Novo Registro de Rebanho'" :style="{ width: '40rem' }"
        :breakpoints="{ '1199px': '75vw', '576px': '90vw' }">
        <form @submit.prevent="saveHerd" class="p-fluid">

            <div class="field mb-4">
                <label for="property" class="font-semibold">Propriedade</label>
                <v-Select id="property" v-model="herdDataClone.property_id" :options="propertyOptions"
                    option-label="name" option-value="id" placeholder="Selecione uma propriedade" required
                    class="w-full" />
            </div>

            <div class="field mb-4">
                <label for="species" class="font-semibold">Espécie</label>
                <v-Select id="species" v-model="herdDataClone.species" :options="herdSpeciesOptions"
                    placeholder="Selecione uma espécie" required autofocus class="w-full" />
            </div>

            <div class="field mb-4">
                <label for="quantity" class="font-semibold">Quantidade de Cabeças</label>
                <v-InputNumber id="quantity" v-model="herdDataClone.quantity" inputId="quantity" mode="decimal" :min="1"
                    :max-fraction-digits="0" required class="w-full" />
            </div>

            <div class="field mb-4">
                <label for="purpose" class="font-semibold">Propósito</label>
                <v-InputText id="purpose" v-model="herdDataClone.purpose" required
                    placeholder="Ex: Corte, Leite, Reprodução" class="w-full" />
            </div>

            <div class="field mb-4">
                <label for="date_update" class="font-semibold">Data da Última Atualização</label>
                <v-InputText id="date_update" type="date" v-model="herdDataClone.date_update" required class="w-full" />
            </div>

            <div class="flex justify-end pt-4 border-t mt-6">
                <v-Button label="Cancelar" icon="pi pi-times" class="p-button-secondary p-button-text mr-2"
                    @click="$emit('update:display', false)" type="button" />
                <v-Button :label="isEdit ? 'Salvar Alterações' : 'Adicionar Rebanho'" icon="pi pi-check" type="submit"
                    :loading="saving" />
            </div>
        </form>
    </v-Dialog>
</template>


<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { IHerd, useHerds } from '../../services/useHerds';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { IProperty } from '../../services/useProperties';

const props = defineProps<{
    display: boolean;
    herdData: IHerd | null;
    loading?: boolean;
    propertyId: number;
    properties: IProperty[];
}>();

const emit = defineEmits<{
    (e: 'update:display', value: boolean): void;
    (e: 'saved', unit: IHerd): void;
}>();

const toast = useToast();
const confirm = useConfirm();
const { handleSavedHerd } = useHerds(confirm as any, toast as any);

const propertyOptions = computed(() => props.properties || []);
const herdSpeciesOptions = ref(['Bovinos', 'Suínos', 'Caprinos']);

const herdDataClone = ref<IHerd>({
    species: '',
    quantity: 1,
    purpose: '',
    date_update: new Date().toISOString().split('T')[0],
    property_id: props.propertyId,
});

const saving = ref(false);
const isEdit = computed(() => !!herdDataClone.value.id);

watch(() => props.herdData, (newVal) => {
    herdDataClone.value = newVal ? { ...newVal } : {
        species: '',
        quantity: 1,
        purpose: '',
        date_update: new Date().toISOString().split('T')[0],
        property_id: props.propertyId,
    };
}, { immediate: true });

const saveHerd = async () => {
    if (saving.value) return;

    if (!herdDataClone.value.species || herdDataClone.value.quantity <= 0 || !herdDataClone.value.purpose) {
        toast.add({ severity: 'error', summary: 'Aviso', detail: 'Preencha todos os campos obrigatórios.', life: 3000 });
        return;
    }

    saving.value = true;
    try {
        await handleSavedHerd(herdDataClone.value);
        emit('saved', herdDataClone.value);
    } catch (e) {
        console.error('Erro ao salvar o rebanho:', e);
    } finally {
        saving.value = false;
    }
};
</script>
