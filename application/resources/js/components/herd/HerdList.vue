<template>
    <div>
        <div v-if="loading" class="text-center p-4 text-blue-600">
            Carregando registros de rebanho...
        </div>

        <div v-else-if="!herds || herds.length === 0" class="text-center p-4 text-gray-500">
            Nenhum registro de rebanho para esta propriedade.
        </div>

        <v-DataTable v-else :value="herds" class="p-datatable-gridlines">
            <v-Column field="property.name" header="Propriedade">
                <template #body="slotProps">
                    {{ slotProps.data.property?.name || '—' }}
                </template>
            </v-Column>
            <v-Column field="species" header="Espécie"></v-Column>
            <v-Column field="purpose" header="Propósito"></v-Column>
            <v-Column field="quantity" header="Quantidade">
                <template #body="slotProps">
                    {{ slotProps.data.quantity.toLocaleString('pt-BR') }} cabeças
                </template>
            </v-Column>
            <v-Column field="date_update" header="Última Atualização">
                <template #body="slotProps">
                    {{ new Date(slotProps.data.date_update).toLocaleDateString('pt-BR') }}
                </template>
            </v-Column>

            <v-Column header="Ações" :exportable="false" style="min-width: 8rem">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <v-Button icon="pi pi-pencil" class="p-button-sm p-button-warning"
                            @click="$emit('editHerd', slotProps.data)" />

                        <v-Button icon="pi pi-trash" class="p-button-sm p-button-danger"
                            @click="$emit('deleteHerd', slotProps.data)" />

                    </div>
                </template>
            </v-Column>
        </v-DataTable>
    </div>
</template>

<script setup lang="ts">
import { IHerd } from '../../services/useHerds';

const props = defineProps<{
    herds: IHerd[] | null;
    loading: boolean;
}>();

const emit = defineEmits<{
    (e: 'editHerd', herd: IHerd): void;
    (e: 'deleteHerd', herd: IHerd): void;
}>();
</script>