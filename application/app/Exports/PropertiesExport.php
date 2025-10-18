<?php

namespace App\Exports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PropertiesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Property::with('producer')->get();
    }

    public function map($property): array
    {
        return [
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
