<template>
    <v-Dialog v-model:visible="display" :header="headerText" :modal="true" class="w-full max-w-2xl p-fluid">

        <div class="p-4 rounded-xl bg-gray-50">

            <div class="field flex items-center gap-4 mb-4">
                <label>Propriedade:</label>
                <v-Select
                    v-model="unitDataClone.property_id" 
                    :options="properties" 
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Selecione uma propriedade" 
                />
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="culture_name">Nome da Cultura:</label>
                <v-Select id="culture_name" v-model="unitDataClone.culture_name" required :options="cultureNameOptions"
                    :class="{ 'p-invalid': submitted && !unitDataClone.culture_name }" placeholder="Selecione" />

                <small class="p-error" v-if="submitted && !unitDataClone.culture_name">O nome da cultura é
                    obrigatório.</small>
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="total_area_ha">Área Total (ha):</label>
                <v-InputNumber id="total_area_ha" v-model="unitDataClone.total_area_ha" mode="decimal" :min="0"
                    :maxFractionDigits="4" required
                    :class="{ 'p-invalid': submitted && (unitDataClone.total_area_ha === null || unitDataClone.total_area_ha < 0) }" />
                <small class="p-error"
                    v-if="submitted && (unitDataClone.total_area_ha === null || unitDataClone.total_area_ha < 0)">A área
                    total é obrigatória e deve ser positiva.</small>
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="geographic_coordinates">Coordenadas Geográficas (Opcional):</label>
                <v-InputText id="geographic_coordinates" v-model="unitDataClone.geographic_coordinates" />
            </div>

        </div>

        <template #footer>
            <v-Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
            <v-Button label="Salvar" icon="pi pi-check" class="p-button-success" @click="saveUnit" />
        </template>
    </v-Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { IProductionUnit } from '../../services/useProductionUnits';
import { IProperty } from '../../services/useProperties';

const createDefaultUnit = (): IProductionUnit => ({
    culture_name: '',
    total_area_ha: null,
    geographic_coordinates: null,
    property_id: 0,
});

const cultureNameOptions = ref([
    'Laranja Pera',
    'Melancia Crimson Sweet',
    'Goiaba Paluma'
]);

const props = defineProps<{
    display: boolean;
    unitData: IProductionUnit | null;
    producerId: number;
  properties: IProperty[];
}>();

const emit = defineEmits<{
    (e: 'update:display', value: boolean): void;
    (e: 'saved', unit: IProductionUnit): void;
}>();

const unitDataClone = ref<IProductionUnit>(createDefaultUnit());
const submitted = ref(false);


const headerText = computed(() =>
    props.unitData?.id ? 'Editar Unidade de Produção' : 'Nova Unidade de Produção'
);

watch(() => props.unitData, (newUnit) => {
    if (newUnit) {
        unitDataClone.value = { ...newUnit };
        submitted.value = false;
    } else {
        unitDataClone.value = createDefaultUnit();
        submitted.value = false;
    }
}, { immediate: true });

const display = computed({
    get: () => props.display,
    set: (value) => emit('update:display', value)
});

const closeDialog = () => {
    display.value = false;
    submitted.value = false;
};

const saveUnit = () => {
    submitted.value = true;

    const unit = unitDataClone.value as IProductionUnit;

    if (unit.culture_name && unit.total_area_ha !== null && unit.total_area_ha >= 0) {
        emit('saved', unit);
    }
};

</script>