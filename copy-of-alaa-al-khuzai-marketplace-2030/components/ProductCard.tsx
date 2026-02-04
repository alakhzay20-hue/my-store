
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy, className = "" }) => {
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div 
      className={`relative flex flex-col h-full bg-white p-6 rounded-[48px] border border-slate-100/60 shadow-sm hover-lift cursor-pointer group animate-fade-in-up overflow-hidden ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''} ${className}`}
      onClick={() => !isOutOfStock && onBuy(product)}
    >
      {/* Decorative background element */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-[36px] bg-slate-50 border border-slate-100/50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover img-zoom" 
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 items-end">
          <span className="glass-card px-5 py-2 rounded-2xl text-[10px] font-black text-brand-midnight uppercase tracking-widest shadow-xl border border-white/50">
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl">
              نفذت الكمية ❌
            </span>
          )}
        </div>
        
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/60 via-brand-midnight/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Reveal Button */}
        {!isOutOfStock && (
          <div className="absolute bottom-8 left-8 right-8 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)]">
            <button className="w-full py-4 bg-white/95 backdrop-blur-md text-brand-midnight font-black text-[11px] uppercase tracking-[0.25em] rounded-2xl shadow-2xl hover:bg-brand-primary hover:text-white transition-all transform active:scale-95">
              اكتشف التفاصيل
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col px-3">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="flex text-brand-primary text-[11px] gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < (product.rating || 5) ? 'opacity-100 drop-shadow-sm' : 'opacity-20'}>★</span>
              ))}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">({product.reviewsCount || 0})</span>
          </div>
          <span className="text-slate-200 text-[9px] font-black tracking-widest bg-slate-50/80 px-3 py-1 rounded-xl">KH-{product.id.slice(-4).toUpperCase()}</span>
        </div>

        <h3 className="text-xl font-bold text-brand-midnight line-clamp-2 mb-8 leading-tight group-hover:text-brand-primary transition-colors duration-500 min-h-[56px] tracking-tight">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
               <span className={`w-1.5 h-1.5 ${isOutOfStock ? 'bg-red-500' : 'bg-brand-primary'} rounded-full animate-pulse`}></span>
               <span className={`text-[9px] ${isOutOfStock ? 'text-red-500' : 'text-brand-primary'} font-black uppercase tracking-[0.35em]`}>
                 {isOutOfStock ? 'Out of Stock' : 'Elite Tier'}
               </span>
            </div>
            <span className="text-3xl font-black text-brand-midnight tracking-tighter group-hover:text-brand-primary transition-all duration-500">
              {product.price}
            </span>
          </div>

          <button 
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onBuy(product);
            }}
            className={`h-16 w-16 ${isOutOfStock ? 'bg-slate-100 cursor-not-allowed' : 'accent-gradient hover:rotate-[15deg] hover:scale-110'} flex items-center justify-center rounded-[24px] shadow-2xl transition-all tap-active group-hover:scale-110`}
          >
            <span className={`${isOutOfStock ? 'text-slate-300' : 'text-white'} text-4xl font-light leading-none`}>
              {isOutOfStock ? '✕' : '+'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
