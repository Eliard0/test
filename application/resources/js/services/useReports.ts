import axios from 'axios';
import { ref } from 'vue';

export interface IPropertyMunicipality {
  municipality: string;
  total: number;
}

export interface IAnimalSpecies {
  species: string;
  total: number;
}

export interface ICropHectare {
  crop: string;
  total_hectares: number;
}

export interface IReports {
  propertiesByMunicipality: IPropertyMunicipality[];
  animalsBySpecies: IAnimalSpecies[];
  hectaresByCrop: ICropHectare[];
}

export function useReports() {
  const reports = ref<IReports>({
    propertiesByMunicipality: [],
    animalsBySpecies: [],
    hectaresByCrop: [],
  });

  const loading = ref(false);

  const fetchReports = async (producerId: number | null = null) => {
    try {
      loading.value = true;
      const params = producerId ? { producer_id: producerId } : {};
      const response = await axios.get('http://localhost:8000/api/reports', { params });

      reports.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    } finally {
      loading.value = false;
    }
  };

  return { reports, loading, fetchReports };
}
