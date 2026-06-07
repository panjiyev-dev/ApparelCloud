import React, { useEffect, useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin, User, X, Truck } from 'lucide-react';
import { useSuppliers, useCreateSupplier } from '../hooks/useApi';
import { formatApiError } from '../lib/errors';

const Suppliers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: suppliers, isLoading } = useSuppliers(debouncedSearch);
  const createSupplierMutation = useCreateSupplier();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState("O'zbekiston");
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setCode(`SUP-${101 + (suppliers?.length ?? 0)}`);
    setName(''); setContactPerson(''); setEmail(''); setPhone('');
    setCountry("O'zbekiston"); setFormError(null); setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createSupplierMutation.mutateAsync({ code: code.trim().toUpperCase(), name, contact_person: contactPerson, email, phone, country });
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(formatApiError(err, "Ta'minotchini qo'shib bo'lmadi."));
    }
  };

  const inputStyle = {
    width: '100%', borderRadius: '12px', padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    color: '#f1f5f9', fontSize: '14px', outline: 'none',
  };

  const accentColors = ['#D4AF37', '#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Ta'minotchilar (SRM)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Yetkazib beruvchilar, aloqa ma'lumotlari va kodlar</p>
        </div>
        <button onClick={openAddModal} disabled={createSupplierMutation.isPending} className="btn-primary text-xs">
          <Plus size={15} />
          Yangi ta'minotchi
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Nom, kod yoki email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 space-y-4"
              style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : !suppliers?.length ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: 'rgba(14,20,32,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <Truck size={24} className="text-gold-400" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Ta'minotchilar topilmadi</p>
          <p className="text-xs text-slate-500 mb-4">Birinchi ta'minotchini qo'shing</p>
          <button onClick={openAddModal} className="btn-primary text-xs px-4 py-2">
            <Plus size={14} />
            Birinchi ta'minotchi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {suppliers.map((s, idx) => {
            const color = accentColors[idx % accentColors.length];
            return (
              <div key={s.id} className="group relative rounded-2xl p-5 card-hover"
                style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                      <Truck size={16} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">{s.name}</p>
                      <p className="text-[10px] text-slate-500">{s.country}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                    style={{ color, background: `${color}14`, border: `1px solid ${color}20` }}>
                    {s.code}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <User size={12} style={{ color }} className="flex-shrink-0" />
                    <span>Mas'ul: <span className="text-slate-300 font-medium">{s.contact_person}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Mail size={12} style={{ color }} className="flex-shrink-0" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Phone size={12} style={{ color }} className="flex-shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <MapPin size={12} style={{ color }} className="flex-shrink-0" />
                    <span>{s.country}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={s.is_active
                      ? { color: '#10b981', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }
                      : { color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {s.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </div>

                {/* Hover bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl p-6 animate-scale-in"
            style={{ background: '#0e1420', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Truck size={16} className="text-gold-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Yangi ta'minotchi</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                <X size={15} />
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-4 rounded-xl text-xs font-semibold text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Kod (SKU)</label>
                  <input type="text" required value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="SUP-109" style={{ ...inputStyle, fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Mamlakat</label>
                  <input type="text" required value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Kompaniya nomi</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Toshkent Tekstil" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Mas'ul shaxs</label>
                  <input type="text" required value={contactPerson} onChange={e => setContactPerson(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Telefon</label>
                  <input type="text" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+998901234567" style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              </div>
              <div className="flex justify-end gap-2.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost text-xs">Bekor</button>
                <button type="submit" disabled={createSupplierMutation.isPending} className="btn-primary text-xs">
                  {createSupplierMutation.isPending ? 'Saqlanmoqda...' : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
