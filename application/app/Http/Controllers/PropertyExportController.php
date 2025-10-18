<?php

namespace App\Http\Controllers;

use App\Exports\PropertiesExport;
use App\Models\Property;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class PropertyExportController extends Controller
{
    public function export(Request $request)
    {
        $query = Property::query();

        if ($request->filled('producer_id')) {
            $query->where('producer_id', $request->producer_id);
        }
    
        return Excel::download(new PropertiesExport($query->get()), 'properties.xlsx');
    }
}
