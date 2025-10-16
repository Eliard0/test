<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producer;
use Illuminate\Http\JsonResponse;

class ProducerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $producers = Producer::all(); 

        return response()->json($producers);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request $request
     * @return JsonResponse
     */
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

    /**
     * Display the specified resource.
     *
     * @param  Producer $producer
     * @return JsonResponse
     */
    public function show(Producer $producer): JsonResponse
    {
        return response()->json($producer);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request 
     * @param  Producer 
     * @return JsonResponse
     */
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  Producer $producer
     * @return JsonResponse
     */
    public function destroy(Producer $producer): JsonResponse
    {
        $producer->delete();
        
        return response()->json(null, 204);
    }
}
