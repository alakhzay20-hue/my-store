
import React, { useState } from 'react';
import { Product } from '../types';

interface PaymentModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (customerData: { name: string; whatsapp: string; email: string }) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ product, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!product) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = 'يرجى إدخال اسمك الكامل بشكل صحيح';
    if (!formData.whatsapp || formData.whatsapp.length < 8) newErrors.whatsapp = 'رقم الواتساب مطلوب للتواصل معك';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-midnight/60 backdrop-blur-md z-[7000] flex justify-center items-center p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-xl relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden text-right" dir="rtl">
        <div className="bg-brand-midnight p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-right">إتمام المقتنيات الملكية</h2>
            <p className="text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] text-right">Khuzai Secure Checkout</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-xl">✕</button>
        </div>

        <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Product Summary */}
          <div className="flex items-center gap-6 mb-10 p-5 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-brand-midnight line-clamp-1">{product.name}</h3>
              <p className="text-brand-teal font-black text-lg">{product.price}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
               <h3 className="text-brand-midnight font-black text-xs uppercase tracking-[0.2em]">بيانات التواصل والتوصيل</h3>
               <p className="text-slate-400 text-[10px] mt-1 italic">سنقوم باستخدام هذه البيانات لتأكيد الطلب وشحنه إليك.</p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">الاسم الكامل</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="أدخل اسمك كما في الهوية"
                className={`w-full bg-slate-50 border ${errors.name ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all`}
              />
              {errors.name && <span className="text-[10px] text-red-500 mt-1 block font-bold">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>رقم الواتساب</span>
                <span className="text-brand-primary">يفضل استخدام رقم فعال</span>
              </label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  placeholder="+964 7XX XXX XXXX"
                  className={`w-full bg-slate-50 border ${errors.whatsapp ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all pr-12`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🟢</span>
              </div>
              {errors.whatsapp && <span className="text-[10px] text-red-500 mt-1 block font-bold">{errors.whatsapp}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@domain.com"
                className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl py-4 px-6 text-sm focus:border-brand-primary outline-none transition-all`}
              />
              {errors.email && <span className="text-[10px] text-red-500 mt-1 block font-bold">{errors.email}</span>}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full mt-10 py-5 accent-gradient text-white font-black rounded-2xl text-lg shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all active:scale-[0.98] uppercase tracking-widest"
          >
            تأكيد الطلب وشراء الآن
          </button>

          <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="text-brand-teal text-lg">🛡️</span>
            عملية شراء مشفرة وفق معايير علاء الخزاعي 2030
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
