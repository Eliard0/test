<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producer;
use Illuminate\Http\JsonResponse;


class ProducerController extends Controller
{
/**
     * @OA\Get(
     *      path="/api/producers",
     *      operationId="getProducersList",
     *      tags={"Produtores"},
     *      summary="Listar todos os produtores",
     *      description="Retorna uma lista de todos os produtores cadastrados.",
     *      @OA\Response(
     *          response=200,
     *          description="Lista retornada com sucesso",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(
     *                  type="object",
     *                  @OA\Property(property="id", type="integer", example=1),
     *                  @OA\Property(property="name", type="string", example="José da Silva"),
     *                  @OA\Property(property="cpf_cnpj", type="string", example="123.456.789-00"),
     *                  @OA\Property(property="telefone", type="string", example="(11) 99999-9999"),
     *                  @OA\Property(property="email", type="string", example="jose@email.com"),
     *                  @OA\Property(property="endereco", type="string", example="Rua das Laranjeiras, 123 - SP"),
     *                  @OA\Property(property="data_cadastro", type="string", format="date", example="2025-01-10")
     *              )
     *          )
     *      )
     * )
     */
    public function index(): JsonResponse
    {
        $producers = Producer::all(); 

        return response()->json($producers);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'cpf_cnpj' => 'required|string|unique:producers|max:18', 
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $producer = Producer::create($validatedData);

        return response()->json($producer, 201);
    }

    public function show(Producer $producer): JsonResponse
    {
        return response()->json($producer);
    }

    public function update(Request $request, Producer $producer): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'cpf_cnpj' => 'required|string|max:18|unique:producers,cpf_cnpj,' . $producer->id,
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        $producer->update($validatedData);

        return response()->json($producer);
    }

    public function destroy(Producer $producer): JsonResponse
    {
        $producer->delete();
        
        return response()->json(null, 204);
    }
}
