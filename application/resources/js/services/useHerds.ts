import { ref, Ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import saveAs  from 'file-saver';

export interface IHerd {
    id?: number;
    species: string;
    quantity: number;
    purpose: string;
    date_update: string;
    property_id: number;
}

type Confirm = ReturnType<typeof useConfirm>;
type Toast = ReturnType<typeof useToast>;

interface IAxiosErrorData {
    message: string;
    errors?: Record<string, string[]>;
}


export function useHerds(confirm: Confirm, toast: Toast) {
    const herds: Ref<IHerd[]> = ref([]);
    const herd: Ref<IHerd | null> = ref(null);
    const loading: Ref<boolean> = ref(false);

    const fetchHerdsByPropertyId = async (propertyId: number): Promise<IHerd[]> => {
        try {
            const response = await axios.get<IHerd[]>(`/api/herd?property_id=${propertyId}`);
            return response.data;
        } catch (error) {
            return [];
        }
    };

    const fetchHerds = async (propertyIds: number[]) => {
        loading.value = true;
        herds.value = [];

        try {
            const fetchPromises = propertyIds.map(id => fetchHerdsByPropertyId(id));
            const results = await Promise.all(fetchPromises);

            herds.value = results.flat();
        } catch (e) {
            // ...
        } finally {
            loading.value = false;
        }
    };

    const openNew = (propertyId: number) => {
        herd.value = {
            species: '',
            quantity: 1,
            purpose: '',
            date_update: new Date().toISOString().split('T')[0],
            property_id: propertyId,
        };
    };

    const editHerd = (herdData: IHerd) => {
        herd.value = { ...herdData };
    };

    const handleSavedHerd = async (savedData: IHerd) => {
        let successMessage = '';

        try {
            if (savedData.id) {
                await axios.put(`/api/herd/${savedData.id}`, savedData);
                successMessage = `Rebanho de ${savedData.species} atualizado com sucesso!`;
            } else {
                await axios.post('/api/herd', savedData);
                successMessage = `Rebanho de ${savedData.species} adicionado com sucesso!`;
            }

            toast.add({ severity: 'success', summary: 'Sucesso', detail: successMessage, life: 3000 });

        } catch (error) {
            const err = error as AxiosError;
            const detail = (err.response?.data as IAxiosErrorData)?.message || 'Erro ao salvar o rebanho.';

            toast.add({ severity: 'error', summary: 'Erro ao Salvar', detail: detail, life: 5000 });
            console.error("Error saving herd data:", err);
            throw error;
        }
    };

    const confirmDeleteHerd = (herdData: IHerd, onSuccess: () => void) => {
        confirm.require({
            message: `Tem certeza que deseja deletar o registro de ${herdData.species}?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.delete(`/api/herd/${herdData.id}`);

                    toast.add({ severity: 'warn', summary: 'Deletado', detail: 'Registro de rebanho excluído com sucesso.', life: 3000 });

                    onSuccess();
                } catch (error) {
                    const err = error as AxiosError;
                    const detail = (err.response?.data as IAxiosErrorData)?.message || 'Falha ao deletar o rebanho.';
                    toast.add({ severity: 'error', summary: 'API Error', detail: detail, life: 3000 });
                }
            },
        });
    };

    const exportHerdsPdf = async (producerId: number) => {
        if (!producerId) {
            toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Selecione um produtor antes de exportar.', life: 3000 });
            return;
        }

        try {
            const response = await axios.get(`/api/herds/export-pdf/${producerId}`, {
                responseType: 'blob',
            });

            const fileName = `herds_producer_${producerId}_${new Date().toISOString().replace(/[:.]/g, '')}.pdf`;
            saveAs(response.data, fileName);
            toast.add({ severity: 'success', summary: 'Exportado', detail: 'PDF de rebanhos gerado com sucesso!', life: 3000 });

        } catch (error) {
            const err = error as AxiosError;
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao exportar PDF.', life: 3000 });
            console.error(err);
        }
    };


    return {
        herds,
        herd,
        loading,
        fetchHerds,
        openNew,
        editHerd,
        handleSavedHerd,
        confirmDeleteHerd,
        exportHerdsPdf,
    };
}