<?php

namespace App\Http\Controllers;
use App\Models\ProductionUnit;
use Illuminate\Http\Request;

class ProductionUnitController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductionUnit::query();

        if ($request->filled('property_id')) {
            $propertyId = (int)$request->input('property_id'); 
            $query->where('property_id', $propertyId);
        }
        
        return response()->json($query->get());
    }


    public function store(Request $request)
    {
        // 1. Validação dos dados
        $validatedData = $request->validate([
            'culture_name' => 'required|string|max:255',
            'total_area_ha' => 'required|numeric|min:0',
            'geographic_coordinates' => 'nullable|string|max:255',
            'property_id' => 'required|integer|exists:properties,id', // MUITO IMPORTANTE!
        ]);
    
        // 2. Criação (usando os dados validados)
        $productionUnit = ProductionUnit::create($validatedData);
        
        return response()->json($productionUnit, 201);
    }

    public function show(ProductionUnit $productionUnit)
    {
        return response()->json($productionUnit);
    }

    public function update(Request $request, ProductionUnit $productionUnit)
    {
        $productionUnit->update($request->validated());
        
        return response()->json($productionUnit);
    }

    public function destroy(ProductionUnit $productionUnit)
    {
        $productionUnit->delete();
        
        return response()->json(null, 204);
    }
}
