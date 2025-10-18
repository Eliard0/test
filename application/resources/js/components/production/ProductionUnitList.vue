<template>
    <div class="production-unit-list">

        <v-DataTable :value="productionUnits" class="p-datatable-gridlines" dataKey="id">

            <v-Column field="propertyName" header="Propriedade">
                <template #body="slotProps">
                    {{ slotProps.data.propertyName }}
                </template>
            </v-Column>

            <v-Column field="culture_name" header="Cultura"></v-Column>
            <v-Column field="total_area_ha" header="Área (ha)">
                <template #body="slotProps">
                    {{ (Number(slotProps.data.total_area_ha) || 0).toFixed(2) }} ha
                </template>
            </v-Column>
            <v-Column field="geographic_coordinates" header="Coordenadas"></v-Column>

            <v-Column header="Ações" :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <v-Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-button-sm" label="Editar"
                            @click="$emit('editUnit', slotProps.data)" />
                        <v-Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm"
                            label="Excluir" @click="$emit('deleteUnit', slotProps.data)" />
                    </div>
                </template>
            </v-Column>

            <template #empty>
                <p class="text-center p-4 text-gray-500">Nenhuma unidade de produção encontrada.</p>
            </template>

            <template #loading>
                <p class="text-center p-4 text-blue-600">Carregando unidades de produção. Por favor, aguarde...</p>
            </template>

        </v-DataTable>


    </div>
</template>

<script setup lang="ts">
import { IProductionUnit } from '../../services/useProductionUnits';

const props = defineProps<{
    productionUnits: IProductionUnit[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'editUnit', unit: IProductionUnit): void;
    (e: 'deleteUnit', unit: IProductionUnit): void;
}>();

</script>