import { ref, Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { IAxiosErrorData } from './useProducers'; 

export interface IProperty {
    id?: number; 
    name: string;
    municipality: string;
    uf: string;
    state_registration?: string | null;
    area_total: number;
    producer_id: number;
    created_at?: string;
    updated_at?: string;
    herds?: any[]; 
    production_units?: any[]; 
}

type Confirm = ReturnType<typeof useConfirm>;
type Toast = ReturnType<typeof useToast>;


export function useProperties(confirm: Confirm, toast: Toast) {
    const properties: Ref<IProperty[]> = ref([]);
    const property: Ref<IProperty | null> = ref(null);
    
    const propertyDialog = ref(false); 
    const loading = ref(false); 

    /**
     * 
     * @param producerId
     */
    const fetchProperties = async (producerId?: number) => {
        loading.value = true;
        try {
            let url = '/api/properties';
            if (producerId) {
                url += `?producer_id=${producerId}`;
            }
            
            const response = await axios.get<IProperty[]>(url);
            properties.value = response.data;

        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao buscar propriedades.';
            toast.add({severity: 'error', summary: 'API Error', detail: detail, life: 3000});
            console.error("Error fetching properties:", err);
        } finally {
            loading.value = false;
        }
    };

    const handleSaved = async (savedData: IProperty) => {
        propertyDialog.value = false;
        let successMessage = '';

        try {
            if (savedData.id) {
                await axios.put(`/api/properties/${savedData.id}`, savedData);
                successMessage = `Propriedade ${savedData.name} atualizada com sucesso!`;
            } else {
                await axios.post('/api/properties', savedData);
                successMessage = `Propriedade ${savedData.name} criada com sucesso!`;
            }
            
            toast.add({severity: 'success', summary: 'Sucesso', detail: successMessage, life: 3000});

        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Erro ao salvar a propriedade.';
            
            toast.add({severity: 'error', summary: 'Erro ao Salvar', detail: detail, life: 5000});
            console.error("Error saving property:", err);
            throw error;
        }
    };

    const confirmDeleteProperty = (propertyData: IProperty, onSuccess?: () => void) => {
        confirm.require({
            message: `Tem certeza que deseja deletar a propriedade ${propertyData.name}?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.delete(`/api/properties/${propertyData.id}`);
                    
                    toast.add({severity:'warn', summary: 'Deletado', detail: 'Propriedade excluída com sucesso.', life: 3000});
    
                    if (onSuccess) onSuccess(); 
                } catch (error) {
                    const err = error as AxiosError;
                    const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao deletar propriedade.';
                    toast.add({severity: 'error', summary: 'API Error', detail: detail, life: 3000});
                    console.error("Error deleting property:", err);
                }
            },
        });
    };
    

    /**
     * 
     * @param producerId
     */
    const openNew = (producerId: number) => {
        property.value = { 
            name: '', 
            municipality: '', 
            uf: '', 
            state_registration: null, 
            area_total: 0,
            producer_id: producerId,
        }; 
        propertyDialog.value = true;
    };
    
    const editProperty = (propertyData: IProperty) => {
        property.value = { ...propertyData }; 
        propertyDialog.value = true;
    };

    return {
        properties,
        propertyDialog,
        property,
        loading,
        fetchProperties,
        handleSaved,
        confirmDeleteProperty,
        openNew,
        editProperty,
    };
}