
import React from 'react';
import { Order } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const CustomerOrdersModal: React.FC<Props> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[7500] flex items-center justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-brand-midnight/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-xl h-full bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 bg-brand-midnight text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">مقتنياتي المحجوزة</h2>
            <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Al-Khuzai Personal Collection</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <span className="text-6xl mb-4">📦</span>
              <p className="text-sm font-bold">لم تقم بحجز أي مقتنيات حتى الآن.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-slate-50 rounded-[35px] border border-slate-100 p-8 hover:border-brand-primary/30 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">رقم الطلب</span>
                    <span className="text-brand-midnight font-black">{order.id}</span>
                  </div>
                  <div className="text-left">
                    <span className="bg-brand-teal/10 text-brand-teal text-[10px] px-3 py-1 rounded-full font-black uppercase">محجوز ومدفوع</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={item.name} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-brand-midnight line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-slate-500">الكمية: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-black">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold">{order.date}</span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block mb-1">الإجمالي</span>
                    <span className="text-xl font-black text-brand-primary">{order.total}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">نظام التتبع الذكي 2030</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersModal;
