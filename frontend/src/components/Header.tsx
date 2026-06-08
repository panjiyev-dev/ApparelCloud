import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, Menu, Settings, LogOut, ChevronRight } from 'lucide-react';
import { FOCUS_SEARCH_EVENT } from '../lib/preferences';
import { ROLE_UZ } from '../lib/uz';

interface HeaderProps {
  onMenuToggle: () => void;
  user: { full_name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const breadcrumbMap: Record<string, string> = {
  inventory:  'Ombor (WMS)',
  orders:     'Buyurtmalar',
  clients:    'Mijozlar',
  suppliers:  "Ta'minotchilar",
  analytics:  'Statistika',
  settings:   'Sozlamalar',
};

const Header: React.FC<HeaderProps> = ({ onMenuToggle, user, onLogout }) => {
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pathnames = location.pathname.split('/').filter(Boolean);

  const focusSearch = () => searchInputRef.current?.focus();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(FOCUS_SEARCH_EVENT, focusSearch);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(FOCUS_SEARCH_EVENT, focusSearch);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-5 h-[60px]"
      style={{
        background: 'rgba(8,12,20,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* ── Left: hamburger + breadcrumb ─────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm min-w-0">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-300 font-medium transition-colors whitespace-nowrap"
          >
            sar
          </Link>
          {pathnames.map((seg, idx) => {
            const isLast = idx === pathnames.length - 1;
            const to = `/${pathnames.slice(0, idx + 1).join('/')}`;
            const label = breadcrumbMap[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
            return (
              <React.Fragment key={to}>
                <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
                {isLast ? (
                  <span className="text-white font-semibold truncate">{label}</span>
                ) : (
                  <Link to={to} className="text-slate-500 hover:text-slate-300 transition-colors truncate">
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* ── Right: search + notif + avatar ───────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Qidiruv..."
            className="h-9 w-52 pl-9 pr-14 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          />
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-600 select-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all duration-150"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
          >
            <Bell size={16} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse-glow"
              style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.7)' }}
            />
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-2xl p-1 animate-scale-in z-50"
              style={{ background: '#0e1420', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-semibold text-white">Bildirishnomalar</p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black"
                  style={{ background: '#D4AF37' }}
                >
                  Yangi
                </span>
              </div>
              <div className="py-2 px-2 space-y-1">
                {[
                  { title: 'Kam zaxira ogohlantirishi', sub: 'Ba\'zi mahsulotlar tugamoqda', time: '2 daqiqa' },
                  { title: 'Yangi buyurtma keldi', sub: 'Buyurtma #ORD-2024-001', time: '15 daqiqa' },
                  { title: 'Hisobot tayyor', sub: 'Oylik savdo hisoboti', time: '1 soat' },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors"
                    style={{ ':hover': { background: 'rgba(255,255,255,0.04)' } }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: i === 0 ? '#ef4444' : '#D4AF37' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{n.sub}</p>
                    </div>
                    <span className="text-[10px] text-slate-600 flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar + dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-all duration-150"
              style={{
                border: profileOpen ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)' }}
              >
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-white leading-none">{user.full_name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{ROLE_UZ[user.role] || user.role}</p>
              </div>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl overflow-hidden animate-scale-in z-50"
                style={{ background: '#0e1420', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
              >
                <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-semibold text-white">{user.full_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings size={15} className="text-slate-500" />
                    <span>Sozlamalar</span>
                  </Link>
                </div>
                <div className="p-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 transition-all"
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={15} />
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
