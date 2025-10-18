<?php

namespace App\Http\Controllers;

use App\Models\Herd;
use App\Models\ProductionUnit;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $producerId = $request->query('producer_id');

        $propertiesQuery = Property::select('municipality', DB::raw('COUNT(*) as total'))
            ->groupBy('municipality');

        if ($producerId) {
            $propertiesQuery->where('producer_id', $producerId);
        }

        $propertiesByMunicipality = $propertiesQuery->get();

        $herdsQuery = Herd::select('species', DB::raw('SUM(quantity) as total'))
            ->groupBy('species');

        if ($producerId) {
            $herdsQuery->whereHas('property', fn($q) => $q->where('producer_id', $producerId));
        }

        $animalsBySpecies = $herdsQuery->get();

        $productionUnitsQuery = ProductionUnit::select('culture_name', DB::raw('SUM(total_area_ha) as total_hectares'))
            ->groupBy('culture_name');

        if ($producerId) {
            $productionUnitsQuery->whereHas('property', fn($q) => $q->where('producer_id', $producerId));
        }

        $hectaresByCrop = $productionUnitsQuery->get();

        return response()->json([
            'propertiesByMunicipality' => $propertiesByMunicipality,
            'animalsBySpecies' => $animalsBySpecies,
            'hectaresByCrop' => $hectaresByCrop,
        ]);
    }
}
