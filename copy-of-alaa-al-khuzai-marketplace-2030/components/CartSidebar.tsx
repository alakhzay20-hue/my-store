
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout }) => {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-brand-midnight/40 backdrop-blur-sm z-[6000] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 left-0 h-full w-full md:w-[400px] bg-white z-[6001] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-brand-midnight text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">سلة علاء الخزاعي</h2>
            <p className="text-[10px] text-brand-primary uppercase tracking-widest font-bold">Al-Khuzai Luxury Logistics</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-6xl grayscale opacity-20 text-brand-primary">👜</span>
              <p className="text-slate-400 text-sm">السلة فارغة حالياً. ابدأ باكتشاف مجموعة علاء الخزاعي.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="text-sm font-bold text-brand-midnight line-clamp-1 mb-1">{item.name}</h4>
                  <p className="text-brand-teal text-xs font-bold mb-2">{item.price}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-slate-100 rounded-lg">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 hover:bg-slate-50">-</button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 hover:bg-slate-50">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-[10px] text-red-400 font-bold hover:underline">إزالة</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">إجمالي الطلب</span>
              <span className="text-2xl font-black text-brand-midnight">${total.toLocaleString()}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 accent-gradient text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all active:scale-95"
            >
              إتمام الدفع الآمن
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-bold">🔒 شحن جوي سريع مؤمن بواسطة الخزاعي</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
