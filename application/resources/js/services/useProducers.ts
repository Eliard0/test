import { ref, onMounted, Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { Confirm, Toast } from 'primevue/api'; 

export interface IProducer {
    id?: number; 
    name: string;
    cpf_cnpj: string;
    phone?: string | null;
    email: string;
    address: string;
    date_registration?: string;
    created_at?: string;
    updated_at?: string;
}

export interface IAxiosErrorData { 
    message: string;
    errors: Record<string, string[]>;
}

export function useProducers(confirm: Confirm, toast: Toast) {
    const producers: Ref<IProducer[]> = ref([]);
    const producer: Ref<IProducer | null> = ref(null); 
    
    const producerDialog = ref(false); 
    const loading = ref(true); 

    const fetchProducers = async () => {
        loading.value = true;
        try {
            const response = await axios.get<IProducer[]>('/api/producers');
            producers.value = response.data;
        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao buscar produtores.';

            toast.add({severity: 'error', summary: 'API Error', detail: detail, life: 3000});
            console.error("Error fetching producers:", err);
        } finally {
            loading.value = false;
        }
    };

    const handleSaved = async (savedData: IProducer) => {
        producerDialog.value = false;
        let successMessage = '';

        try {
            if (savedData.id) {
                await axios.put(`/api/producers/${savedData.id}`, savedData);
                successMessage = `Produtor ${savedData.name} atualizado com sucesso!`;
            } else {
                await axios.post('/api/producers', savedData);
                successMessage = `Produtor ${savedData.name} criado com sucesso!`;
            }
            
            await fetchProducers(); 
            toast.add({severity: 'success', summary: 'Sucesso', detail: successMessage, life: 3000});

        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Erro ao salvar o produtor.';
            
            toast.add({severity: 'error', summary: 'Erro ao Salvar', detail: detail, life: 5000});
            console.error("Error saving producer:", err);
        }
    };

    const confirmDeleteProducer = (producerData: IProducer) => {
        confirm.require({
            message: `Tem certeza que deseja deletar o produtor ${producerData.name}?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.delete(`/api/producers/${producerData.id}`);
                    await fetchProducers(); 
                    toast.add({severity:'warn', summary: 'Deletado', detail: 'Produtor excluído com sucesso.', life: 3000});
                } catch (error) {
                    const err = error as AxiosError;
                    const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao deletar produtor.';

                    toast.add({severity: 'error', summary: 'API Error', detail: detail, life: 3000});
                    console.error("Error deleting producer:", err);
                }
            },
        });
    };

    const openNew = () => {
        producer.value = { 
            name: '', 
            cpf_cnpj: '', 
            phone: null, 
            email: '', 
            address: '' 
        }; 
        producerDialog.value = true;
    };

    const editProducer = (producerData: IProducer) => {
        producer.value = { ...producerData }; 
        producerDialog.value = true;
    };
    
    onMounted(() => {
        fetchProducers();
    });

    return {
        producers,
        producerDialog,
        producer,
        loading,
        fetchProducers,
        handleSaved,
        confirmDeleteProducer,
        openNew,
        editProducer,
    };
}