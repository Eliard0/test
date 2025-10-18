<template>
    <v-Dialog :visible="display" :header="headerTitle" modal class="w-full max-w-2xl p-fluid"
        @update:visible="closeDialog">

        <div class="p-4 rounded-xl bg-gray-50">

            <div class="field flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold text-gray-700 w-1/4 text-right">Nome:</label>
                <v-InputText id="name" v-model="producerModel.name" required autofocus class="flex-grow w-full" />
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="cpf_cnpj" class="font-semibold text-gray-700 w-1/4 text-right">CPF / CNPJ:</label>
                <v-InputText id="cpf_cnpj" v-model="producerModel.cpf_cnpj" @blur="applyCpfCnpjMask"
                    placeholder="Digite CPF ou CNPJ" class="flex-grow w-full" required/>
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="email" class="font-semibold text-gray-700 w-1/4 text-right">Email:</label>
                <v-InputText id="email" v-model="producerModel.email" type="email" required class="flex-grow w-full" />
            </div>

            <div class="field flex items-center gap-4 mb-4">
                <label for="phone" class="font-semibold text-gray-700 w-1/4 text-right">Telefone:</label>
                <v-InputMask id="phone" v-model="producerModel.phone" mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000" class="flex-grow w-full" type="tel" required/>
            </div>

            <div class="field flex gap-4 mb-4 items-start">
                <label for="address" class="font-semibold text-gray-700 w-1/4 pt-2 text-right">Endereço:</label>
                <v-Textarea id="address" v-model="producerModel.address" rows="3" class="flex-grow w-full" required />
            </div>

        </div>

        <template #footer>
            <v-Button label="Cancelar" icon="pi pi-times" severity="secondary" text @click="closeDialog" />
            <v-Button label="Salvar" icon="pi pi-check" severity="success" @click="saveForm" />
        </template>
    </v-Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { IProducer } from '../../services/useProducers';

const props = defineProps<{
    display: boolean;
    producerData: IProducer | null;
}>();

const emit = defineEmits<{
    (e: 'update:display', value: boolean): void;
    (e: 'saved', value: IProducer): void;
}>();

const producerModel = ref<IProducer>({
    id: undefined,
    name: '',
    cpf_cnpj: '',
    email: '',
    phone: '',
    address: ''
});

watch(
    () => props.producerData,
    (newData) => {
        if (newData) {
            producerModel.value = { ...newData };
        } else {
            producerModel.value = {
                id: undefined,
                name: '',
                cpf_cnpj: '',
                email: '',
                phone: '',
                address: ''
            };
        }
    },
    { immediate: true }
);

const headerTitle = computed(() =>
    props.producerData?.id ? 'Editar Produtor' : 'Novo Produtor'
);

const closeDialog = () => {
    emit('update:display', false);
};

const saveForm = () => {
    emit('saved', producerModel.value);
};

function applyCpfCnpjMask() {
    let digits = producerModel.value.cpf_cnpj.replace(/\D/g, '');
    if (!digits) return;

    if (digits.length <= 11) {
        producerModel.value.cpf_cnpj = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else {
        producerModel.value.cpf_cnpj = digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
    }
}

</script>
