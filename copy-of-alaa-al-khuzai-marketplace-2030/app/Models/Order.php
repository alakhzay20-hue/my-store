<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * الحقول القابلة للتعبئة لضمان الحماية من (Mass Assignment).
     */
    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_whatsapp',
        'customer_email',
        'total',
        'status',
        'gateway',
        'payment_id'
    ];

    /**
     * علاقة الطلب بالعناصر المشتراة.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * علاقة الطلب بالمستخدم (إن وجد).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
