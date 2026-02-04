
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BrandingController extends Controller
{
    /**
     * معالجة رفع ملفات الهوية (الشعار أو الأيقونة).
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg,ico|max:2048',
            'type' => 'required|string|in:logo,favicon'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type = $request->type;
        $file = $request->file('file');
        
        // تسمية الملف بوضوح لسهولة الوصول
        $filename = "brand_{$type}." . $file->getClientOriginalExtension();
        
        // حفظ الملف في المسار العام
        $path = $file->storeAs('branding', $filename, 'public');
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'url' => $url,
            'message' => 'تم تحديث الهوية البصرية بنجاح.'
        ]);
    }

    /**
     * مسح الهوية والعودة للافتراضي.
     */
    public function delete(Request $request)
    {
        $type = $request->type;
        $files = Storage::disk('public')->files('branding');
        
        foreach ($files as $file) {
            if (str_contains($file, "brand_{$type}")) {
                Storage::disk('public')->delete($file);
            }
        }

        return response()->json(['success' => true, 'message' => 'تم حذف الملف.']);
    }
}
