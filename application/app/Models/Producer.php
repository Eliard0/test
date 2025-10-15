<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producer extends Model
{
    use HasFactory;

    protected $table = 'producers';

    protected $fillable = [
        'name',
        'cpf_cnpj',
        'phone',
        'email',
        'address',
        'date_registration',
    ];

    public function properties() : HasMany {
        return $this->hasMany(Property::class, 'producer_id');
    }
}
