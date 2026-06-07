import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, MapPin, User, X, Users } from 'lucide-react';
import { useClients, useCreateClient } from '../hooks/useApi';
import { formatApiError } from '../lib/errors';

const Clients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: clients, isLoading } = useClients(debouncedSearch);
  const createClientMutation = useCreateClient();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setCompanyName(''); setContactPerson(''); setEmail(''); setPhone(''); setAddress('');
    setFormError(null); setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createClientMutation.mutateAsync({ company_name: companyName, contact_person: contactPerson, email, phone, address });
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(formatApiError(err, "Mijozni ro'yxatdan o'tkazib bo'lmadi."));
    }
  };

  const inputStyle = {
    width: '100%', borderRadius: '12px', padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    color: '#f1f5f9', fontSize: '14px', outline: 'none',
  };

  const avatarColors = ['#D4AF37', '#6366f1', '#10b981', '#3b82f6', '#ec4899', '#f59e0b'];

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">B2B Mijozlar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ulgurji xaridorlar va kontakt ma'lumotlari</p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-xs">
          <Plus size={15} />
          Yangi mijoz
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Kompaniya yoki kontakt..."
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
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : !clients?.length ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ background: 'rgba(14,20,32,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <Users size={24} className="text-gold-400" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Mijozlar topilmadi</p>
          <p className="text-xs text-slate-500 mb-4">Yangi B2B mijoz qo'shish uchun bosing</p>
          <button onClick={openAddModal} className="btn-primary text-xs px-4 py-2">
            <Plus size={14} />
            Birinchi mijozni qo'shish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((c, idx) => {
            const color = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={c.id}
                className="group relative rounded-2xl p-5 card-hover"
                style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-6 right-6 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                      {c.company_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight group-hover:text-gold-400 transition-colors">{c.company_name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">ID: #{c.id}</p>
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={c.is_active
                      ? { color: '#10b981', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }
                      : { color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {c.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <User size={12} style={{ color }} className="flex-shrink-0" />
                    <span>Mas'ul: <span className="text-slate-300 font-medium">{c.contact_person}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Mail size={12} style={{ color }} className="flex-shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Phone size={12} style={{ color }} className="flex-shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-400">
                    <MapPin size={12} style={{ color }} className="flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{c.address}</span>
                  </div>
                </div>

                {/* Bottom hover bar */}
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 animate-scale-in"
            style={{ background: '#0e1420', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Users size={16} className="text-gold-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Yangi B2B Mijoz</h3>
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
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Kompaniya nomi</label>
                <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="masalan: Fashion Hub Ltd" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Mas'ul shaxs</label>
                  <input type="text" required value={contactPerson} onChange={e => setContactPerson(e.target.value)}
                    placeholder="John Doe" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Telefon</label>
                  <input type="text" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67" style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="purchase@fashionhub.com" style={inputStyle} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Yetkazib berish manzili</label>
                <textarea required rows={3} value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Manzilni kiriting..." style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <div className="flex justify-end gap-2.5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost text-xs">Bekor</button>
                <button type="submit" disabled={createClientMutation.isPending} className="btn-primary text-xs">
                  {createClientMutation.isPending ? 'Saqlanmoqda...' : "Ro'yxatdan o'tkazish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
