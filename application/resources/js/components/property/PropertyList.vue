<template>
    <div>
        <div v-if="!properties || properties.length === 0" class="text-center p-4 text-gray-500">
            Nenhuma propriedade registrada para este produtor.
        </div>
        
        <v-DataTable v-else :value="properties" class="p-datatable-gridlines">
            <v-Column field="name" header="Nome"></v-Column>
            <v-Column field="area_total" header="Área (ha)"></v-Column>
            <v-Column field="municipality" header="Município/UF">
                <template #body="slotProps">
                    {{ slotProps.data.municipality }}/{{ slotProps.data.uf }}
                </template>
            </v-Column>
            <v-Column field="state_registration" header="Inscrição Est."></v-Column>
            
            <v-Column header="Ações">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <v-Button 
                            icon="pi pi-pencil" 
                            class="p-button-sm p-button-warning" 
                            @click="$emit('editProperty', slotProps.data)" 
                        />
                        
                        <v-Button 
                            icon="pi pi-trash" 
                            class="p-button-sm p-button-danger" 
                            @click="$emit('deleteProperty', slotProps.data)" 
                        />
                        
                        </div>
                </template>
            </v-Column>
        </v-DataTable>
    </div>
</template>

<script setup lang="ts">
import { IProperty } from '../../services/useProperties';

const props = defineProps<{
    properties: IProperty[];
}>();

const emit = defineEmits<{
    (e: 'editProperty', property: IProperty): void;
    (e: 'deleteProperty', property: IProperty): void;
}>();
</script>