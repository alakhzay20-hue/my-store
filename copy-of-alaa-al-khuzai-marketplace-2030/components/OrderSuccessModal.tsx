
import React from 'react';

interface Props {
  orderId: string;
  onClose: () => void;
  onViewOrders: () => void;
}

const OrderSuccessModal: React.FC<Props> = ({ orderId, onClose, onViewOrders }) => {
  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-brand-midnight/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-[50px] overflow-hidden shadow-[0_50px_150px_-30px_rgba(0,0,0,1)] text-center p-12">
        <div className="w-24 h-24 accent-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-primary/40 animate-bounce">
          <span className="text-white text-5xl">✓</span>
        </div>
        
        <h2 className="text-3xl font-black text-brand-midnight mb-4">تم حجز مقتنياتك بنجاح!</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          شكراً لاختيارك متجر علاء الخزاعي. لقد تم تسجيل طلبك بنجاح تحت الرقم:
          <br />
          <span className="text-brand-primary font-black text-xl tracking-widest mt-2 block">{orderId}</span>
        </p>
        
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl mb-10">
          <p className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-2">الخطوة التالية</p>
          <p className="text-xs text-slate-600">سيقوم فريق الدعم الفني بالتواصل معك عبر <span className="font-bold text-brand-midnight">واتساب</span> خلال الـ 15 دقيقة القادمة لتأكيد الشحن.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={onViewOrders}
            className="w-full py-5 accent-gradient text-white font-black rounded-2xl shadow-xl hover:shadow-brand-primary/40 transition-all active:scale-95"
          >
            عرض قائمة طلباتي
          </button>
          <button 
            onClick={onClose}
            className="text-slate-400 text-xs font-bold hover:text-brand-midnight transition-colors"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
