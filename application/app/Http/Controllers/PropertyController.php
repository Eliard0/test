<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Http\JsonResponse;

class PropertyController extends Controller
{
    /**
     * 
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Property::query();

        if ($request->filled('producer_id')) {
            $query->where('producer_id', $request->input('producer_id'));
        }
        
        $properties = $query->get();
        return response()->json($properties);
    }

    /**
     * 
     *
     * @param  Request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'municipality' => 'required|string|max:100',
            'uf' => 'required|string|max:2',
            'state_registration' => 'nullable|string|max:50|unique:properties', 
            'area_total' => 'required|numeric|min:0',
            'producer_id' => 'required|exists:producers,id',
        ]);

        $property = Property::create($validatedData);
        return response()->json($property, 201);
    }

    /**
     * 
     *
     * @param  Property 
     * @return JsonResponse
     */
    public function show(Property $property): JsonResponse
    {
        $property->load(['herds', 'productionUnits']); 
        return response()->json($property);
    }

    /**
     * 
     *
     * @param  Request
     * @param  Property 
     * @return JsonResponse
     */
    public function update(Request $request, Property $property): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'municipality' => 'required|string|max:100',
            'uf' => 'required|string|max:2',
            'state_registration' => 'nullable|string|max:50|unique:properties,state_registration,' . $property->id,
            'area_total' => 'required|numeric|min:0',
            'producer_id' => 'required|exists:producers,id',
        ]);

        $property->update($validatedData);
        return response()->json($property);
    }

    /**
     * 
     *
     * @param  Property
     * @return JsonResponse
     */
    public function destroy(Property $property): JsonResponse
    {
        $property->delete();
        return response()->json(null, 204);
    }
}