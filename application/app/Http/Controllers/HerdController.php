<?php

namespace App\Http\Controllers;

use App\Models\Herd;
use Illuminate\Http\Request;

class HerdController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'property_id' => 'required|integer|exists:properties,id',
        ]);

        $herds = Herd::with('property')
        ->where('property_id', $request->property_id)
        ->orderBy('species')
        ->get();

        return response()->json($herds);
    }

    public function store(Request $request)
    {
        $herd = Herd::create($request->all());
        return response()->json($herd, 201);
    }

    public function update(Request $request, Herd $herd)
    {
        $herd->update($request->all());
        return response()->json($herd);
    }

    public function destroy(Herd $herd)
    {
        $herd->delete();
        return response()->json(null, 204);
    }
}
