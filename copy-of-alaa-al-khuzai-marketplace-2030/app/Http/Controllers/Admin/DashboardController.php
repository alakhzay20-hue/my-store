
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * عرض لوحة التحكم.
     * تم التحقق من الـ Middleware 'admin' مسبقاً في ملف المسارات.
     */
    public function index()
    {
        // نمرر متغير للواجهة يخبر React أننا في وضع الإدارة
        // أو ببساطة نعيد عرض نفس الـ View الرئيسي لـ React وهو سيتولى الباقي بناءً على صلاحيات المستخدم
        return view('index', [
            'isAdminView' => true,
            'user' => auth()->user()
        ]);
    }
}
