<?php

namespace App\Exports;

use App\Models\Herd;
use Barryvdh\DomPDF\Facade\Pdf;

class HerdsPdfExport
{
    protected int $producerId;

    public function __construct(int $producerId)
    {
        $this->producerId = $producerId;
    }

    public function download(): \Illuminate\Http\Response
    {
        $herds = Herd::with('property')
            ->whereHas('property', function($query) {
                $query->where('producer_id', $this->producerId);
            })
            ->get();

        $pdf = Pdf::loadView('exports.herds', ['herds' => $herds]);

        $fileName = 'herds_producer_' . $this->producerId . '_' . now()->format('Ymd_His') . '.pdf';
        return $pdf->download($fileName);
    }
}
