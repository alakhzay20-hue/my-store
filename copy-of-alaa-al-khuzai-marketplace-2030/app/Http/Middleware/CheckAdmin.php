
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    /**
     * معالجة الطلب الوارد وضمان وصول الإدارة فقط.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. التحقق من أن المستخدم مسجل دخول
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthenticated', 'message' => 'يجب تسجيل الدخول أولاً.'], 401);
            }
            return redirect()->route('login')->with('error', 'يرجى تسجيل الدخول للوصول لهذه المنطقة.');
        }

        // 2. التحقق من أن المستخدم يحمل دور 'admin'
        if (Auth::user()->role !== 'admin') {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Unauthorized Access',
                    'message' => 'عذراً، هذه المنطقة مخصصة لإدارة "علاء الخزاعي" فقط.'
                ], 403);
            }
            
            // تحويل العميل للمتجر مع رسالة تحذيرية
            return redirect()->route('store.home')->with('error', 'ليس لديك الصلاحيات الكافية لدخول لوحة التحكم.');
        }

        return $next($request);
    }
}
