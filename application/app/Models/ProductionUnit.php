<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionUnit extends Model
{
    use HasFactory;

    protected $table = 'production_units';

    protected $fillable = [
        'culture_name',
        'total_area_ha',
        'geographic_coordinates',
        'property_id',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id');
    }
}
