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
            <div class="flex justify-start mb-4">
                <v-Button label="Exportar Propriedades (.xlsx)" icon="pi pi-file-excel"
                    class="p-button-success p-button-sm" @click="exportExcel" />
            </div>
            <div class="flex justify-between items-center border-b pb-2 mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Propriedades Rurais</h3>

                <v-Button label="Nova Propriedade" icon="pi pi-plus" class="p-button-sm p-button-success"
                    @click="openNewPropertyModal" :disabled="!currentProducer || loadingProducer" />
            </div>

            <div v-if="loadingProducer" class="text-center p-4 text-blue-600">
                Carregando propriedades...
            </div>

            <v-property-list v-else @select-property="selectPropertyForUnits" :properties="propertyList"
                @edit-property="editProperty" @delete-property="confirmDeleteProperty" />
        </div>

        <v-ConfirmDialog />

        <v-property-form v-model:display="propertyDialogOpen" :propertyData="property" @saved="handleSavedProperty" />

        <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-10">
            <div class="flex justify-between items-center border-b pb-2 mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Unidades de Produção</h3>
                <v-Button label="Nova Unidade" icon="pi pi-plus" class="p-button-sm p-button-success"
                    @click="openNewUnitModal" />
            </div>

            <v-production-list :productionUnits="productionUnits" :loading="loadingUnits"
                :producerId="currentProducer?.id || 0" @edit-unit="editUnit" :properties="propertyList"
                @delete-unit="confirmDeleteUnit" />
        </div>

        <v-production-form :producerId="currentProducer?.id || 0" v-model:display="unitDialogOpen"
            @saved="handleSavedUnit" :unitData="productionUnit" :properties="propertyList" />

        <div class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-10">
            <v-Button label="Exportar PDF" icon="pi pi-file-pdf" class="p-button-sm p-button-warning"
            @click="exportHerdsPdf(producerId)"
            />
            <div class="flex justify-between items-center border-b pb-2 mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Rebanho</h3>

                <v-Button label="Novo Rebanho" icon="pi pi-plus" class="p-button-sm p-button-success"
                    @click="openNewHerdModal" />
            </div>

            <v-herd-list :herds="herds || []" :loading="loadingHerds" @edit-herd="editHerd"
                @delete-herd="confirmDeleteHerd" />


            <v-herd-form :loading="false" v-model:display="herdDialogOpen" :propertyId="selectedPropertyId"
                :herdData="herd" :properties="propertyList" @saved="handleSavedHerdModal" />

        </div>

        <div class="mt-4 flex justify-end mr-4">
            <v-Button label="Apagar Produtor" icon="pi pi-trash" class="p-button-danger" @click="deleteProducer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useProducers, IProducer } from '../../services/useProducers';
import { useProperties, IProperty } from '../../services/useProperties';
import { useProductionUnits, IProductionUnit } from '../../services/useProductionUnits';
import { useHerds, IHerd } from '../../services/useHerds';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const producerId = Number(route.params.id);
const loadingProducer = ref(false);

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
    // await fetchProperties(producerId);
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

//----------------------------------------------------------------------------------properties
const {
    properties: propertyList,
    property,
    handleSaved: handleSavedPropertyAction,
    openNew: openNewProperty,
    editProperty: editPropertyAction,
    confirmDeleteProperty: confirmDeletePropertyAction,
    fetchProperties,
    exportExcel
} = useProperties(confirm as any, toast as any);

const propertyDialogOpen = ref(false);

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
//-------------------------------------------Unidade de producao

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
const activePropertyId = ref<number | null | undefined>(null);
const selectPropertyForUnits = (property: IProperty) => {
    activePropertyId.value = property.id;
};

const openNewUnitModal = () => {
    if (!currentProducer.value) return;
    if (propertyList.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Este produtor não tem propriedades cadastradas.', life: 3000 });
        return;
    }

    const firstProperty = propertyList.value[0];
    if (!firstProperty.id) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Propriedade sem ID.', life: 3000 });
        return;
    }
    openNew(firstProperty.id);
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

        // Atualiza todas as propriedades do produtor
        const allUnits: (IProductionUnit & { propertyName: string })[] = [];
        for (const prop of propertyList.value) {
            if (prop.id !== undefined) {
                const units = await fetchProductionUnits(prop.id);
                const unitsWithPropertyName = units.map(u => ({
                    ...u,
                    propertyName: prop.name
                }));
                allUnits.push(...unitsWithPropertyName);
            }
        }
        productionUnits.value = allUnits;

    } catch (e) {
        console.error(e);
    }
};
const allUnits: (IProductionUnit & { propertyName: string })[] = [];

//----------------------------------------------------Herd
const {
    herds,
    herd,
    loading: loadingHerds,
    fetchHerds,
    openNew: openNewHerd,
    editHerd: editHerdAction,
    handleSavedHerd,
    exportHerdsPdf,
    confirmDeleteHerd: confirmDeleteHerdAction
} = useHerds(confirm as any, toast as any);

const herdDialogOpen = ref(false);
const selectedPropertyId = ref<number | null>(null);

// 🚨 NOVA FUNÇÃO AUXILIAR DE REFRESH PARA HERD
const refreshAllHerds = async () => {
    const propertyIds = propertyList.value
        .map(p => p.id)
        .filter((id): id is number => id !== undefined && id !== null);

    await fetchHerds(propertyIds);
};

const openNewHerdModal = () => {
    if (propertyList.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Crie uma propriedade rural primeiro.', life: 3000 });
        return;
    }

    const firstProperty = propertyList.value[0];
    if (!firstProperty.id) return; // evita undefined

    selectedPropertyId.value = firstProperty.id;  // ✅ define o propertyId usado no modal
    openNewHerd(firstProperty.id);

    herdDialogOpen.value = true;
};

const editHerd = (herdData: IHerd) => {
    editHerdAction(herdData);
    herdDialogOpen.value = true;
};

const confirmDeleteHerd = (herdData: IHerd) => {
    confirmDeleteHerdAction(herdData, async () => {
        // 🚨 REFRESH COMPLETO APÓS EXCLUSÃO
        await refreshAllHerds();
    });
};

const handleSavedHerdModal = async (savedData: IHerd) => {
    herdDialogOpen.value = false;
    // 🚨 REFRESH COMPLETO APÓS SALVAMENTO
    await refreshAllHerds();
};


onMounted(async () => {
    if (producerId) {
        await fetchProperties(producerId);

        for (const prop of propertyList.value) {
            if (prop.id !== undefined) {
                const units = await fetchProductionUnits(prop.id);
                const unitsWithPropertyName = units.map(u => ({
                    ...u,
                    propertyName: prop.name
                }));
                allUnits.push(...unitsWithPropertyName);
            }
        }
        productionUnits.value = allUnits;

        if (propertyList.value.length > 0) {
            await refreshAllHerds();
        }
    }
});

watch(activePropertyId, async (newId) => {
    // A busca só ocorre se houver um ID válido
    if (newId) {
        await fetchProductionUnits(newId);
    } else {
        // Limpa a lista se nenhuma propriedade estiver selecionada
        productionUnits.value = [];
    }
});

watch(herds, (newHerds) => {
    console.log("Herds atualizados:", newHerds.length);
}, { deep: true });

</script>