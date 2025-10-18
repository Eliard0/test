<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\HerdsPdfExport;

class HerdExportController extends Controller
{
    public function exportPdf(Request $request, int $producerId)
    {
        return (new HerdsPdfExport($producerId))->download();
    }
}
