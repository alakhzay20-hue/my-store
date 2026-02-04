<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    /**
     * معالجة الطلب النهائي وحفظ بيانات التواصل.
     */
    public function handleOrder(Request $request)
    {
        // 1. قواعد التحقق (Validation Rules)
        $validator = Validator::make($request->all(), [
            'customer_name'     => 'required|string|min:3|max:255',
            'customer_whatsapp' => 'required|regex:/^\+?[1-9]\d{1,14}$/', // يدعم الأرقام الدولية
            'customer_email'    => 'required|email',
            'cart_items'        => 'required|array|min:1',
            'total'             => 'required|numeric'
        ], [
            'customer_name.required'     => 'يرجى إدخال الاسم الكامل.',
            'customer_whatsapp.required' => 'رقم الواتساب ضروري للتواصل بشأن التوصيل.',
            'customer_whatsapp.regex'    => 'يرجى إدخال رقم هاتف صحيح بصيغة دولية.',
            'customer_email.email'       => 'البريد الإلكتروني المدخل غير صحيح.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. استخدام Transaction لضمان سلامة البيانات
        return DB::transaction(function () use ($request) {
            $order = Order::create([
                'user_id'           => auth()->id(), // null في حال كان زائر
                'customer_name'     => $request->customer_name,
                'customer_whatsapp' => $request->customer_whatsapp,
                'customer_email'    => $request->customer_email,
                'total'             => $request->total,
                'status'            => 'paid', // نفترض نجاح الدفع
                'gateway'           => $request->gateway ?? 'stripe',
                'payment_id'        => $request->payment_id,
            ]);

            // حفظ تفاصيل المنتجات
            foreach ($request->cart_items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الطلب بنجاح، سيتم التواصل معكم عبر واتساب.',
                'order_id' => $order->id
            ]);
        });
    }
}
