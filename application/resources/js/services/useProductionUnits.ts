import { ref, Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export interface IProductionUnit {
    id?: number;
    culture_name: string;
    total_area_ha: number | null;
    geographic_coordinates?: string | null;
    property_id: number;
}

type Confirm = ReturnType<typeof useConfirm>;
type Toast = ReturnType<typeof useToast>;

interface IAxiosErrorData {
    message: string;
    errors?: Record<string, string[]>;
}

export function useProductionUnits(confirm: Confirm, toast: Toast) {
    const productionUnits: Ref<IProductionUnit[]> = ref([]);
    const productionUnit: Ref<IProductionUnit | null> = ref(null);
    const loading: Ref<boolean> = ref(false);

    const fetchProductionUnits = async (propertyId: number) => {
        loading.value = true;
        try {
            const response = await axios.get<IProductionUnit[]>(`/api/production-units?property_id=${propertyId}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao buscar unidades de produção.';
            toast.add({ severity: 'error', summary: 'API Error', detail: detail, life: 3000 });
            return [];
        } finally {
            loading.value = false;
        }
    };

    const openNew = (propertyId: number) => {
        productionUnit.value = {
            culture_name: '',
            total_area_ha: null,
            geographic_coordinates: null,
            property_id: propertyId,
        };
    };

    const editProductionUnit = (unitData: IProductionUnit) => {
        productionUnit.value = { ...unitData };
    };

    const handleSavedProduction = async (savedData: IProductionUnit) => {
        let successMessage = '';

        try {
            if (savedData.id) {
                await axios.put(`/api/production-units/${savedData.id}`, savedData);
                successMessage = `Unidade ${savedData.culture_name} atualizada com sucesso!`;
            } else {
                await axios.post('/api/production-units', savedData);
                successMessage = `Unidade ${savedData.culture_name} criada com sucesso!`;
            }

            toast.add({ severity: 'success', summary: 'Sucesso', detail: successMessage, life: 3000 });

        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Erro ao salvar a unidade de produção.';

            toast.add({ severity: 'error', summary: 'Erro ao Salvar', detail: detail, life: 5000 });
            console.error("Error saving production unit:", err);
            throw error;
        }
    };

    const confirmDeleteProductionUnit = (unitData: IProductionUnit, onSuccess: () => void) => {
        confirm.require({
            message: `Tem certeza que deseja deletar a unidade '${unitData.culture_name}'?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.delete(`/api/production-units/${unitData.id}`);

                    toast.add({ severity: 'warn', summary: 'Deletado', detail: 'Unidade excluída com sucesso.', life: 3000 });

                    onSuccess();
                } catch (error) {
                    const err = error as AxiosError;
                    const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao deletar unidade.';
                    toast.add({ severity: 'error', summary: 'API Error', detail: detail, life: 3000 });
                }
            },
        });
    };


    return {
        productionUnits,
        productionUnit,
        loading,
        fetchProductionUnits,
        openNew,
        editProductionUnit,
        handleSavedProduction,
        confirmDeleteProductionUnit,
    };
}