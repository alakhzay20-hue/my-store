<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'image_url',
        'category',
        'stock_quantity',
        'is_active',
        'meta_data'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'meta_data' => 'array',
        'price' => 'decimal:2'
    ];
}
