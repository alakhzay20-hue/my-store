
import React, { useState } from 'react';
import { Product, Review } from '../types';

interface Props {
  product: Product;
  onClose: () => void;
  onBuy: () => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  currentUser: { name: string } | null;
}

const ProductDetailsModal: React.FC<Props> = ({ product, onClose, onBuy, onAddReview, currentUser }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || rating === 0 || !comment.trim()) return;
    
    onAddReview(product.id, {
      userName: currentUser.name,
      rating,
      comment
    });
    
    setRating(0);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-brand-midnight/70 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-white rounded-[50px] overflow-hidden flex flex-col lg:flex-row shadow-[0_50px_150px_-30px_rgba(0,0,0,0.8)] h-[90vh] lg:h-[800px]">
        {/* Image Stage */}
        <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-12 relative overflow-hidden group border-l border-slate-100">
          <img src={product.image} className="max-w-full max-h-full object-contain rounded-[30px] shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-1000" alt={product.name} />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent"></div>
        </div>
        
        {/* Content Stage */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 bg-brand-midnight text-brand-primary text-[9px] font-black rounded-lg uppercase tracking-widest">Al-Khuzai Elite</span>
               <span className="text-slate-300 text-[10px] font-bold">SERIAL: {product.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-brand-midnight mb-4 leading-tight tracking-tighter">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-brand-primary text-sm">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star}>{star <= (product.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({product.reviewsCount || 0} تقييم)</span>
            </div>

            <div className="space-y-10 mb-16">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-brand-midnight font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                  المواصفات المختارة
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{product.description}</p>
              </div>

              {/* Reviews Section */}
              <div className="pt-10 border-t border-slate-100">
                <h3 className="text-xl font-black text-brand-midnight mb-8">آراء مقتني هذه القطعة</h3>
                
                {/* Leave a Review */}
                {currentUser ? (
                  <div className="bg-brand-midnight p-8 rounded-[35px] mb-10 text-white shadow-xl shadow-brand-primary/10">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-brand-primary">شاركنا تجربتك الملكية</h4>
                    <form onSubmit={handleSubmitReview}>
                      <div className="flex gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-2xl transition-all hover:scale-125"
                          >
                            <span className={star <= (hoverRating || rating) ? 'text-brand-primary' : 'text-white/20'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="اكتب انطباعك عن هذه التحفة الفنية..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-brand-primary transition-all mb-4 resize-none h-24"
                      />
                      <button 
                        type="submit"
                        disabled={rating === 0 || !comment.trim()}
                        className="accent-gradient text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg disabled:opacity-30"
                      >
                        نشر المراجعة
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center mb-10">
                    <p className="text-xs font-bold text-slate-400 italic">يرجى تسجيل الدخول لترك تقييم لهذه القطعة.</p>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map(rev => (
                      <div key={rev.id} className="p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-brand-midnight text-xs">{rev.userName}</span>
                          <span className="text-[9px] font-bold text-slate-300">{rev.date}</span>
                        </div>
                        <div className="flex text-brand-primary text-[10px] mb-3">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s}>{s <= rev.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center opacity-30">
                      <span className="text-3xl block mb-2">💬</span>
                      <p className="text-xs font-bold">لا توجد مراجعات حالياً. كن أول من يقتنيها!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 border-t border-slate-100 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-black text-brand-midnight">{product.price}</span>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {onBuy(); onClose();}}
                className="flex-1 py-5 accent-gradient text-white font-black rounded-[20px] shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all transform active:scale-95 text-sm uppercase tracking-widest"
              >
                إضافة لمجموعة علاء الخزاعي
              </button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-brand-midnight text-2xl transition-colors z-50">✕</button>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
