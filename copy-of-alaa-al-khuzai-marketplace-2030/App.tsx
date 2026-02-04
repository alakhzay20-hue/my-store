
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, CartItem, Order, Review, CategoryName, User, OrderStatus } from './types';
import AdminPanel from './components/AdminPanel';
import ProductCard from './components/ProductCard';
import PaymentModal from './components/PaymentModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import RoyalConcierge from './components/RoyalConcierge';
import CartSidebar from './components/CartSidebar';
import OrderSuccessModal from './components/OrderSuccessModal';
import CustomerOrdersModal from './components/CustomerOrdersModal';

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'clothes', isActive: true, productCount: 1 },
  { id: '2', name: 'treasury', isActive: true, productCount: 0 },
  { id: '3', name: 'electronics', isActive: true, productCount: 1 },
  { id: '4', name: 'art', isActive: true, productCount: 1 }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "نظام الصوت Neural - إصدار علاء الخزاعي الخاص",
    price: "499.00 $",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800",
    description: "أول نظام صوتي يتكيف مع نبضات دماغك لتقديم تجربة استماع شخصية تماماً، بإشراف مهني من مختبرات الخزاعي.",
    category: 'electronics',
    isActive: true,
    rating: 5,
    reviewsCount: 1,
    stockQuantity: 15,
    reviews: [{ id: 'r1', userName: 'أحمد النجار', rating: 5, comment: 'صوت مذهل ونقاء لم أعهده من قبل.', date: '2023-11-15' }]
  },
  {
    id: '2',
    name: "رداء نسيج النجوم",
    price: "2,500.00 $",
    image: "https://images.unsplash.com/photo-1539109136881-3be0610cac48?q=80&w=800",
    description: "رداء فريد من نوعه مصنوع من خيوط الحرير الطبيعي المعالج جزيئياً ليعكس الضوء بطريقة تحاكي مجرة درب التبانة.",
    category: 'clothes',
    isActive: true,
    rating: 5,
    reviewsCount: 12,
    stockQuantity: 3,
    reviews: []
  },
  {
    id: '3',
    name: "ساعة الزمن الرقمي 2050",
    price: "1,200.00 $",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
    description: "ساعة فاخرة تستخدم تقنية العرض الهولوغرامي لعرض الوقت والبيانات الحيوية بدقة ميكرونية.",
    category: 'treasury',
    isActive: true,
    rating: 4.8,
    reviewsCount: 45,
    stockQuantity: 8,
    reviews: []
  },
  {
    id: '4',
    name: "منحوتة 'الجوهر' الكريستالية",
    price: "5,800.00 $",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800",
    description: "قطعة فنية يدوية الصنع من الكريستال الخام، تمثل الانصهار بين الطبيعة والتكنولوجيا المستقبلية.",
    category: 'art',
    isActive: true,
    rating: 5,
    reviewsCount: 2,
    stockQuantity: 1,
    reviews: []
  }
];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [adminSubTab, setAdminSubTab] = useState<'products' | 'orders' | 'reports' | 'inventory'>('products');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [customFavicon, setCustomFavicon] = useState<string | null>(null);
  const [brandHeroImage, setBrandHeroImage] = useState<string | null>(null);
  
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [payingProduct, setPayingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'all'>('all');

  const [showGateModal, setShowGateModal] = useState(false);
  const [gatePassword, setGatePassword] = useState('');
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('khuzai_admin_pass') || '2030');
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('khuzai_user');
    return saved ? JSON.parse(saved) : { id: 'guest', name: 'ضيف الخزاعي', role: 'customer', email: '' };
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('khuzai_market_final_v1');
    setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);
    const savedCats = localStorage.getItem('khuzai_cats_final_v2');
    setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);
    const savedCart = localStorage.getItem('khuzai_cart_final_v1');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedOrders = localStorage.getItem('khuzai_orders_final_v1');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    const savedLogo = localStorage.getItem('khuzai_brand_logo');
    if (savedLogo) setCustomLogo(savedLogo);
    const savedFavicon = localStorage.getItem('khuzai_brand_favicon');
    if (savedFavicon) setCustomFavicon(savedFavicon);
    const savedHero = localStorage.getItem('khuzai_brand_hero');
    if (savedHero) setBrandHeroImage(savedHero);
  }, []);

  useEffect(() => { localStorage.setItem('khuzai_market_final_v1', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('khuzai_cats_final_v2', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('khuzai_cart_final_v1', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('khuzai_orders_final_v1', JSON.stringify(orders)); }, [orders]);

  const financialReports = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'returned');
    const totalRevenue = validOrders.reduce((sum, o) => sum + parseFloat(o.total.replace(/[^0-9.]/g, '')), 0);
    const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
    const catStats: Record<string, number> = {};
    validOrders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.category || 'عام';
        catStats[cat] = (catStats[cat] || 0) + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity);
      });
    });
    return { totalRevenue, avgOrderValue, catStats, orderCount: validOrders.length };
  }, [orders]);

  const orderStats = useMemo(() => {
    return {
      pending: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      returned: orders.filter(o => o.status === 'returned').length,
    };
  }, [orders]);

  const activeCategories = useMemo(() => categories.filter(c => c.isActive), [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory && p.isActive;
    });
  }, [products, searchQuery, selectedCategory]);

  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      productCount: products.filter(p => p.category === cat.name).length
    }));
  }, [categories, products]);

  const addProduct = (p: Product) => setProducts([p, ...products]);
  const updateProduct = (updated: Product) => setProducts(products.map(p => p.id === updated.id ? updated : p));
  const updateStock = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 800);
  };

  const createOrder = (items: CartItem[], total: string, customerData: { name: string; whatsapp: string; email: string }) => {
    const newOrder: Order = {
      id: `AK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      customerName: customerData.name,
      customerWhatsapp: customerData.whatsapp,
      customerEmail: customerData.email,
      total,
      status: 'paid',
      date: new Date().toLocaleDateString('ar-EG'),
      items,
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      shippingCompany: 'أرامكس الملكية'
    };
    setProducts(prev => prev.map(p => {
      const cartItem = items.find(item => item.id === p.id);
      return cartItem ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - cartItem.quantity) } : p;
    }));
    setOrders(prev => [newOrder, ...prev]);
    setSuccessOrderId(newOrder.id);
    setCart([]);
    setPayingProduct(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleAdminGateAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (gatePassword === adminPassword) {
      setCurrentUser({ id: 'admin-01', name: 'علاء الخزاعي', role: 'admin', email: 'admin@khuzai.com' });
      setViewMode('admin');
      setShowGateModal(false);
      setGatePassword('');
    } else alert('الرمز السري غير صحيح.');
  };

  const LogoComponent = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center font-black text-white select-none ${!customLogo ? 'accent-gradient rounded-[22px] border border-white/20 shadow-lg' : ''} ${className}`}>
      {customLogo ? <img src={customLogo} className="h-full w-auto object-contain" alt="Logo" /> : 'ع'}
    </div>
  );

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      pending: 'bg-slate-100 text-slate-500',
      paid: 'bg-blue-50 text-blue-600',
      shipped: 'bg-orange-50 text-orange-600',
      delivered: 'bg-green-50 text-green-600',
      returned: 'bg-purple-50 text-purple-600',
      cancelled: 'bg-red-50 text-red-600'
    };
    const labels: Record<OrderStatus, string> = {
      pending: 'قيد الانتظار', paid: 'مدفوع / جديد', shipped: 'تم الشحن', delivered: 'تم التوصيل', returned: 'مرتجع', cancelled: 'ملغى'
    };
    return <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current opacity-80 ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col font-plex bg-surface-light text-right" dir="rtl">
      
      {currentUser?.role === 'admin' && (
        <div className="bg-brand-midnight text-white px-6 py-1 flex justify-between items-center z-[6000] sticky top-0 backdrop-blur-md border-b border-white/5 shadow-xl">
          <div className="flex gap-4">
            <button onClick={() => setViewMode('store')} className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg transition-all ${viewMode === 'store' ? 'bg-brand-primary text-brand-midnight' : 'text-white/40 hover:text-white'}`}>المتجر</button>
            <button onClick={() => setViewMode('admin')} className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg transition-all ${viewMode === 'admin' ? 'bg-brand-primary text-brand-midnight' : 'text-white/40 hover:text-white'}`}>لوحة التحكم</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[8px] text-brand-primary font-black tracking-widest animate-pulse">● مسؤول النظام متصل</span>
            <button onClick={() => { setCurrentUser({ id: 'guest', name: 'ضيف الخزاعي', role: 'customer', email: '' }); setViewMode('store'); }} className="text-[8px] text-red-400 font-bold hover:underline">تسجيل الخروج</button>
          </div>
        </div>
      )}

      {viewMode === 'store' ? (
        <>
          <header className={`sticky top-0 z-[5000] bg-brand-midnight/95 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all`}>
            <div className="max-w-[1500px] mx-auto px-6 py-5 flex items-center justify-between gap-8">
              <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setViewMode('store')}>
                <LogoComponent className="h-14 w-auto min-w-[3.5rem] text-2xl" />
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-white font-black text-2xl tracking-tighter leading-none group-hover:text-brand-primary transition-colors">علاء الخزاعي</span>
                  <span className="text-brand-primary text-[8px] font-black tracking-[0.6em] mt-1.5 opacity-60">ESTABLISHED 2030</span>
                </div>
              </div>
              <div className="flex-1 max-w-2xl hidden md:block">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="ابحث في الكتالوج الملكي..." 
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-12 text-xs text-white outline-none focus:bg-white/10 focus:border-brand-primary/50 transition-all text-right placeholder:text-white/20" 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => { if(currentUser?.role === 'admin') setViewMode('admin'); else setShowGateModal(true); }} 
                  className="hidden lg:block text-white/50 hover:text-brand-primary text-[11px] font-black tracking-[0.2em] uppercase transition-all bg-white/5 border border-white/10 px-6 py-3 rounded-2xl"
                >
                  ⚙️ الإدارة
                </button>
                <button 
                  onClick={() => setIsCustomerOrdersOpen(true)} 
                  className="hidden lg:block text-white/50 hover:text-white text-[11px] font-black tracking-[0.2em] uppercase transition-all"
                >
                  📦 طلباتي
                </button>
                <div className={`relative cursor-pointer group tap-active ${isCartBouncing ? 'cart-bounce' : ''}`} onClick={() => setIsCartOpen(true)}>
                  <div className="w-14 h-14 rounded-[24px] border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all text-2xl shadow-inner">👜</div>
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-7 h-7 accent-gradient text-white text-[11px] font-black rounded-full flex items-center justify-center border-4 border-brand-midnight shadow-2xl">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden w-12 h-12 rounded-[20px] border border-white/10 flex items-center justify-center text-white/60"
                >
                  {isMobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>
            
            {/* Mobile Nav */}
            <div className={`md:hidden bg-brand-midnight/98 backdrop-blur-3xl transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-[300px] border-b border-white/5' : 'max-h-0'}`}>
               <div className="p-8 flex flex-col gap-6 text-center">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white" />
                  <div className="flex justify-center gap-8">
                    <button onClick={() => { setIsCustomerOrdersOpen(true); setIsMobileMenuOpen(false); }} className="text-white/60 font-black text-[10px] uppercase tracking-widest">📦 طلباتي</button>
                    <button onClick={() => { setShowGateModal(true); setIsMobileMenuOpen(false); }} className="text-white/60 font-black text-[10px] uppercase tracking-widest">⚙️ الإدارة</button>
                  </div>
               </div>
            </div>
          </header>

          <main className="max-w-[1500px] mx-auto w-full px-8 py-16 flex-1">
             {/* Category Filter */}
             <div className="flex flex-wrap gap-4 mb-24 justify-center animate-fade-in-up">
                <button 
                  onClick={() => setSelectedCategory('all')} 
                  className={`px-10 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-brand-midnight text-white shadow-2xl scale-110' : 'bg-white border border-slate-100 text-slate-400 hover:border-brand-primary/40 hover-lift'}`}
                >
                  الكل
                </button>
                {activeCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.name)} 
                    className={`px-10 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.name ? 'bg-brand-midnight text-white shadow-2xl scale-110' : 'bg-white border border-slate-100 text-slate-400 hover:border-brand-primary/40 hover-lift'}`}
                  >
                    {cat.name}
                  </button>
                ))}
             </div>

             {/* Dynamic Masonry Grid */}
             <div className="grid-dynamic min-h-[600px]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p, index) => {
                    let gridClass = "grid-item-standard";
                    if (index % 5 === 0) gridClass = "grid-item-featured";
                    else if (index % 3 === 0) gridClass = "grid-item-tall";
                    
                    return (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onBuy={(product) => setViewingProduct(product)} 
                        className={gridClass}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full py-40 text-center flex flex-col items-center opacity-30">
                    <span className="text-8xl mb-10 animate-float">✨</span>
                    <p className="text-2xl font-black uppercase tracking-[0.2em]">نحن بصدد تجهيز إصدارات ملكية جديدة...</p>
                  </div>
                )}
             </div>
          </main>
        </>
      ) : (
        <div className="max-w-[1500px] mx-auto w-full px-8 py-16 flex-1 animate-fade-in-up">
           <div className="flex justify-between items-end mb-16">
              <div>
                <h1 className="text-6xl font-black text-brand-midnight tracking-tighter">الكونسول العملياتي</h1>
                <p className="text-slate-400 text-lg font-bold mt-2">نظام إدارة مقتنيات الخزاعي المتكامل 2030.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 text-center min-w-[150px] shadow-sm">
                  <span className="block text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">جديد</span>
                  <span className="text-4xl font-black text-brand-midnight">{orderStats.pending}</span>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 text-center min-w-[150px] shadow-sm">
                  <span className="block text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">قيد الشحن</span>
                  <span className="text-4xl font-black text-brand-midnight">{orderStats.shipped}</span>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 text-center min-w-[150px] shadow-sm">
                  <span className="block text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-2">تم التوصيل</span>
                  <span className="text-4xl font-black text-brand-midnight">{orderStats.delivered}</span>
                </div>
              </div>
           </div>

           <div className="flex gap-5 mb-12 overflow-x-auto no-scrollbar pb-4">
             <button onClick={() => setAdminSubTab('products')} className={`px-12 py-5 rounded-[24px] text-[11px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap shadow-lg ${adminSubTab === 'products' ? 'bg-brand-midnight text-white shadow-brand-midnight/20' : 'bg-white border border-slate-100 text-slate-400'}`}>إدارة المقتنيات</button>
             <button onClick={() => setAdminSubTab('orders')} className={`px-12 py-5 rounded-[24px] text-[11px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap shadow-lg ${adminSubTab === 'orders' ? 'bg-brand-midnight text-white shadow-brand-midnight/20' : 'bg-white border border-slate-100 text-slate-400'}`}>الطلبات والعمليات 🚛</button>
             <button onClick={() => setAdminSubTab('inventory')} className={`px-12 py-5 rounded-[24px] text-[11px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap shadow-lg ${adminSubTab === 'inventory' ? 'bg-brand-midnight text-white shadow-brand-midnight/20' : 'bg-white border border-slate-100 text-slate-400'}`}>إدارة المخزون 📦</button>
             <button onClick={() => setAdminSubTab('reports')} className={`px-12 py-5 rounded-[24px] text-[11px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap shadow-lg ${adminSubTab === 'reports' ? 'bg-brand-midnight text-white shadow-brand-midnight/20' : 'bg-white border border-slate-100 text-slate-400'}`}>التقارير المالية 📊</button>
           </div>

           <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] p-12 border border-slate-100 relative overflow-hidden animate-fade-in-up">
             {adminSubTab === 'orders' && (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-right border-separate border-spacing-y-6 min-w-[1000px]">
                    <thead>
                      <tr className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <th className="px-8 pb-4">تفاصيل العميل والطلب</th>
                        <th className="px-8 pb-4">بيانات التتبع والشحن</th>
                        <th className="px-8 pb-4">إجمالي القيمة</th>
                        <th className="px-8 pb-4 text-left">الحالة والعمليات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? orders.map(order => (
                        <tr key={order.id} className="bg-slate-50/50 hover:bg-slate-100 transition-all rounded-[35px] overflow-hidden group shadow-sm border border-transparent hover:border-slate-200">
                          <td className="px-8 py-10 rounded-r-[35px] border-y border-r border-slate-100">
                            <div className="flex flex-col">
                              <span className="font-black text-brand-midnight text-sm mb-2 uppercase tracking-tighter">{order.id}</span>
                              <span className="font-bold text-slate-800 text-lg">{order.customerName}</span>
                              <div className="flex gap-5 mt-3 opacity-60 text-[10px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><span className="text-brand-primary">📱</span> {order.customerWhatsapp}</span>
                                <span className="flex items-center gap-1.5"><span className="text-brand-primary">📅</span> {order.date}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-10 border-y border-slate-100">
                             <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] bg-brand-teal/5 px-3 py-1 rounded-lg self-start">
                                  {order.shippingCompany || 'أرامكس الملكية'}
                                </span>
                                <span className="text-xs font-bold text-slate-500 tracking-widest">
                                  {order.trackingNumber || 'بانتظار رقم التتبع...'}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-10 border-y border-slate-100">
                             <div className="flex flex-col">
                                <span className="text-2xl font-black text-brand-midnight tracking-tighter">{order.total}</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{order.items.length} قطع مختارة</span>
                             </div>
                          </td>
                          <td className="px-8 py-10 rounded-l-[35px] border-y border-l border-slate-100">
                             <div className="flex items-center gap-6 justify-end">
                                {getStatusBadge(order.status)}
                                <div className="flex gap-3">
                                  {order.status === 'paid' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'shipped')} 
                                      className="bg-orange-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:brightness-110 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                                    >
                                      شحن 🚛
                                    </button>
                                  )}
                                  {order.status === 'shipped' && (
                                    <button 
                                      onClick={() => updateOrderStatus(order.id, 'delivered')} 
                                      className="bg-green-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:brightness-110 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                                    >
                                      توصيل ✅
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setSelectedOrderForInvoice(order)} 
                                    title="إصدار فاتورة ملكية"
                                    className="bg-white border border-slate-100 w-12 h-12 rounded-[20px] flex items-center justify-center text-xl hover:bg-brand-midnight hover:text-white transition-all shadow-md group-hover:scale-110"
                                  >
                                    📑
                                  </button>
                                </div>
                             </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="text-center py-32 opacity-30 font-bold text-lg">لا توجد طلبات معالجة حالياً.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
             )}

             {adminSubTab === 'products' && (
               <div className="animate-fade-in-up">
                  <div className="flex justify-between items-center mb-16 text-right">
                    <h3 className="text-4xl font-black text-brand-midnight tracking-tighter">المقتنيات الحصرية</h3>
                    <button 
                      onClick={() => { setEditingProduct(null); setIsAdminOpen(true); }} 
                      className="accent-gradient text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase shadow-2xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
                    >
                      + إضافة قطعة ملكية
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map(p => (
                      <div key={p.id} className="bg-slate-50 p-8 rounded-[44px] border border-slate-100 flex items-center gap-8 group hover:border-brand-primary/30 transition-all shadow-sm">
                         <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-lg border-2 border-white">
                           <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-brand-midnight text-base line-clamp-1">{p.name}</h4>
                            <span className="text-brand-primary font-black text-xl block my-2 tracking-tighter">{p.price}</span>
                            <div className="flex gap-4">
                               <button onClick={() => { setEditingProduct(p); setIsAdminOpen(true); }} className="text-[10px] font-black text-slate-400 hover:text-brand-midnight uppercase tracking-widest">تعديل</button>
                               <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest">حذف</button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {adminSubTab === 'inventory' && (
               <div className="animate-fade-in-up space-y-6">
                  <h3 className="text-3xl font-black text-brand-midnight mb-10 tracking-tighter px-4 border-r-4 border-brand-primary pr-6">العمليات اللوجستية والمخزون</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {products.map(p => {
                      const isLow = p.stockQuantity > 0 && p.stockQuantity < 5;
                      const isOut = p.stockQuantity <= 0;
                      return (
                        <div key={p.id} className="flex flex-col md:flex-row items-center justify-between p-10 bg-slate-50 rounded-[44px] border border-slate-100 hover:shadow-lg transition-all gap-8">
                           <div className="flex items-center gap-8 w-full md:w-auto">
                              <img src={p.image} className="w-20 h-20 rounded-[28px] object-cover shadow-xl border-2 border-white" />
                              <div className="text-right">
                                <h4 className="font-bold text-brand-midnight text-lg tracking-tight">{p.name}</h4>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 block">{p.category}</span>
                              </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-12 justify-center">
                              <div className="text-center">
                                 <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">تنبؤ المخزون</span>
                                 {isOut ? (
                                   <span className="bg-red-50 text-red-500 border border-red-100 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">نفذ المخزون ❌</span>
                                 ) : isLow ? (
                                   <span className="bg-orange-50 text-orange-500 border border-orange-100 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">مخزون حرج ⚠️</span>
                                 ) : (
                                   <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">متوفر بكفاءة ✅</span>
                                 )}
                              </div>
                              <div className="flex items-center gap-6 bg-white border border-slate-100 rounded-[28px] p-3 shadow-inner">
                                 <button onClick={() => updateStock(p.id, -1)} className="w-12 h-12 rounded-[18px] hover:bg-red-50 transition-colors text-red-500 font-black text-xl active:scale-90">-</button>
                                 <span className="w-14 text-center text-3xl font-black text-brand-midnight tracking-tighter">{p.stockQuantity}</span>
                                 <button onClick={() => updateStock(p.id, 1)} className="w-12 h-12 rounded-[18px] hover:bg-green-50 transition-colors text-green-500 font-black text-xl active:scale-90">+</button>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
             )}

             {adminSubTab === 'reports' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in-up p-4">
                   <div className="p-12 bg-brand-midnight rounded-[50px] text-white shadow-3xl relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full"></div>
                      <div className="relative z-10">
                        <span className="text-[12px] font-black text-brand-primary uppercase tracking-[0.6em] mb-6 block">إجمالي العوائد الملكية</span>
                        <span className="text-7xl font-black tracking-tighter drop-shadow-lg">${financialReports.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="mt-20 pt-12 border-t border-white/10 flex justify-between relative z-10">
                         <div>
                            <span className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">العمليات الناجحة</span>
                            <span className="text-4xl font-black">{financialReports.orderCount}</span>
                         </div>
                         <div className="text-left">
                            <span className="block text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">متوسط السلة</span>
                            <span className="text-4xl font-black tracking-tighter">${Math.round(financialReports.avgOrderValue).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h3 className="text-3xl font-black text-brand-midnight mb-12 tracking-tighter">أداء الفئات الاستراتيجي</h3>
                      {Object.entries(financialReports.catStats).map(([cat, rev]) => (
                        <div key={cat} className="p-8 bg-slate-50 rounded-[35px] border border-slate-100 flex justify-between items-center hover:bg-white transition-all hover:shadow-xl group">
                           <div className="flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(50,205,50,0.5)]"></div>
                             <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-brand-midnight transition-colors">{cat}</span>
                           </div>
                           <span className="text-2xl font-black text-brand-midnight tracking-tighter">${rev.toLocaleString()}</span>
                        </div>
                      ))}
                      {Object.keys(financialReports.catStats).length === 0 && (
                        <p className="text-center py-20 text-slate-300 font-bold italic uppercase tracking-widest">لا توجد بيانات مالية مسجلة للفئات.</p>
                      )}
                   </div>
                </div>
             )}
           </div>
        </div>
      )}

      {/* Royal Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-brand-midnight/70 backdrop-blur-md animate-in fade-in duration-500 overflow-y-auto">
           <div className="bg-white w-full max-w-2xl rounded-[50px] shadow-[0_60px_150px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative print:fixed print:inset-0 print:m-0 print:rounded-none">
              <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <div className="text-right">
                    <h2 className="text-2xl font-black text-brand-midnight uppercase tracking-tighter leading-none mb-1">فاتورة مقتنيات ملكية</h2>
                    <p className="text-[11px] font-black text-brand-primary uppercase tracking-[0.4em]">Khuzai Royal Digital Receipt</p>
                 </div>
                 <div className="flex gap-3 print:hidden">
                    <button onClick={() => window.print()} className="px-6 py-3 bg-brand-midnight text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-125 transition-all shadow-lg active:scale-95 flex items-center gap-2"><span>طباعة</span> 🖨️</button>
                    <button onClick={() => setSelectedOrderForInvoice(null)} className="px-6 py-3 bg-slate-200 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all active:scale-95">إغلاق</button>
                 </div>
              </div>
              <div className="p-16 flex-1 text-right" dir="rtl">
                 <div className="flex justify-between items-start mb-16 gap-10">
                    <div>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">العميل المحترم:</span>
                       <h3 className="text-2xl font-black text-brand-midnight tracking-tight">{selectedOrderForInvoice.customerName}</h3>
                       <p className="text-sm font-bold text-slate-500 mt-2">{selectedOrderForInvoice.customerEmail}</p>
                       <p className="text-sm font-bold text-slate-500">{selectedOrderForInvoice.customerWhatsapp}</p>
                    </div>
                    <div className="text-left">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">تفاصيل السند:</span>
                       <span className="text-2xl font-black text-brand-midnight uppercase tracking-tighter">{selectedOrderForInvoice.id}</span>
                       <p className="text-sm font-bold text-slate-500 mt-2">{selectedOrderForInvoice.date}</p>
                       <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg font-black mt-2 inline-block">AUTHENTICATED</span>
                    </div>
                 </div>
                 <div className="border-t border-slate-100 pt-10 mb-16">
                    <table className="w-full text-right">
                       <thead>
                          <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                             <th className="pb-8">الوصف (القطعة المقتناة)</th>
                             <th className="pb-8 text-center">الكمية</th>
                             <th className="pb-8 text-left">القيمة الفردية</th>
                          </tr>
                       </thead>
                       <tbody>
                          {selectedOrderForInvoice.items.map((item, idx) => (
                             <tr key={idx} className="border-b border-slate-50 last:border-none group">
                                <td className="py-6 font-bold text-base text-brand-midnight">{item.name}</td>
                                <td className="py-6 text-center font-black text-sm text-slate-400">x{item.quantity}</td>
                                <td className="py-6 text-left font-black text-base text-brand-midnight tracking-tighter">{item.price}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="flex justify-between items-end border-t-2 border-brand-midnight pt-12">
                    <div className="flex flex-col gap-4">
                       <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[28px] flex items-center justify-center p-3 shadow-inner">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VERIFIED_AK_ORDER_${selectedOrderForInvoice.id}`} className="w-full h-full opacity-40 mix-blend-multiply" alt="Authenticity QR" />
                       </div>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">التحقق الرقمي من الأصالة 🛡️</span>
                    </div>
                    <div className="text-left">
                       <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">المجموع المستحق:</span>
                       <span className="text-5xl font-black text-brand-primary leading-none tracking-tighter drop-shadow-sm">{selectedOrderForInvoice.total}</span>
                       <p className="text-[10px] text-slate-300 font-bold mt-4 uppercase tracking-[0.5em]">VAT INCLUDED AT 0% (ELITE EXEMPT)</p>
                    </div>
                 </div>
              </div>
              <div className="p-12 text-center bg-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] border-t border-slate-100">
                 ALAA AL-KHUZAI LUXURY ENTERPRISE &copy; 2030 - PRIVATE COLLECTION
              </div>
           </div>
        </div>
      )}

      {showGateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-brand-midnight/80 backdrop-blur-2xl animate-in zoom-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowGateModal(false)}></div>
          <div className="relative bg-white rounded-[50px] p-16 w-full max-w-md shadow-[0_50px_150px_rgba(0,0,0,0.5)] text-center border border-white/10">
             <div className="w-24 h-24 bg-slate-50 rounded-[35px] flex items-center justify-center mx-auto mb-10 text-4xl border border-slate-100 shadow-inner group hover:scale-110 transition-transform duration-500">
               <span className="group-hover:animate-bounce">🔐</span>
             </div>
             <h3 className="text-3xl font-black text-brand-midnight mb-4 tracking-tighter">المصادقة الإدارية</h3>
             <p className="text-slate-400 text-sm mb-12 font-bold leading-relaxed">يرجى إدخال رمز العبور السري للوصول للأنظمة الإدارية الخاصة بمجموعة الخزاعي.</p>
             <form onSubmit={handleAdminGateAttempt} className="space-y-8">
                <input 
                  type="password" 
                  value={gatePassword} 
                  onChange={(e) => setGatePassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[28px] py-6 px-10 text-center text-3xl font-black tracking-[0.8em] outline-none focus:border-brand-primary transition-all shadow-inner placeholder:text-slate-200" 
                  autoFocus 
                />
                <button type="submit" className="w-full py-6 accent-gradient text-white font-black rounded-[28px] shadow-2xl uppercase tracking-[0.3em] text-sm hover:brightness-110 active:scale-95 transition-all">تأكيد المصادقة 🗝️</button>
             </form>
             <button onClick={() => setShowGateModal(false)} className="mt-8 text-[11px] font-black text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]">إلغاء الوصول</button>
          </div>
        </div>
      )}

      {/* Common Modals & Utilities */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onAddProduct={addProduct} 
        onUpdateProduct={updateProduct} 
        onToggle={() => setIsAdminOpen(false)} 
        categories={categoriesWithCounts} 
        onAddCategory={(n) => setCategories([...categories, { id: Date.now().toString(), name: n, isActive: true, productCount: 0 }])} 
        onDeleteCategory={(id) => setCategories(categories.filter(c => c.id !== id))} 
        onToggleCategory={(id) => setCategories(categories.map(c => c.id === id ? {...c, isActive: !c.isActive} : c))} 
        editingProduct={editingProduct} 
        setEditingProduct={setEditingProduct} 
        onUpdateLogo={(l) => setCustomLogo(l)} 
        onUpdateFavicon={(f) => setCustomFavicon(f)} 
        onUpdateHeroImage={(h) => setBrandHeroImage(h)} 
        onUpdateAdminPassword={(p) => setAdminPassword(p)} 
        currentLogo={customLogo} 
        currentFavicon={customFavicon} 
        currentHeroImage={brandHeroImage} 
        currentAdminPassword={adminPassword} 
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={(id) => setCart(cart.filter(i => i.id !== id))} 
        onUpdateQty={(id, d) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} 
        onCheckout={() => { if (cart.length > 0) setPayingProduct(cart[0]); setIsCartOpen(false); }} 
      />
      
      <CustomerOrdersModal isOpen={isCustomerOrdersOpen} onClose={() => setIsCustomerOrdersOpen(false)} orders={orders} />
      
      {successOrderId && (
        <OrderSuccessModal 
          orderId={successOrderId} 
          onClose={() => setSuccessOrderId(null)} 
          onViewOrders={() => { setSuccessOrderId(null); setIsCustomerOrdersOpen(true); }} 
        />
      )}
      
      <RoyalConcierge />
      
      {viewingProduct && (
        <ProductDetailsModal 
          product={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
          onBuy={() => addToCart(viewingProduct)} 
          onAddReview={() => {}} 
          currentUser={currentUser} 
        />
      )}
      
      {payingProduct && (
        <PaymentModal 
          product={payingProduct} 
          onClose={() => setPayingProduct(null)} 
          onConfirm={(data) => {
             const totalVal = cart.length > 0 
                ? cart.reduce((s, i) => s + (parseFloat(i.price.replace(/[^0-9.]/g, '')) * i.quantity), 0) 
                : parseFloat(payingProduct.price.replace(/[^0-9.]/g, ''));
             createOrder(cart.length > 0 ? cart : [{...payingProduct, quantity: 1}], `$${totalVal.toLocaleString()}`, data);
          }} 
        />
      )}
      
      <footer className="bg-brand-midnight text-white pt-32 pb-20 text-center mt-auto border-t border-white/5 relative overflow-hidden">
        {brandHeroImage && (
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none blur-3xl scale-125">
              <img src={brandHeroImage} className="w-full h-full object-cover" />
           </div>
        )}
        <div className="relative z-10 flex flex-col items-center px-10">
          <LogoComponent className="h-24 w-auto min-w-[6rem] text-5xl mb-12 hover:scale-110 transition-transform duration-700 cursor-pointer" />
          <p className="text-[11px] text-white/30 font-black uppercase tracking-[1em] mb-12 leading-loose max-w-xl mx-auto">
            ALAA AL-KHUZAI LUXURY ENTERPRISE &copy; 2030<br/>DEFINING THE FUTURE OF DIGITAL COMMERCE
          </p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-30 text-[11px] font-black uppercase tracking-[0.3em]">
            <span className="hover:opacity-100 cursor-pointer transition-opacity hover:text-brand-primary">الشروط والأحكام</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity hover:text-brand-primary">سياسة الخصوصية</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity hover:text-brand-primary">دليل الشحن الملكي</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity hover:text-brand-primary">دعم كبار الملاك</span>
          </div>
          <div className="mt-20 flex gap-10 opacity-10">
             <span className="text-4xl">VISA</span>
             <span className="text-4xl">MASTERCARD</span>
             <span className="text-4xl">APPLE PAY</span>
             <span className="text-4xl">CRYPTO</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
