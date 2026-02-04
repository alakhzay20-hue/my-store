
<!-- Checkout Form Example (Blade Implementation) -->
<form action="{{ route('checkout.process') }}" method="POST" class="space-y-6" dir="rtl">
    @csrf
    
    <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-6">بيانات التواصل الملكية</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
                <label for="customer_name" class="block text-xs font-bold text-gray-500 uppercase mb-2">الاسم الكامل</label>
                <input type="text" name="customer_name" id="customer_name" 
                       class="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-500 outline-none"
                       placeholder="مثال: علاء الخزاعي" required>
                @error('customer_name') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <!-- WhatsApp Number -->
            <div>
                <label for="customer_whatsapp" class="block text-xs font-bold text-gray-500 uppercase mb-2">رقم الواتساب (للتواصل الفوري)</label>
                <div class="relative">
                    <input type="tel" name="customer_whatsapp" id="customer_whatsapp" 
                           class="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-500 outline-none"
                           placeholder="+964 770 000 0000" required>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">🟢</span>
                </div>
                @error('customer_whatsapp') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <!-- Email Address -->
            <div class="md:col-span-2">
                <label for="customer_email" class="block text-xs font-bold text-gray-500 uppercase mb-2">البريد الإلكتروني</label>
                <input type="email" name="customer_email" id="customer_email" 
                       class="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-green-500 outline-none"
                       placeholder="name@example.com" required>
                @error('customer_email') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>
        </div>
    </div>

    <button type="submit" class="w-full py-5 bg-green-500 text-white font-black rounded-2xl shadow-xl hover:bg-green-600 transition-all">
        تأكيد الطلب والدفع
    </button>
</form>
