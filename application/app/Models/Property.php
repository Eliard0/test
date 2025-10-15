<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $table = 'properties';

    protected $fillable = [
        'name',
        'municipality',
        'uf',
        'state_registration',
        'area_total',
        'producer_id',
    ];

    public function producer() : BelongsTo {
        return $this->belongsTo(Producer::class, 'producer_id');
    }

    public function herds() : HasMany {
        return $this->hasMany(Herd::class, 'property_id');
    }

    public function productionUnits() : HasMany {
        return $this->hasMany(ProductionUnit::class, 'property_id');
    }
}
