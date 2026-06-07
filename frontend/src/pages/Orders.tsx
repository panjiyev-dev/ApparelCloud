import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, Filter, X, ShoppingBag, Trash2, PackageCheck } from 'lucide-react';
import {
  useOrders, useCreateOrder, useUpdateOrderStatus,
  useClients, useProducts
} from '../hooks/useApi';
import OrdersTable from '../components/OrdersTable';
import { Order } from '../types';
import { ORDER_STATUS_UZ } from '../lib/uz';
import { formatApiError } from '../lib/errors';

const STATUS_LIST = ['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;

const Orders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [orderItems, setOrderItems] = useState<{ product_id: number; name: string; sku: string; price: number; quantity: number; availableStock: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [addItemQty, setAddItemQty] = useState(1);
  const [createError, setCreateError] = useState<string | null>(null);

  const limit = 10;
  const { data: ordersData, isLoading } = useOrders({ page, limit, status: statusFilter || undefined });
  const { data: clients } = useClients();
  const { data: productsData } = useProducts({ page: 1, limit: 100 });
  const createOrderMutation = useCreateOrder();
  const updateStatusMutation = useUpdateOrderStatus();

  const orderIdParam = searchParams.get('id');
  useEffect(() => {
    if (orderIdParam && ordersData) {
      const match = ordersData.items.find(o => o.id === Number(orderIdParam));
      if (match) { setSelectedOrder(match); setIsDetailOpen(true); }
    }
  }, [orderIdParam, ordersData]);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      const updated = await updateStatusMutation.mutateAsync({ id: selectedOrder.id, status: newStatus });
      setSelectedOrder(updated);
    } catch (err: any) {
      alert(formatApiError(err, "Buyurtma holatini yangilab bo’lmadi."));
    }
  };

  const addOrderItem = () => {
    if (!selectedProductId) return;
    const prod = productsData?.items.find(p => p.id === Number(selectedProductId));
    if (!prod) return;
    if (orderItems.find(i => i.product_id === prod.id)) { alert("Mahsulot allaqachon qo'shilgan."); return; }
    if (prod.stock_quantity < addItemQty) { alert(`Omborda ${prod.stock_quantity} dona mavjud.`); return; }
    setOrderItems(prev => [...prev, {
      product_id: prod.id, name: prod.name, sku: prod.sku,
      price: prod.price, quantity: addItemQty, availableStock: prod.stock_quantity
    }]);
    setSelectedProductId('');
    setAddItemQty(1);
  };

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!selectedClientId) { setCreateError('B2B mijozni tanlang.'); return; }
    if (!orderItems.length) { setCreateError("Kamida bitta mahsulot qo'shing."); return; }
    try {
      await createOrderMutation.mutateAsync({
        client_id: Number(selectedClientId),
        items: orderItems.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      setIsCreateOpen(false);
      setSelectedClientId('');
      setOrderItems([]);
    } catch (err: any) {
      setCreateError(formatApiError(err, "Buyurtma yaratib bo'lmadi."));
    }
  };

  const totalAmount = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalPages = ordersData ? Math.ceil(ordersData.total / limit) : 0;
  const hasClients = !!(clients?.length);
  const hasProducts = !!(productsData?.items.length);
  const canCreate = hasClients && hasProducts;

  const modalBase = {
    position: 'fixed' as const, inset: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
  };
  const modalCard = {
    position: 'relative' as const, width: '100%', maxWidth: '680px',
    borderRadius: '20px',
    background: '#0e1420',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  };
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
          <h1 className="text-2xl font-black text-white">Buyurtmalar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ulgurji buyurtmalar, yetkazish holati va hisob-faktura</p>
        </div>
        <button
          onClick={() => { setCreateError(null); setIsCreateOpen(true); }}
          className="btn-primary text-xs"
        >
          <Plus size={15} />
          Yangi buyurtma
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-2 p-4 rounded-2xl"
        style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mr-1">
          <Filter size={12} />
          <span>Holat:</span>
        </div>
        {STATUS_LIST.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={statusFilter === s
              ? { background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
            }
          >
            {s ? (ORDER_STATUS_UZ[s] || s) : 'Barchasi'}
          </button>
        ))}
      </div>

      {/* Table */}
      <OrdersTable orders={ordersData?.items} isLoading={isLoading} onRowClick={o => { setSelectedOrder(o); setIsDetailOpen(true); }} />

      {/* Pagination */}
      {ordersData && ordersData.total > limit && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{((page-1)*limit)+1}–{Math.min(page*limit, ordersData.total)} / {ordersData.total} ta</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }}
            >← Oldingi</button>
            <span className="font-bold text-white px-1">{page}/{totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }}
            >Keyingi →</button>
          </div>
        </div>
      )}

      {/* ── Order detail modal ──────────────────────── */}
      {isDetailOpen && selectedOrder && (
        <div style={modalBase} onClick={() => setIsDetailOpen(false)}>
          <div style={modalCard} onClick={e => e.stopPropagation()}>
            <div className="p-6">
              {/* Top */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-1">Buyurtma tafsilotlari</p>
                  <h3 className="text-xl font-black text-white">{selectedOrder.order_number}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
                    style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}
                  >
                    {(['Pending','Processing','Shipped','Delivered','Cancelled'] as const).map(s => (
                      <option key={s} value={s} style={{ background: '#0e1420' }}>{ORDER_STATUS_UZ[s]}</option>
                    ))}
                  </select>
                  <button onClick={() => setIsDetailOpen(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Client card */}
              {selectedOrder.client && (
                <div className="p-4 rounded-2xl mb-5 grid grid-cols-2 gap-4 text-xs"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-slate-600 font-semibold uppercase tracking-widest mb-1">Mijoz</p>
                    <p className="text-white font-bold text-sm">{selectedOrder.client.company_name}</p>
                    <p className="text-slate-400 mt-0.5">Mas'ul: {selectedOrder.client.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold uppercase tracking-widest mb-1">Manzil</p>
                    <p className="text-slate-300 mt-0.5 truncate">{selectedOrder.client.address}</p>
                    <p className="text-slate-400 mt-0.5">{selectedOrder.client.phone}</p>
                  </div>
                </div>
              )}

              {/* Items table */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Buyurtma qatorlari</p>
              <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {['SKU','Nom','Birlik narxi','Miqdor','Jami'].map((h,i) => (
                        <th key={h} className="py-2.5 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider"
                          style={{ textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map(item => (
                      <tr key={item.id} className="border-t border-white/[0.04]">
                        <td className="py-2.5 px-4 font-mono font-bold text-gold-400">{item.product?.sku ?? 'N/A'}</td>
                        <td className="py-2.5 px-4 font-medium text-white">{item.product?.name ?? 'Noma\'lum'}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-400">${item.unit_price.toFixed(2)}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-300">{item.quantity.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                          ${(item.unit_price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs text-slate-500">{selectedOrder.items_count} dona mahsulot</span>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Umumiy summa</p>
                  <p className="text-2xl font-black font-mono text-white">
                    ${selectedOrder.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create order modal ──────────────────────── */}
      {isCreateOpen && (
        <div style={modalBase} onClick={() => setIsCreateOpen(false)}>
          <div style={modalCard} onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <ShoppingBag size={16} className="text-gold-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Yangi B2B buyurtma</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                  <X size={15} />
                </button>
              </div>

              {!canCreate && (
                <div className="mb-5 p-4 rounded-xl text-xs space-y-2"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="font-bold text-amber-400">Buyurtma yaratish uchun kerak:</p>
                  {!hasClients && (
                    <p className="text-amber-200/70">• <Link to="/clients" onClick={() => setIsCreateOpen(false)} className="text-gold-400 underline">Kamida bitta mijoz</Link></p>
                  )}
                  {!hasProducts && (
                    <p className="text-amber-200/70">• <Link to="/inventory" onClick={() => setIsCreateOpen(false)} className="text-gold-400 underline">Kamida bitta mahsulot</Link></p>
                  )}
                </div>
              )}

              {createError && (
                <div className="mb-5 p-4 rounded-xl text-xs font-semibold text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateOrderSubmit} className="space-y-5">
                {/* Client select */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">B2B Mijoz</label>
                  <select required disabled={!hasClients} value={selectedClientId}
                    onChange={e => setSelectedClientId(e.target.value ? Number(e.target.value) : '')}
                    style={inputStyle}>
                    <option value="" style={{ background: '#0e1420' }}>— Mijozni tanlang —</option>
                    {clients?.map(c => <option key={c.id} value={c.id} style={{ background: '#0e1420' }}>{c.company_name}</option>)}
                  </select>
                </div>

                {/* Product add row */}
                <div className="p-4 rounded-2xl space-y-3"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Mahsulot qo'shish</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <select disabled={!hasProducts} value={selectedProductId}
                        onChange={e => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}
                        style={{ ...inputStyle, fontSize: '13px' }}>
                        <option value="" style={{ background: '#0e1420' }}>— Mahsulotni tanlang —</option>
                        {productsData?.items.map(p => (
                          <option key={p.id} value={p.id} disabled={p.stock_quantity <= 0} style={{ background: '#0e1420' }}>
                            {p.name} ({p.sku}) [zaxira: {p.stock_quantity}]
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input type="number" min="1" disabled={!hasProducts} value={addItemQty}
                        onChange={e => setAddItemQty(Math.max(1, Number(e.target.value)||1))}
                        style={{ ...inputStyle, width: '70px' }} />
                      <button type="button" onClick={addOrderItem} disabled={!selectedProductId || !hasProducts}
                        className="flex-1 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                        style={{ background: 'rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                        Qo'shish
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cart */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Savat</p>
                  <div className="rounded-xl overflow-hidden max-h-48 overflow-y-auto"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {['SKU','Nom','Narx','Miqdor','Jami',''].map(h => (
                            <th key={h} className="py-2 px-3 font-bold text-slate-600 uppercase text-[10px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!orderItems.length ? (
                          <tr><td colSpan={6} className="py-8 text-center text-slate-600">Savat bo'sh</td></tr>
                        ) : orderItems.map((item, i) => (
                          <tr key={i} className="border-t border-white/[0.04]">
                            <td className="py-2 px-3 font-mono text-gold-400">{item.sku}</td>
                            <td className="py-2 px-3 text-white font-medium truncate max-w-[100px]">{item.name}</td>
                            <td className="py-2 px-3 font-mono text-slate-400">${item.price.toFixed(2)}</td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-300">{item.quantity}</td>
                            <td className="py-2 px-3 font-mono font-bold text-white">${(item.price*item.quantity).toFixed(2)}</td>
                            <td className="py-2 px-3">
                              <button type="button" onClick={() => setOrderItems(prev => prev.filter((_,j) => j!==i))}
                                className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-xs text-slate-500">Buyurtma jami</p>
                    <p className="text-xl font-black font-mono text-white">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsCreateOpen(false)} className="btn-ghost text-xs">Bekor</button>
                    <button type="submit" disabled={!canCreate || !orderItems.length} className="btn-primary text-xs">
                      <PackageCheck size={14} />
                      Buyurtmani yuborish
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
