
import React, { useState, useRef, useEffect } from 'react';
import { Category, Product, CategoryName } from '../types';
import { generateFullProduct, generateProductImage, generateBrandLogo, generateBrandFavicon, generateBrandHeroImage } from '../services/geminiService';

interface AdminPanelProps {
  isOpen: boolean;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onToggle: () => void;
  categories: Category[];
  onAddCategory: (name: CategoryName) => void;
  onDeleteCategory: (id: string) => void;
  onToggleCategory: (id: string) => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  onUpdateLogo: (logoUrl: string) => void;
  onUpdateFavicon: (faviconUrl: string) => void;
  onUpdateHeroImage: (heroUrl: string) => void;
  onUpdateAdminPassword: (newPass: string) => void;
  currentLogo: string | null;
  currentFavicon: string | null;
  currentHeroImage: string | null;
  currentAdminPassword: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onAddProduct, 
  onUpdateProduct,
  onToggle, 
  categories, 
  onAddCategory,
  onDeleteCategory,
  onToggleCategory,
  editingProduct,
  setEditingProduct,
  onUpdateLogo,
  onUpdateFavicon,
  onUpdateHeroImage,
  onUpdateAdminPassword,
  currentLogo,
  currentFavicon,
  currentHeroImage,
  currentAdminPassword
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'categories' | 'branding'>('ai');
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBrandingGenerating, setIsBrandingGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const [newPassInput, setNewPassInput] = useState(currentAdminPassword);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);

  const [newCatName, setNewCatName] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualCategory, setManualCategory] = useState<CategoryName>(categories[0]?.name || 'treasury');
  const [manualDescription, setManualDescription] = useState('');
  const [manualStock, setManualStock] = useState<number>(10);
  const [manualImage, setManualImage] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setManualName(editingProduct.name);
      setManualPrice(editingProduct.price.replace(' $', ''));
      setManualCategory(editingProduct.category);
      setManualDescription(editingProduct.description);
      setManualImage(editingProduct.image);
      setManualStock(editingProduct.stockQuantity || 0);
      setActiveTab('manual');
    } else if (isOpen) {
      resetManualForm();
    }
  }, [editingProduct, isOpen]);

  const resetManualForm = () => {
    setManualName('');
    setManualPrice('');
    setManualDescription('');
    setManualImage(null);
    setManualStock(10);
    setManualCategory(categories[0]?.name || 'treasury');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPrice || !manualImage) {
      alert('يرجى ملء جميع الحقول الإلزامية بما في ذلك صورة المنتج.');
      return;
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: manualName,
      price: `${manualPrice} $`,
      description: manualDescription,
      category: manualCategory,
      image: manualImage,
      isActive: true,
      stockQuantity: manualStock,
      rating: editingProduct?.rating || 5,
      reviewsCount: editingProduct?.reviewsCount || 0,
      reviews: editingProduct?.reviews || []
    };

    if (editingProduct) onUpdateProduct(productData);
    else onAddProduct(productData);

    resetManualForm();
    onToggle();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'product' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'logo') onUpdateLogo(base64);
        else if (type === 'favicon') onUpdateFavicon(base64);
        else if (type === 'product') setManualImage(base64);
        else if (type === 'hero') onUpdateHeroImage(base64);
        
        setStatus(`تم تجهيز ${type === 'product' ? 'صورة المنتج' : type === 'logo' ? 'الشعار' : type === 'hero' ? 'صورة الهوية' : 'الأيقونة'} بنجاح!`);
        setTimeout(() => setStatus(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBranding = async (type: 'logo' | 'favicon' | 'hero') => {
    setIsBrandingGenerating(true);
    setStatus(`جاري ابتكار ${type === 'logo' ? 'شعار' : type === 'hero' ? 'صورة هوية' : 'أيقونة'} الخزاعي 2030...`);
    try {
      let url = '';
      if (type === 'logo') url = await generateBrandLogo();
      else if (type === 'favicon') url = await generateBrandFavicon();
      else if (type === 'hero') url = await generateBrandHeroImage();

      if (url) {
        if (type === 'logo') onUpdateLogo(url);
        else if (type === 'favicon') onUpdateFavicon(url);
        else if (type === 'hero') onUpdateHeroImage(url);
        setStatus('تم تحديث الهوية البصرية بنجاح!');
      }
    } finally {
      setIsBrandingGenerating(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleUpdatePass = () => {
    if (newPassInput.trim()) {
      onUpdateAdminPassword(newPassInput);
      setStatus('تم تحديث كلمة المرور بنجاح!');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full w-full md:w-[550px] bg-brand-midnight z-[9000] transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] shadow-[60px_0_120px_rgba(0,0,0,0.6)] overflow-y-auto border-r border-white/5 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-10 text-right" dir="rtl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-white font-black text-2xl tracking-tighter">كونسول الإدارة 2030</h2>
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Al-Khuzai Marketplace OS</p>
          </div>
          <button onClick={onToggle} className="w-10 h-10 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center border border-white/10">✕</button>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl mb-12 border border-white/5">
          {['ai', 'manual', 'categories', 'branding'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-primary text-brand-midnight shadow-lg shadow-brand-primary/20' : 'text-white/20 hover:text-white/60'}`}
            >
              {tab === 'ai' ? 'ذكاء اصطناعي' : tab === 'manual' ? 'يدوي' : tab === 'categories' ? 'الفئات' : 'الهوية'}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h4 className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">وصف فكرة المنتج</h4>
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="مثال: ساعة فاخرة من الكرستال الأسود تتصل بالمستقبل..."
                  className="w-full h-40 bg-transparent text-white focus:outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>
              <button 
                onClick={async () => {
                  setIsGenerating(true); setStatus('جاري التحليل الابتكاري...');
                  try {
                    const data = await generateFullProduct(idea);
                    const img = await generateProductImage(data.name || idea);
                    onAddProduct({ ...data as Product, id: Date.now().toString(), image: img, isActive: true });
                    setIdea(''); onToggle();
                  } finally { setIsGenerating(false); setStatus(''); }
                }}
                disabled={isGenerating || !idea}
                className="w-full py-5 accent-gradient text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 disabled:opacity-20 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : 'توليد ونشر ذكي ✨'}
              </button>
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-6 animate-in fade-in">
              <div 
                className="w-full h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-brand-primary/50 transition-all overflow-hidden relative group"
                onClick={() => productImageInputRef.current?.click()}
              >
                {manualImage ? (
                  <>
                    <img src={manualImage} className="w-full h-full object-cover" alt="Product Preview" />
                    <div className="absolute inset-0 bg-brand-midnight/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-black text-[10px] uppercase tracking-widest">تغيير الصورة</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl mb-3">📸</span>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">رفع صورة المنتج</span>
                  </>
                )}
                <input type="file" ref={productImageInputRef} onChange={(e) => handleFileUpload(e, 'product')} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-4">
                <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="اسم المنتج" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-primary/50 text-sm" />
                
                <div className="flex gap-4">
                  <input type="text" value={manualPrice} onChange={e => setManualPrice(e.target.value)} placeholder="السعر" className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-primary/50 text-sm" />
                  <select value={manualCategory} onChange={e => setManualCategory(e.target.value)} className="flex-1 bg-brand-midnight border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-primary/50 text-sm">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                   <label className="text-[10px] font-black text-white/30 uppercase block mb-2">كمية المخزون الأولي</label>
                   <input type="number" value={manualStock} onChange={e => setManualStock(parseInt(e.target.value))} className="w-full bg-transparent text-white outline-none text-sm" min="0" />
                </div>

                <textarea value={manualDescription} onChange={e => setManualDescription(e.target.value)} placeholder="وصف المنتج..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-primary/50 resize-none text-sm" />
              </div>
              
              <button type="submit" className="w-full py-4 bg-white text-brand-midnight font-black rounded-xl hover:bg-brand-primary transition-all active:scale-95 shadow-lg">
                {editingProduct ? 'تحديث البيانات' : 'حفظ ونشر القطعة'}
              </button>
            </form>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex gap-3">
                <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="اسم فئة جديدة..." className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-primary/50 text-sm" />
                <button onClick={() => { if(newCatName) { onAddCategory(newCatName); setNewCatName(''); } }} className="bg-brand-primary text-brand-midnight px-6 rounded-xl font-black text-xs">إضافة</button>
              </div>
              <div className="grid gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${cat.isActive ? 'bg-white/5 border-white/10' : 'bg-red-500/5 border-red-500/20 opacity-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${cat.isActive ? 'bg-brand-primary shadow-[0_0_8px_#32CD32]' : 'bg-red-500'}`}></div>
                      <div>
                        <span className="text-white font-bold text-sm block">{cat.name}</span>
                        <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">{cat.productCount} منتج</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onToggleCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${cat.isActive ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-brand-primary text-brand-midnight'}`}>
                        {cat.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                      <button onClick={() => onDeleteCategory(cat.id)} className="w-8 h-8 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-10 animate-in fade-in pb-10">
              <div className="grid grid-cols-1 gap-8">
                {/* Security Section */}
                <div className="bg-white/5 p-6 rounded-3xl border border-brand-primary/20 shadow-[0_0_30px_rgba(50,205,50,0.05)]">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-brand-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                       <span className="text-lg">🔐</span> إعدادات أمان البوابة
                     </h3>
                   </div>
                   <div className="flex gap-3">
                     <input 
                       type="text" 
                       value={newPassInput} 
                       onChange={e => setNewPassInput(e.target.value)} 
                       placeholder="كلمة المرور الجديدة" 
                       className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-primary/50 text-sm font-black tracking-widest"
                     />
                     <button 
                       onClick={handleUpdatePass}
                       className="bg-brand-primary text-brand-midnight px-6 rounded-xl font-black text-[10px] uppercase transition-all hover:scale-105 active:scale-95"
                     >
                       تحديث 🗝️
                     </button>
                   </div>
                   <p className="text-[8px] text-white/20 font-bold mt-3 text-center uppercase tracking-widest italic">ملاحظة: هذه الكلمة هي مفتاح الدخول للوحة التحكم</p>
                </div>

                {/* Logo Section */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-brand-primary font-black uppercase tracking-widest text-[10px]">الشعار الرئيسي (Logo)</h3>
                     <div className="flex gap-3">
                        <button onClick={() => handleGenerateBranding('logo')} disabled={isBrandingGenerating} className="text-[9px] text-brand-primary/60 hover:text-brand-primary transition-colors">توليد AI ✨</button>
                        <button onClick={() => logoInputRef.current?.click()} className="text-[9px] text-white/40 hover:text-white transition-colors">رفع يدوي ⬆️</button>
                     </div>
                  </div>
                  <input type="file" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" accept="image/*" />
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-brand-midnight border border-white/10 flex items-center justify-center shadow-inner group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    {currentLogo ? <img src={currentLogo} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform" /> : <span className="text-white/10 font-black text-3xl">LOGO</span>}
                  </div>
                </div>

                {/* Hero Image Section */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-brand-primary font-black uppercase tracking-widest text-[10px]">صورة الهوية المتكاملة (Brand Hero)</h3>
                     <div className="flex gap-3">
                        <button onClick={() => handleGenerateBranding('hero')} disabled={isBrandingGenerating} className="text-[9px] text-brand-primary/60 hover:text-brand-primary transition-colors">توليد AI ✨</button>
                        <button onClick={() => heroInputRef.current?.click()} className="text-[9px] text-white/40 hover:text-white transition-colors">رفع يدوي ⬆️</button>
                     </div>
                  </div>
                  <input type="file" ref={heroInputRef} onChange={(e) => handleFileUpload(e, 'hero')} className="hidden" accept="image/*" />
                  <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-brand-midnight border border-white/10 flex items-center justify-center shadow-inner group cursor-pointer" onClick={() => heroInputRef.current?.click()}>
                    {currentHeroImage ? <img src={currentHeroImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <span className="text-white/10 font-black text-sm uppercase tracking-widest">Brand Visual</span>}
                  </div>
                </div>

                {/* Favicon Section */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-brand-primary font-black uppercase tracking-widest text-[10px]">أيقونة المتصفح (Favicon)</h3>
                     <div className="flex gap-3">
                        <button onClick={() => handleGenerateBranding('favicon')} disabled={isBrandingGenerating} className="text-[9px] text-brand-primary/60 hover:text-brand-primary transition-colors">توليد AI ✨</button>
                        <button onClick={() => faviconInputRef.current?.click()} className="text-[9px] text-white/40 hover:text-white transition-colors">رفع يدوي ⬆️</button>
                     </div>
                  </div>
                  <input type="file" ref={faviconInputRef} onChange={(e) => handleFileUpload(e, 'favicon')} className="hidden" accept="image/*" />
                  <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-brand-midnight border border-white/10 flex items-center justify-center shadow-inner group cursor-pointer" onClick={() => faviconInputRef.current?.click()}>
                    {currentFavicon ? <img src={currentFavicon} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform" /> : <span className="text-white/10 font-black text-lg">ICON</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {status && <p className="fixed bottom-10 left-10 text-brand-teal font-black animate-pulse text-[10px] tracking-widest uppercase bg-brand-midnight/80 backdrop-blur-md px-6 py-3 rounded-full border border-brand-teal/20 z-[9001] shadow-2xl">{status}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
