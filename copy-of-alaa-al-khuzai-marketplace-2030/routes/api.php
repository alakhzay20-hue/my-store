
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandingController;

/*
|--------------------------------------------------------------------------
| Admin Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // إدارة المنتجات
    Route::apiResource('products', ProductController::class);
    
    // إدارة الفئات
    Route::post('categories/toggle/{id}', [CategoryController.class, 'toggleActive']);
    Route::apiResource('categories', CategoryController::class);
    
    // إدارة الهوية البصرية
    Route::post('branding/upload', [BrandingController.class, 'upload']);
    Route::delete('branding/delete', [BrandingController.class, 'delete']);
    
    // الإحصائيات
    Route::get('stats', function() {
        return [
            'total_products' => \App\Models\Product::count(),
            'active_categories' => \App\Models\Category::where('isActive', true)->count(),
            'total_orders' => \App\Models\Order::count(),
        ];
    });
});
