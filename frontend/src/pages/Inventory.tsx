import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertTriangle, X, Package } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useSuppliers } from '../hooks/useApi';
import ProductsTable from '../components/ProductsTable';
import { Product } from '../types';
import { formatApiError } from '../lib/errors';
import { CATEGORY_UZ } from '../lib/uz';

const Inventory: React.FC = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: suppliers } = useSuppliers();
  const limit = 10;
  const { data, isLoading } = useProducts({ page, limit, category, stockStatus, search: debouncedSearch });
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState("Men's");
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formMinStock, setFormMinStock] = useState(10);
  const [formSupplier, setFormSupplier] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormSku(`WH-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormName(''); setFormCategory("Men's"); setFormPrice(25); setFormStock(50); setFormMinStock(10);
    setFormSupplier(suppliers?.[0]?.code || '');
    setFormError(null); setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormSku(p.sku); setFormName(p.name); setFormCategory(p.category);
    setFormPrice(p.price); setFormStock(p.stock_quantity); setFormMinStock(p.min_stock_level);
    setFormSupplier(p.supplier_id || '');
    setFormError(null); setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      sku: formSku, name: formName, category: formCategory,
      price: Number(formPrice), stock_quantity: Number(formStock),
      min_stock_level: Number(formMinStock), supplier_id: formSupplier || null,
    };
    if (payload.price <= 0 || payload.stock_quantity < 0 || payload.min_stock_level < 0) {
      setFormError("Noto'g'ri raqamlar."); return;
    }
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({ id: editingProduct.id, data: payload });
      } else {
        await createProductMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(formatApiError(err, "Mahsulotni saqlab bo'lmadi."));
    }
  };

  const handleDelete = async (id: number) => {
    try { await deleteProductMutation.mutateAsync(id); }
    catch (err: any) { alert(formatApiError(err, "Mahsulotni o'chirib bo'lmadi.")); }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const hasLowStock = data?.items.some(p => p.stock_quantity <= p.min_stock_level);

  const inputStyle = {
    width: '100%', borderRadius: '12px', padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    color: '#f1f5f9', fontSize: '14px', outline: 'none',
  };

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Ombor katalogi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Zaxira boshqaruvi, minimal signallar va mahsulot parametrlari</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-xs">
          <Plus size={15} />
          Yangi mahsulot
        </button>
      </div>

      {/* Low stock alert */}
      {hasLowStock && (
        <div className="flex items-start gap-3.5 p-4 rounded-2xl animate-pulse-glow"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-400">Kam zaxira ogohlantirishi</p>
            <p className="text-xs text-slate-400 mt-0.5">Ba'zi mahsulotlar minimal darajadan past. Tez orada buyurtma bering.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 p-4 rounded-2xl"
        style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Nom yoki SKU bo'yicha..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          />
        </div>

        {/* Category */}
        <div className="relative">
          <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-300 outline-none appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <option value="" style={{ background: '#0e1420' }}>Barcha kategoriyalar</option>
            {["Men's","Women's","Kids","Accessories"].map(c => (
              <option key={c} value={c} style={{ background: '#0e1420' }}>{CATEGORY_UZ[c] || c}</option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div className="relative">
          <AlertTriangle size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          <select value={stockStatus} onChange={e => { setStockStatus(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-300 outline-none appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <option value="" style={{ background: '#0e1420' }}>Barcha holatlari</option>
            <option value="low" style={{ background: '#0e1420' }}>Kam / tugagan</option>
            <option value="out_of_stock" style={{ background: '#0e1420' }}>Tugagan</option>
            <option value="normal" style={{ background: '#0e1420' }}>Normal</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <ProductsTable products={data?.items} isLoading={isLoading} onEdit={openEditModal} onDelete={handleDelete} />

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{((page-1)*limit)+1}–{Math.min(page*limit, data.total)} / {data.total} ta</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              className="px-3 py-1.5 rounded-lg font-medium disabled:opacity-30 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }}>
              ← Oldingi
            </button>
            <span className="font-bold text-white px-1">{page}/{totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="px-3 py-1.5 rounded-lg font-medium disabled:opacity-30 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }}>
              Keyingi →
            </button>
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl p-6 animate-scale-in"
            style={{ background: '#0e1420', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Package size={16} className="text-gold-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? `Tahrirlash: ${editingProduct.name}` : 'Yangi mahsulot'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                <X size={15} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 rounded-xl text-xs font-semibold text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">SKU kodi</label>
                  <input type="text" required value={formSku} onChange={e => setFormSku(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Kategoriya</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={inputStyle}>
                    {["Men's","Women's","Kids","Accessories"].map(c => (
                      <option key={c} value={c} style={{ background: '#0e1420' }}>{CATEGORY_UZ[c]||c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Mahsulot nomi</label>
                <input type="text" required value={formName} onChange={e => setFormName(e.target.value)}
                  placeholder="masalan: Vintage Denim Trouser" style={inputStyle} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Narx ($)</label>
                  <input type="number" step="0.01" required value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Ombor miqdori</label>
                  <input type="number" required value={formStock} onChange={e => setFormStock(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Min. zaxira</label>
                  <input type="number" required value={formMinStock} onChange={e => setFormMinStock(Number(e.target.value))} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Ta'minotchi (SRM)</label>
                <select value={formSupplier} onChange={e => setFormSupplier(e.target.value)} style={inputStyle}>
                  <option value="" style={{ background: '#0e1420' }}>— Tanlanmagan —</option>
                  {suppliers?.map(s => <option key={s.id} value={s.code} style={{ background: '#0e1420' }}>{s.code} — {s.name}</option>)}
                </select>
                {(!suppliers?.length) && (
                  <p className="text-[10px] text-amber-400 mt-1">Avval SRM bo'limida ta'minotchi qo'shing.</p>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost text-xs">Bekor</button>
                <button type="submit" className="btn-primary text-xs">
                  {editingProduct ? 'Saqlash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
