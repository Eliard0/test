<?php

namespace App\Exports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PropertiesExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        $properties = Property::with('producer')->get();

        $data = [];
        foreach ($properties as $property) {
            $data[] = [
                $property->id,
                $property->name,
                $property->municipality,
                $property->uf,
                $property->state_registration,
                $property->area_total,
                $property->producer?->name ?? 'N/A',
                $property->created_at?->format('d/m/Y') ?? '',
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nome',
            'Município',
            'UF',
            'Registro Estadual',
            'Área Total',
            'Produtor',
            'Criado em',
        ];
    }
}
