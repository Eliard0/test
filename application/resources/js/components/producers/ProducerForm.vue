<template>
    <Dialog :visible="display" :header="headerTitle" modal class="p-fluid" @update:visible="closeDialog">
        <div class="field">
            <label for="name">Nome</label>
            <InputText id="name" v-model="producerModel.name" required autofocus />
        </div>

        <div class="field">
            <label for="cpf_cnpj">CPF / CNPJ</label>
            <InputText id="cpf_cnpj" v-model="producerModel.cpf_cnpj" required />
        </div>

        <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="producerModel.email" type="email" required />
        </div>

        <div class="field">
            <label for="phone">Telefone</label>
            <InputText id="phone" v-model="producerModel.phone" />
        </div>

        <div class="field">
            <label for="address">Endereço</label>
            <Textarea id="address" v-model="producerModel.address" rows="3" />
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" severity="secondary" text @click="closeDialog" />
            <Button label="Salvar" icon="pi pi-check" severity="success" @click="saveForm" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import type { IProducer } from '../../services/useProducers'

const props = defineProps<{
    display: boolean
    producerData: IProducer | null
}>()

const emit = defineEmits<{
    (e: 'update:display', value: boolean): void
    (e: 'saved', value: IProducer): void
}>()

const producerModel = ref<IProducer>({
    id: undefined,
    name: '',
    cpf_cnpj: '',
    email: '',
    phone: '',
    address: ''
})

watch(
    () => props.producerData,
    (newData) => {
        if (newData) {
            producerModel.value = { ...newData }
        } else {
            producerModel.value = {
                id: undefined,
                name: '',
                cpf_cnpj: '',
                email: '',
                phone: '',
                address: ''
            }
        }
    },
    { immediate: true }
)

const headerTitle = computed(() =>
    props.producerData?.id ? 'Editar Produtor' : 'Novo Produtor'
)

const closeDialog = () => {
    emit('update:display', false)
}

const saveForm = () => {
    emit('saved', producerModel.value)
}
</script>