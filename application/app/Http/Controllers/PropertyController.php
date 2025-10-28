<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Http\JsonResponse;


/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="API Agropecuária",
 *      description="Documentação dos endpoints da API Agropecuária",
 * 
 * )
 *
 * @OA\Server(
 *      url=L5_SWAGGER_CONST_HOST,
 *      description="Servidor Local"
 * )
 */
class PropertyController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/properties",
     *     summary="Listar todas as propriedades",
     *     tags={"Propriedades"},
     *     @OA\Parameter(
     *         name="producer_id",
     *         in="query",
     *         description="Filtra propriedades por produtor",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de propriedades retornada com sucesso"
     *     )
     * )
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

    public function show(Property $property): JsonResponse
    {
        $property->load(['herds', 'productionUnits']);
        return response()->json($property);
    }

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

    public function destroy(Property $property): JsonResponse
    {
        $property->delete();
        return response()->json(null, 204);
    }
}
