<template>
    <div>
        <div class="mt-3 ml-3 flex justify-start">
            <v-Button label="Voltar" icon="pi pi-arrow-left" class="p-button-secondary" @click="goBack" />
        </div>
        <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-10">

            <div class="flex justify-between items-center border-b pb-2 mb-4 mt-4">
                <h2 class="text-2xl font-semibold text-gray-800">Detalhes do Produtor</h2>
                <v-Button label="Editar" icon="pi pi-pencil" class="p-button-sm p-button-info" @click="openEditModal" />
            </div>


            <div v-if="!currentProducer" class="text-center text-gray-500">Nenhum produtor encontrado.</div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p><strong>Nome:</strong> {{ currentProducer.name }}</p>
                <p><strong>CPF/CNPJ:</strong> {{ currentProducer.cpf_cnpj }}</p>
                <p><strong>Email:</strong> {{ currentProducer.email }}</p>
                <p><strong>Telefone:</strong> {{ currentProducer.phone || '—' }}</p>
                <p class="sm:col-span-2"><strong>Endereço:</strong> {{ currentProducer.address }}</p>
            </div>

            <v-producer-form v-model:display="producerDialogOpen" :producerData="producer"
                @saved="handleSavedDetails" />
        </div>

        <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-10">
            <div class="flex justify-between items-center border-b pb-2 mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Propriedades Rurais</h3>

                <v-Button label="Adicionar Propriedade" icon="pi pi-plus" class="p-button-sm p-button-success"
                    @click="openNewPropertyModal" :disabled="!currentProducer || loadingProducer" />
            </div>

            <div v-if="loadingProducer" class="text-center p-4 text-blue-600">
                Carregando propriedades...
            </div>

            <v-property-list v-else :properties="propertyList" @edit-property="editProperty"
                @delete-property="confirmDeleteProperty" />
        </div>

        <v-ConfirmDialog />

        <v-property-form v-model:display="propertyDialogOpen" :propertyData="property" @saved="handleSavedProperty" />

        <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-10">
            <h2 class="text-2xl font-semibold text-gray-800">Detalhes da Propriedade</h2>
        </div>

        <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-10">
            <div class="flex justify-between items-center border-b pb-2 mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Unidades de Produção</h3>

                <v-Button label="Nova Unidade" icon="pi pi-plus" class="p-button-sm p-button-success"
                    @click="openNewUnitModal" :disabled="!activePropertyId || loadingUnits" />
            </div>

            <v-production-list :productionUnits="productionUnits" :loading="loadingUnits" @edit-unit="editUnit"
                @delete-unit="confirmDeleteUnit" />
        </div>

        <v-production-form v-model:display="unitDialogOpen" :unitData="productionUnit" @saved="handleSavedUnit" />

        <div class="mt-4 flex justify-end mr-4">
            <v-Button label="Apagar Produtor" icon="pi pi-trash" class="p-button-danger" @click="deleteProducer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useProducers, IProducer } from '../../services/useProducers';
import { useProperties, IProperty } from '../../services/useProperties';
import { useProductionUnits, IProductionUnit } from '../../services/useProductionUnits';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const producerId = Number(route.params.id);
// const propertyId = Number(route.params.id);
// const currentProperty = ref<{ id: number; name: string } | null>(null);
// const loadingProperty = ref(false);
const loadingProducer = ref(false);

const activeProperty = computed(() => propertyList.value.length > 0 ? propertyList.value[0] : null);
const activePropertyId = computed(() => activeProperty.value?.id || null);

const {
    producers,
    producer,
    handleSaved,
    fetchProducers,
    confirmDeleteProducer
} = useProducers(confirm as any, toast as any);

const currentProducer = computed(() => producers.value.find(p => p.id === producerId) || null);

const producerDialogOpen = ref(false);

const openEditModal = () => {
    if (currentProducer.value) {
        producer.value = { ...currentProducer.value };
        producerDialogOpen.value = true;
    }
};

const handleSavedDetails = async (updatedData: IProducer) => {
    await handleSaved(updatedData);
    producerDialogOpen.value = false;
    await fetchProducers();
    await fetchProperties(producerId);
};

const deleteProducer = () => {
    if (!currentProducer.value) return;

    confirmDeleteProducer(currentProducer.value, () => {
        router.push({ name: 'producers.index' });
    });
};

const goBack = () => {
    router.push({ name: 'producers.index' });
};

//properties
const {
    properties: propertyList,
    property,
    handleSaved: handleSavedPropertyAction,
    openNew: openNewProperty,
    editProperty: editPropertyAction,
    confirmDeleteProperty: confirmDeletePropertyAction,
    fetchProperties
} = useProperties(confirm as any, toast as any);

const propertyDialogOpen = ref(false);


onMounted(() => {
    fetchProducers();
    fetchProperties(producerId);
    // fetchProductionUnits(propertyId);
});

const openNewPropertyModal = () => {
    if (!currentProducer.value?.id) return;
    openNewProperty(currentProducer.value.id);
    propertyDialogOpen.value = true;
};

const editProperty = (propertyData: IProperty) => {
    editPropertyAction(propertyData);
    propertyDialogOpen.value = true;
}

const confirmDeleteProperty = (propertyData: IProperty) => {
    confirmDeletePropertyAction(propertyData, () => {
        fetchProperties(producerId);
    });
}

const handleSavedProperty = async (savedData: IProperty) => {
    try {
        await handleSavedPropertyAction(savedData);
        propertyDialogOpen.value = false;
        await fetchProperties(producerId);
    } catch (e) {
        //fazer depois
    }
};
////////////// production
const {
    productionUnits,
    productionUnit,
    loading: loadingUnits,
    fetchProductionUnits,
    openNew,
    editProductionUnit,
    handleSavedProduction,
    confirmDeleteProductionUnit
} = useProductionUnits(confirm as any, toast as any);

const unitDialogOpen = ref(false);

watch(activePropertyId, (newId) => {
    if (newId) {
        fetchProductionUnits(newId);
    } else {
        productionUnits.value = [];
    }
}, { immediate: true });

const openNewUnitModal = () => {
    if (!activePropertyId.value) return;
    openNew(activePropertyId.value);
    unitDialogOpen.value = true;
};

const editUnit = (unitData: IProductionUnit) => {
    editProductionUnit(unitData);
    unitDialogOpen.value = true;
};

const confirmDeleteUnit = (unitData: IProductionUnit) => {
    confirmDeleteProductionUnit(unitData, () => {
        if (activePropertyId.value) {
            fetchProductionUnits(activePropertyId.value);
        }
    });
};

const handleSavedUnit = async (savedData: IProductionUnit) => {
    try {
        await handleSavedProduction(savedData);
        unitDialogOpen.value = false;

        if (activePropertyId.value) {
            await fetchProductionUnits(activePropertyId.value);
        }
    } catch (e) {
        // ...
    }
};
</script>