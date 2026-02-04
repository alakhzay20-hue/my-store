
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| Al-Khuzai Marketplace Web Routes
|--------------------------------------------------------------------------
*/

// مسار المتجر (متاح للجميع)
Route::get('/', function () {
    return view('index');
})->name('store.home');

// مجموعة مسارات الإدارة المحمية
// ملاحظة: يجب أن يكون الـ alias 'admin' مسجلاً في Kernel.php ليعمل
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    
    // واجهة لوحة التحكم الرئيسية
    Route::get('/dashboard', [DashboardController.class, 'index'])->name('admin.dashboard');
    
    // مسارات إدارة المنتجات (Web Views)
    Route::get('/products', [DashboardController.class, 'products'])->name('admin.products');
    
    // مسارات إدارة الطلبات
    Route::get('/orders', [DashboardController.class, 'orders'])->name('admin.orders');
});

// مسار الدخول (Guest)
Route::middleware('guest')->group(function () {
    Route::get('/login', function() { return view('auth.login'); })->name('login');
});
